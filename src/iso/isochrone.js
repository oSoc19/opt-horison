import Planner from 'plannerjs';
import intersect from '@turf/intersect';
import area from '@turf/area';
import centerOfMass from '@turf/center-of-mass';
import Feature from '../models/Feature';
import FeatureCollection from '../models/FeatureCollection';
import ResultContainer from '../models/ResultContainer';
import Coordinates from '../models/Coordinates';

/*
 * local location variables and function, useful for learning your way around the code. 
let bosa = new Coordinates(4.356331, 50.860699);
let herman = new Coordinates(4.350018, 50.865685);
let KBC = new Coordinates(4.346777, 50.860929);
let Gaucheret = new Coordinates(4.360043, 50.864025);
let AllPedestrians = ["PEDESTRIAN","PEDESTRIAN","PEDESTRIAN","PEDESTRIAN"];
let AllCars = ["http://hdelva.be/profile/car", "http://hdelva.be/profile/car", "http://hdelva.be/profile/car", "http://hdelva.be/profile/car"];
let CarsAndPedestrians = ["PEDESTRIAN", "http://hdelva.be/profile/car", "PEDESTRIAN", "http://hdelva.be/profile/car"];
async function run() {
    var overlap = await multipleOverlap([bosa, herman, KBC, Gaucheret], CarsAndPedestrians, [15, 10, 20, 10]);
    return overlap;
}
*/

/** This function is the main function of our program.
 *  It will calculate a  ResultContainer (documented in ResultContainer class) based upon 3 lists.
 *      -The first list contains the coordinates of each participant. ([[longitude ,latitude]])
 *      -The second list contains the mode of transport for every participant.(['car', 'walk'])
 *      -The third list contains the maximum amount of travel time for each participant.(([10, 15]))
 * The function will do the following with the input:
 *      -Convert the array of modes to profiles that can be used by planner.js.
 *      -Convert the array of coordinates to Coordinates objects.
 *      -Instantiate generators for each location, set their appropriate profile and store them in a list.
 *      -instantiate a collection of FeatureCollections.
 *      -generate the intervals for the generation of the isochrones.
 *      -loop: (as long as there are intervals left and checkOverlap() passes)
 *          >generate the isochrone of every location
 *          >save this isochrone in the collection of FeatureCollections for every user
 *          >check if the generated isochrones overlap
 *      -if there is no overlap after the loop set the center and resultingOverlap to null.
 *      -otherwhise calculate the center of the overlap that was found and return both, together with the collection of FeatureCollections in the ResultContainer.
 *  
*/
async function multipleOverlap(coordinates, modes, maxes) {   
    var profiles = convertModesToProfiles(modes);
    var locations = convertCoordinatesArrayToObject(coordinates);
    //make generators 
    var generators = [];
    var collections = [];
    var profileIndex = 0;
    for (const loc of locations) {
        var generator = makeGenerator(loc); 
        await generator.setProfileID(profiles[profileIndex]);
        generators.push(generator);
        collections.push(new FeatureCollection());
        profileIndex++;      
    }
    // generate intervals
    var intervalArray = generateIntervalArray(maxes);
    var overlap = null;
    if (intervalArray.length > 0) {
        var i = 0;
        while (i < intervalArray[0].length && checkOverlap(overlap)) {        
            var tempIsochrones = [];
            var j = 0;
            for (let generator of generators) {// generate the isochrones at time for all generators and store them so we can intersect
                var time = intervalArray[j][i];
                //console.log("time: " + time);
                let isochrone = await generateIsochroneFromGenerator(generator, time);
                collections[j].addOneFeature(isochrone);
                tempIsochrones.push(isochrone);
                j++;            
            }
            overlap = multipleIntersection(tempIsochrones);  
            i++;    
        }
    }
    var resultingOverlap = new Feature();
    var center = null;

    if (overlap == null) {
        //console.log("no overlap found within max");
    } else {
        //console.log("overlap: "+ overlap);
        resultingOverlap = overlap;
        center = centerOfMass(overlap);
        //console.log("center:",center);
    }

    return new ResultContainer(resultingOverlap, collections, center);
}

/** This function generates the array of intervals, based on the array of maximum travel times for each user. */
function generateIntervalArray(maxes) {
    var maximums = adjustMax(maxes);
    var result = [];
    for (const maximum of maximums) {
        var intervals = generateIntervals(maximum);
        result.push(intervals);
    }
    return result;
}

/** This function adjusts the array of maximum walking times so that the smallest maximum is 5 minutes. */
function adjustMax(maxes) {
    for (let i = 0; i < maxes.length; i++) {
        if (maxes[i] < 5) {
            maxes[i] = 5;
        }
    }
    return maxes;
}

/** This function checks if the overlap is null or smaller than the minimal area. */
function checkOverlap(overlap) {
    var minimalArea = 10000;//a bit smaller than two soccer fields.
    if (overlap == null) {
        return true;
    } else {
        return (area(overlap) < minimalArea);
    }

}

/** This function, given a list of isochrones, calculates the area where they all overlap. 
 * If there is no such area this function returns null. */
function multipleIntersection(isochrones) {
    var result = null;
    if (isochrones.length < 1) {
        return result;
    } else if (isochrones.length === 1) {
        result = isochrones[0];
    } else {
        result = intersect(isochrones.pop(), isochrones.pop());
    }
    while (result != null && isochrones.length >0) {
        result = intersect(result, isochrones.pop());
    }
    if (result == null) {
        //console.log("no overlap found");
    } else {
        //console.log("there is a overlap");
    }
    return result;
}

/** This function returns a FeatureCollection with all the isochrones for a given location that are within the max amount of time for a certain profile.
 *  Tis function is currently not used by the application however it is a good function for getting to know the code.
 *  This function might also be very useful for precalculating isochrones.
 */
async function generateAllIsoChrones(location, profile, max) {
    let generator = makeGenerator(location);
    await generator.setProfileID(profile);
    let collection = new FeatureCollection();
    let intervals = generateIntervals(max);
    for (let interval of intervals) {
        let isochrone = await generateIsochroneFromGenerator(generator, interval);
        collection.addOneFeature(isochrone);
    }
    return collection;
}

/** This function returns the array of intervals given the maximum amount of time. */
function generateIntervals(max) {
    let NbOfIsos = 5;// indicates the amount of isochrones we would like to calculate.
    let delta = max/NbOfIsos;
    let intervals = [];
    for (let i = 1; i <= NbOfIsos; i++) {
        intervals.push(i*delta);
    }
    return intervals;
}

/** This function returns a new feature containing the Isochrone generated by the given generator,
 *  that lays at the given amount of time.
*/
async function generateIsochroneFromGenerator(generator, timeInMinutes) {
    var data = await generator.getIsochrone(scaleTime(timeInMinutes), true);
    var polygon = convertToPolygon(data.isochrones[0]); //only take the first isochrone, don't take holes into account.
    return new Feature(polygon, scaleTime(timeInMinutes));
}

/** This function initializes a IsochroneGenerator for a given location.*/
function makeGenerator(location) {
    return new Planner.IsochroneGenerator(location);
}

/** This function, given an isochrone generatad by the isochrone generator from planner.js,
 *  returns a polygon in such a form that it can be used in a Feature and thus can be drawn on the map by mapBox. */
function convertToPolygon(isochrone) {
    let flipForMapBox = true;
    const polygon = [];

    if (flipForMapBox) { //flips the coordinates if necessary
        polygon.push(isochrone[0].map(p => [p.longitude, p.latitude]));  
    } else {
        polygon.push(isochrone[0].map(p => [p.latitude, p.longitude]));
    }

    polygon[0].push(polygon[0][0]); //adds the first point to the end of the polygon so it makes a full circle
    return polygon;

}

/** This function scales an amount of time in minutes up to milliseconds */
function scaleTime(timeInMinutes) {
    var secToMilli = 1000;
    var minToSec = 60;
    return timeInMinutes * secToMilli * minToSec;
}

/** This function converts an array of transportation modes passed from the UI to actual profiles
 *  which can be used the isochrone generator. */
function convertModesToProfiles(modes) {
    const profiles = [];
    
    for (const mode of modes) {
        switch(mode) {
            case 'car':
                profiles.push('http://hdelva.be/profile/car');
                break;
            default: profiles.push('PEDESTRIAN');
        }
    }

    return profiles;
}

/** This function converts an array containing coordinates in the form [longitude,latitude] to a Coordinates object.
 *  The input that comes from the UI is in the [longitude, latitude] form, while the isochrone generator from planner.js uses the Cooridnates object.
 */
function convertCoordinatesArrayToObject(coordinatesArray) {
    const locations = [];
    for (const coordinates of coordinatesArray) {
        locations.push(new Coordinates(coordinates[0], coordinates[1]));
    }
    return locations;
}

export { multipleOverlap};

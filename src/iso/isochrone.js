import Planner from 'plannerjs';
import intersect from '@turf/intersect';
import { Feature } from './Feature.js';
// import { FeatureCollection } from './FeatureCollection.js';

async function generateIsochrone(coordinates, timeinminutes){
    let planner = new Planner.IsochroneGenerator(coordinates);
    let data = await planner.getIsochrone(scaleTime(timeinminutes), true);

    if (data.hasOwnProperty('isochrones')) {
        // only take the first isochrone, don't take holes into account.
        let isochrone = data.isochrones[0];
        let polygon = convertToPolygon(isochrone);
        let feature = new Feature(polygon, scaleTime(timeinminutes));
        return feature;
    } else {
        // return an empty feature collection if isochrone generation failed.
        return {
            type: "FeatureCollection",
            features: []
        };
    }
}

function convertToPolygon(isochrone){
    let flipForMapBox = true;
    const polygon = [];

    if(flipForMapBox) { //flips the coordinates if necessary
        polygon.push(isochrone[0].map(coord => [coord.longitude, coord.latitude]));
    } else {
        polygon.push(isochrone[0].map(coord => [coord.latitude, coord.longitude]));
    }

    polygon[0].push(polygon[0][0]);//adds the first point to the end of the polygon so it makes a full circle
    return polygon;
}

function scaleTime(timeinminutes){
    // let sectomilli = 1000;
    let sectomilli = 100; // TODO: made this shorter for testing purposes, because this takes a really long time.
    let mintosec = 60;
    return timeinminutes * sectomilli * mintosec;
}

export { generateIsochrone, intersect };

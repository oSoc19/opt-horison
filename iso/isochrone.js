const planner = require("../lib/planner.js");
// eventually import all classes usin a index in the library (ask Tinaël or stackoverflow)
var { FeatureCollection } = require('./FeatureCollection');
var { Feature } = require('./Feature');
var p = new planner.IsochroneGenerator();
var turf = require('@turf/intersect');
const intersect = turf.default;

console.log("started")
let bosa = {};
let herman = {};
bosa.longitude = 4.356331;
bosa.latitude = 50.860699;
herman.longitude = 4.350018;
herman.latitude = 50.865685;

async function findoptimum(location1, location2, max){
    var generator1 = await makegenerator(location1);
    var generator2 = await makegenerator(location2);
    var collection1 = new FeatureCollection();
    var collection2 = new FeatureCollection();

    if (max < 5){
        console.error("max should be bigger than 5")// replace this with proper error handling
    }
    else{
       var intervals = generateintervals(max);
       console.log("intervals.length = " + intervals.length);
       var i = 1;
       var intersection = null;
       while (i < intervals.length && intersection == null ){
           var time = intervals[i];
           console.log("time = "+ time);
           var isochrone1 = await generateIsochroneFromGenerator(generator1,time);
           var isochrone2 = await generateIsochroneFromGenerator(generator2,time);
           collection1.addOneFeature(isochrone1);
           collection2.addOneFeature(isochrone2);
           intersection = intersect(isochrone1, isochrone2);
           i++;
        }
        if( intersection != null){
            console.log("start intersection");
            console.log(intersection.geometry.coordinates);
            console.log("end of intersection");
        }
        console.log("end of findoptimum")
           
       


        

    }
   
function generateintervals(max){
    NbOfIsos = 5;
    var delta = max/NbOfIsos;
    var intervals = [];
    for(var i = 1; i <= NbOfIsos; i++)  {
        intervals.push(i*delta);
    }
    return intervals;
}
}
async function generateIsochroneFromGenerator(generator,timeinminutes){
    var data = await generator.getIsochrone(scaleTime(timeinminutes), true);
    var isochrone = data.isochrones[0];//only take the first isochrone, don't take holes into account.
    var polygon = convertToPolygon(isochrone);
    var feature = new Feature(polygon,scaleTime(timeinminutes));
    return feature; 
}
async function makegenerator(location){
    var generator = new planner.IsochroneGenerator();
    await generator.init(location);
    return generator;
}
async function generateIsochrone(location,timeinminutes){
    await p.init(location);// initialize every time because we assume the tiles will be cached correctly.
    var data = await p.getIsochrone(scaleTime(timeinminutes), true);
    var isochrone = data.isochrones[0];//only take the first isochrone, don't take holes into account.
    var polygon = convertToPolygon(isochrone);
    var feature = new Feature(polygon,scaleTime(timeinminutes));
    console.log(feature.geometry.coordinates);
    return feature;
}
function convertToPolygon(isochrone){
    flipForMapBox = true;
    const polygon = [];
    if(flipForMapBox){//flips the coordinates if necessary
        polygon.push(isochrone[0].map((p)=>[p.longitude,p.latitude]));  
    }
    else{
    polygon.push(isochrone[0].map((p)=>[p.latitude,p.longitude]));
    }
    polygon[0].push(polygon[0][0]);//adds the first point to the end of the polygon so it makes a full circle
    return polygon;

}
function scaleTime(timeinminutes){
    var sectomilli = 1000;
    var mintosec = 60;
    return timeinminutes * sectomilli * mintosec;
}
async function run(){
    await findoptimum(bosa,herman,15);
    
    
}
run();

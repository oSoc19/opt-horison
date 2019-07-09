const planner = require("../lib/planner.js");
// eventually import all classes usin a index in the library (ask Tinaël or stackoverflow)
var { FeatureCollection } = require('./FeatureCollection');
var { Feature } = require('./Feature');
var p = new planner.IsochroneGenerator();

console.log("started")
let bosa = {};
let herman = {};
bosa.longitude = 4.356331;
bosa.latitude = 50.860699;
herman.longitude = 4.350018;
herman.latitude = 50.865685;

async function generateIsochrone(location,timeinminutes){
    await p.init(location);
    var data = await p.getIsochrone(scaleTime(timeinminutes), true);
    var isochrone = data.isochrones[0];//only take the first isochrone, don't take holes into account.
    var polygon = convertToPolygon(isochrone);
    var feature = new Feature(polygon,scaleTime(timeinminutes));
    console.log(feature.geometry.coordinates);
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
    polygon.push(polygon[0][0]);//adds the first point to the end of the polygon so it makes a full circle
    return polygon;

}
function scaleTime(timeinminutes){
    var sectomilli = 1000;
    var mintosec = 60;
    return timeinminutes * sectomilli * mintosec;
}
async function run(){
    generateIsochrone(bosa,5);
}
run();

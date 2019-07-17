import { Feature } from './Feature.js';

class FeatureCollection {
    constructor() {
        this.type = "FeatureCollection";
        this.features = [];
    }

    addOneFeature(feature){
        this.features.push(feature);
    }

    addFeature(polygonData,timeinmillisec){
        //polygonData.push(polygonData[0]);
        var feature = new Feature(polygonData,timeinmillisec);
        this.features.push(feature);
    }
    isempty(){
        return this.features.length == 0;
    }

}

export { FeatureCollection };

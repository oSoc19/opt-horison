var { Feature } = require('./Feature');
class FeatureCollection {
	constructor() {
		this.type = "FeatureCollection",
		this.features = [];
    }
    addFeature(polygonData,timeinmillisec){
        //polygonData.push(polygonData[0]);
        var feature = new Feature(polygonData,timeinmillisec);
        this.features.push(feature);
    }

}

module.exports = {FeatureCollection};
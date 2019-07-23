import Geometry from './Geometry';
/**Implementation of the Feature class defined in GeoJSON.*/
export default class Feature {
	constructor(coordinates = [], timeinmillisec = 0) {
		this.type = "Feature";
		this.geometry = new Geometry(coordinates);
		this.geometry.type = "Polygon";
		this.properties = {
			time: timeinmillisec/1000//convert the time in milliseconds to seconds
		};
	}
}

export { Feature };
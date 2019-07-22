export default class Coordinates {
    constructor(lng, lat) {
        this.longitude = parseFloat(lng);
        this.latitude = parseFloat(lat);
    }
}

export { Coordinates };
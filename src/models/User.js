import uuidv1 from 'uuid/v1';

export default class User {
    constructor(name, duration, mode) {
        this._location = {};
        
        this.guid = uuidv1();
        this.name = name;
        this.duration = duration;
        this.mode = mode;
        this.location = undefined;
    }

    set location(value = { lng: 4.352440, lat: 50.846480 }) {
        this._location = value;
    }

    get location() {
        return this._location;
    }
}

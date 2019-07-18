import uuidv1 from 'uuid/v1';

export default class User {
    constructor(name, duration, modes, lngLat = [4.352440, 50.846480], color = '#FFA500') {       
        this.guid = uuidv1();
        this.name = name;
        this.duration = duration;
        if (!Array.isArray(modes)) {
            modes = [modes];
        }
        this.modes = modes;
        this.location = lngLat;
        this.color = color;
    }

    set location(value) {
        this._location = value;
    }

    get location() {
        return this._location;
    }
}

export { User };

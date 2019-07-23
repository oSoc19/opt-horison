import uuidv1 from 'uuid/v1';

export default class User {
    constructor(name, duration, modes, location = [4.352440, 50.846480], color = '#353682') {       
        this.guid = uuidv1();
        this.name = name;
        this.duration = duration;
        if (!Array.isArray(modes)) {
            modes = [modes];
        }
        this.modes = modes;
        this.location = location;
        this.color = color;
        this.isochrone = [];
    }
}

export { User };

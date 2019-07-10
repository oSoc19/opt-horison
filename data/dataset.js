// Note: this part of the project uses require() because node support for ES6
// modules is still an experimental feature. React uses webpack, which allows us
// to use the ES6 modules.
const fs = require('fs');
const util  = require('util');
const fsRead = util.promisify(fs.readFile);

class PointSet {
    constructor(name, path, source) {
        this._path = path;
        this.name = name;
        this.source = source;
        this.data = {};
    }

    async load() {
        let rawData = await fsRead("data/json/" + this._path);
        this.data = JSON.parse(rawData);
    }
}

async function loadPointSets() {
    let createPointSet = ps => new PointSet(ps["name"], ps["path"], ps["source"]);
    let sources = JSON.parse(await fsRead("data/json/sources.json"));
    let pointSets = sources.datasets.map(createPointSet);

    for (let pointSet of pointSets) {
        await pointSet.load();
    }

    return pointSets;
}

module.exports = { loadPointSets };

// Note: this part of the project uses require() because node support for ES6
// modules is still an experimental feature. React uses webpack, which allows us
// to use the ES6 modules.
const fs = require('fs');
const util  = require('util');
const fsRead = util.promisify(fs.readFile);
const pointsWithinPolygon = require('@turf/points-within-polygon');

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

    intersect(polygons) {
        return pointsWithinPolygon(points, polygons);
    }
}

async function getAllPointSets() {
    let createPointSet = ps => new PointSet(ps["name"], ps["path"], ps["source"]);
    let sources = JSON.parse(await fsRead("data/json/sources.json"));
    let pointSets = sources.datasets.map(createPointSet);

    return pointSets;
}

module.exports = { PointSet, getAllPointSets };

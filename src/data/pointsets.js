import pointsWithinPolygon from '@turf/points-within-polygon';
import { polygon } from '@turf/helpers';

// GeoJSON Data Files
import barData from './json/bars.json'
import coffeeData from './json/cafes.json'
import restoData from './json/restos.json'

class PointSet {
    constructor(config) {
        this.name = config.name;
        this.data = config.data;
        this.mapboxIcon = config.mapboxIcon;
        this.semanticIcon = config.semanticIcon;
        this.description = config.description;
        this.active = config.active;
    }

    intersect(overlap) {
        let result = {
            type: "FeatureCollection",
            features: []
        };

        for (let feature of overlap.features) {
            for (let ring of feature.geometry.coordinates) {
                if (ring.length >= 4) {
                    let poly = polygon(feature.geometry.coordinates);
                    result.features = result.features.concat(
                        pointsWithinPolygon(this.data, poly).features);
                }
            }
        }

        return result;
    }
}

function getAllPointSets() {
    return [
        new PointSet({
            name: "Bar",
            description: "An establishment that sells alcoholic drinks.",
            active: false,
            data: barData,
            mapboxIcon: "bar",
            semanticIcon: "glass martini"
        }),
        new PointSet({
            name: "Coffee",
            description: "An establishment selling beverages and snacks.",
            active: true,
            data: coffeeData,
            mapboxIcon: "cafe",
            semanticIcon: "coffee"
        }),
        new PointSet({
            name: "Restaurant",
            description: "An establishment selling full meals.",
            active: true,
            data: restoData,
            mapboxIcon: "restaurant",
            semanticIcon: "food"
        })
    ];
}

export { PointSet, getAllPointSets };
export default { PointSet, getAllPointSets };

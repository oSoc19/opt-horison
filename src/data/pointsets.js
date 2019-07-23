import pointsWithinPolygon from '@turf/points-within-polygon';
import { polygon } from '@turf/helpers';

// GeoJSON Data Files
import barData from './json/bars.json'
import coffeeData from './json/cafes.json'
import restoData from './json/restos.json'

/**
 * PointSet is responsible for abstracting over point datasets from OSM.
 */
class PointSet {
    /** Pass in a config object with the nessecary parameters, see
    /* getAllPointSets() for an example.
     */
    constructor(config) {
        this.name = config.name; // Dataset name.
        this.description = config.description; // In-app description of the dataset.
        this.data = config.data; // Dataset points (In GeoJSON format).
        this.mapboxIcon = config.mapboxIcon; // Icon from the mapbox api.
        this.semanticIcon = config.semanticIcon; // Icon from the semantic-ui api.
        this.active = config.active; // Wheter or not the icon is currently shown on the map.
    }

    /**
     * Find the points that lie within a given polygon.
     */
    intersect(overlap) {
        let result = {
            type: "FeatureCollection",
            features: []
        };


        // If overlap contains multiple polygon features, we iterate over each
        // one and add the points into the same result collection.
        for (let feature of overlap.features) {
            // Each polygon can contain multiple rings (for each duration).
            for (let ring of feature.geometry.coordinates) {
                // Each ring should have at least 4 coordinates, otherwise
                // we can't consider it a polygon.
                if (ring.length >= 4) {
                    // Turf requires a specific GeoJSON format.
                    let poly = polygon(feature.geometry.coordinates);
                    let foundPoints = pointsWithinPolygon(this.data, poly).features;
                    // Add these points to the result, so every polygon had a
                    // chance to contribute.
                    result.features = result.features.concat(foundPoints);
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
            active: true,
            data: barData,
            mapboxIcon: "bar",
            semanticIcon: "glass martini"
        }),
        new PointSet({
            name: "Coffee",
            description: "An establishment selling beverages and snacks.",
            active: false,
            data: coffeeData,
            mapboxIcon: "cafe",
            semanticIcon: "coffee"
        }),
        new PointSet({
            name: "Restaurant",
            description: "An establishment selling full meals.",
            active: false,
            data: restoData,
            mapboxIcon: "restaurant",
            semanticIcon: "food"
        })
    ];
}

export { PointSet, getAllPointSets };
export default { PointSet, getAllPointSets };

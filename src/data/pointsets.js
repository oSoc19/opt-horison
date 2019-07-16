import pointsWithinPolygon from '@turf/points-within-polygon';
import { polygon } from '@turf/helpers';

// GeoJSON Data Files
import barData from './json/bars.json'
import coffeeData from './json/cafes.json'
import restoData from './json/restos.json'

class PointSet {
    constructor(name, data, image) {
        this.name = name;
        this.image = image;
        this.data = data;
    }

    intersect(polygons) {
        let result = {
            type: "FeatureCollection",
            features: []
        };

    
        for (let feature of polygons.features) {
            if(feature.geometry.coordinates.length >= 4){
                let poly = polygon(feature.geometry.coordinates);
                result.features = result.features.concat(pointsWithinPolygon(this.data, poly).features);
            }
        }
        

        return result;
    }
}

function getAllPointSets() {
    return [
        new PointSet("Bar", barData, "bar"),
        new PointSet("Coffee", coffeeData, "cafe"),
        new PointSet("Restaurant", restoData, "restaurant"),
    ];
}

export { PointSet, getAllPointSets };
export default { PointSet, getAllPointSets };

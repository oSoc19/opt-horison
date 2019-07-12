// @flow
import React, { Component } from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { getAllPointSets } from '../../data/pointsets.js';
import PoiLayer from '../PoiLayer/PoiLayer.js';

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MABPOX_TOKEN,
});

class CustomMap extends Component {
	static defaultProps = {};

    constructor() {
        super();
        this.state = {
            highlightedPolygons: /* {
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "properties": {},
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [4.346467, 50.858682],
                                [4.370461, 50.851517],
                                [4.366000, 50.840353],
                                [4.344723, 50.833306],
                                [4.338032, 50.849133],
                                [4.346467, 50.858682]
                            ]
                        ]
                    }
                }]
            } */
            {},
            points: [] // getAllPointSets()
        };
    }

	render() {
		return (
		<Map
			style="mapbox://styles/timutable/cjy0gxsnt01bc1crzdsrye0m5"
			center={[4.352440, 50.846480]} // hardcoded center point in Brussels
			containerStyle={{
				height: "100vh",
				width: "100vw"
			}}>
            <PoiLayer polygons={this.state.highlightedPolygons} points={this.state.points} />
		</Map>
		);
	}
}

CustomMap.defaultProps = {};
CustomMap.propTypes = {};

export default CustomMap;

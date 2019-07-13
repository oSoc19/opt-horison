// @flow
import React, { Component } from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { getAllPointSets } from '../../data/pointsets.js';
import PoiLayer from '../PoiLayer/PoiLayer.js';
import IsochroneLayer from '../IsochroneLayer/IsochroneLayer.js';
import { generateIsochrone, intersect } from '../../iso/isochrone.js';

import './CustomMap.css';

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MABPOX_TOKEN,
});

export default class CustomMap extends Component {
	constructor(props) {
		super(props);
		
		this.state = {	
			center: this.props.center,
			containerStyle: { height: '100vh', width: '100vw' },
            polygons: [],
            points: []
		}
	}

    async componentDidMount() {
        let bosa = {
            longitude: 4.356331,
            latitude: 50.860699,
        };

        let herman = {
            longitude: 4.350018,
            latitude: 50.865685
        };

        /* let point1 = {
            longitude: 4.3517103,
            latitude: 50.8503396
        };

        let point2 = {
            longitude: 4.356670,
            latitude: 50.846207
        }*/

        let bosaiso = await generateIsochrone(bosa, 15);
        let hermaniso = await generateIsochrone(herman, 15);
        let intersection = intersect(bosaiso, hermaniso);

        if (intersection.hasOwnProperty('geometry')) {
            let pointSets = getAllPointSets();
            let polygons = [];
            let points = [];

            for (let coordinateList of intersection.geometry.coordinates) {
                polygons.push({
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: coordinateList
                    }
                });
            }

            for (let pointSet of pointSets) {
                let intersectingPoints = pointSet.intersect({
                    type: "FeatureCollection",
                    features: polygons
                });
                intersectingPoints.image = pointSet.image;
                intersectingPoints.name = pointSet.name
                points.push(intersectingPoints);
            }

            this.setState({ polygons, points });
        }
    }
 
	render() {
		return (
			<Map // eslint-disable-next-line
                style="mapbox://styles/timutable/cjy0gxsnt01bc1crzdsrye0m5"
				className='CustomMap'
				containerStyle={this.state.containerStyle}
				center={this.state.center}>
                <IsochroneLayer polygons={this.state.polygons} />
                <PoiLayer polygons={this.state.polygons} points={this.state.points} />
			</Map>
		);
	}
}

// @flow
import React, { Component } from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { getAllPointSets } from '../../data/pointsets.js';
import PoiLayer from '../PoiLayer/PoiLayer.js';
import IsochroneLayer from '../IsochroneLayer/IsochroneLayer.js';
import { findoptimum, run, intersect } from '../../iso/isochrone.js';

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
        let overlap = await run();
        let pointSets = getAllPointSets();
        let polygons = [await run()];
        let points = [];

        // console.log(overlap);

        /* for (let coordinateList of overlap.geometry.coordinates) {
            polygons.push({
                type: "Feature",
                properties: {},
                geometry: {
                    type: "Polygon",
                    coordinates: coordinateList
                }
            });
        }*/

        console.log("POLYGONS: ", polygons);

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

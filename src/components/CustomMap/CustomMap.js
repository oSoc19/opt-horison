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

    async setPolygons() {
        let polygons = [await run()];
        this.setState({ polygons });
    }

    setPoints() {
        let pointSets = this.props.pointSets;
        let points = [];

        for (let pointSet of pointSets) {
            let intersectingPoints = pointSet.intersect({
                type: "FeatureCollection",
                features: this.state.polygons
            });

            intersectingPoints.image = pointSet.mapboxIcon;
            intersectingPoints.name = pointSet.name
            points.push(intersectingPoints);
        }

        this.setState({ points });
    }

    async componentDidMount() {
        await this.setPolygons();
        this.setPoints();
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

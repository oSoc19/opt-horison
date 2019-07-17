import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
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
			containerStyle: { height: '100vh', width: '100vw' },
            polygons: [],
            points: []
        };
	}

    async componentDidMount() {
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
        const {center, data} = this.props;
		return (
			<Map // eslint-disable-next-line
                style='mapbox://styles/timutable/cjy0gxsnt01bc1crzdsrye0m5'
				className='CustomMap'
				containerStyle={this.state.containerStyle}
                center={center}
                zoom={[13]}
            >
                <IsochroneLayer polygons={this.state.polygons} />
                <PoiLayer polygons={this.state.polygons} points={this.state.points} />
                <Layer
                    type="circle"
                    id="participant-marker"
                    paint={{
                        'circle-stroke-width': 4,
                        'circle-radius': 10,
                        'circle-blur': 0.15,
                        'circle-color': '#3770C6',
                        'circle-stroke-color': 'white'
                    }}
                >
                    {data.map(participant => (
                    <Feature
                        key={participant.guid}
                        coordinates={participant.location}
                        draggable
                        onDragEnd={evt => this.props.onDragEnd(evt, participant.guid)}
                    />
                    ))}
                </Layer>
			</Map>
		);
	}
}

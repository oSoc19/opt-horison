import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import { getAllPointSets } from '../../data/pointsets.js';
import PoiLayer from './PoiLayer/PoiLayer.js';
import IsochroneLayer from './IsochroneLayer/IsochroneLayer.js';
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

    //TODO: refactor so it runs everytime you add/remove a user
    async componentDidMount() {
        this.props.onLoadingStart();

        await this.setPolygons();
        this.setPoints();

        this.props.onLoadingEnd();
    }

	render() {
        const {center, participants} = this.props;
        const {containerStyle, polygons, points} = this.state;
		return (
			<Map // eslint-disable-next-line
                style='mapbox://styles/timutable/cjy0gxsnt01bc1crzdsrye0m5'
				className='CustomMap'
				containerStyle={containerStyle}
                center={center}
            >
                <IsochroneLayer polygons={polygons} />
                <PoiLayer polygons={polygons} points={points} />
                {participants.map((participant, index) => (
                <Layer
                    type="circle"
                    id={`${participant.guid}-marker${index}`}
                    key={`${participant.guid}-marker${index}`}
                    paint={{
                        'circle-stroke-width': 4,
                        'circle-radius': 10,
                        'circle-blur': 0.15,
                        'circle-color': participant.color,
                        'circle-stroke-color': '#000000'
                    }}
                >
                    <Feature
                        key={participant.guid}
                        coordinates={participant.location}
                        draggable
                        onDragEnd={evt => this.props.onDragEnd(evt, participant.guid)}
                    /> 
                </Layer>
                ))}
			</Map>
		);
	}
}

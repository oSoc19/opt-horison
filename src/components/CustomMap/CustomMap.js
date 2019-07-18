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
            overlap: {},
            userIsochrones: [],
            points: [],
            overlapCenter: {}
        };
	}

    async setPolygons() {
        let resultContainer = await run();

        this.setState({
            overlap: resultContainer.overlap,
            userIsochrones: resultContainer.userIsochrones,
            overlapCenter: resultContainer.overlapCenter
        });
    }

    setPoints() {
        let pointSets = this.props.pointSets;
        let points = [];

        for (let pointSet of pointSets) {
            let intersectingPoints = pointSet.intersect({
                type: "FeatureCollection",
                features: [this.state.overlap]
            });

            intersectingPoints.image = pointSet.mapboxIcon;
            intersectingPoints.name = pointSet.name
            points.push(intersectingPoints);
        }

        this.setState({ points });
    }

    // TODO: refactor so it runs everytime you add/remove a user
    // TODO (bis): just call setPolygons() through the reference in the parent
    // component, like I'm doing for the points of interest
    async componentDidMount() {
        this.props.onLoadingStart();

        await this.setPolygons();
        this.setPoints();

        this.props.onLoadingEnd();
    }

	render() {
        const {center, participants} = this.props;
        const {containerStyle, points, overlap} = this.state;
		return (
			<Map // eslint-disable-next-line
                style='mapbox://styles/timutable/cjy0gxsnt01bc1crzdsrye0m5'
				className='CustomMap'
				containerStyle={containerStyle}
                center={center}
            >
                <IsochroneLayer polygon={overlap} />
                {this.state.userIsochrones.map((fc, index) =>
                    <IsochroneLayer
                        key={index}
                        polygon={fc.features[0]}
                        color={this.props.participants[index].color}
                        opacity={0.1}/>)}
                <PoiLayer overlap={overlap} points={points} />
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

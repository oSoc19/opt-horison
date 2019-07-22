import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import PoiLayer from './PoiLayer/PoiLayer.js';
import IsochroneLayer from './IsochroneLayer/IsochroneLayer.js';
import OverlapLayer from './OverlapLayer/OverlapLayer.js';
import { multipleOverlap } from '../../iso/isochrone.js';

import './CustomMap.css';

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MABPOX_TOKEN,
});

export default class CustomMap extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			containerStyle: { height: '100vh', width: '100vw' },
            overlap: {
                feature: {},
                center: {}
            },
            points: []
        };
	}

    async setPolygons() {
        const { participants } = this.props;
        let resultContainer = {};
        const locations = [];
        const modes = [];
        const maxDurations = [];

        for (const participant of participants) {
            locations.push(participant.location);
            modes.push(participant.modes[0]); //TODO: take all modes into account
            maxDurations.push(participant.duration);
        }
        resultContainer = await multipleOverlap(locations, modes, maxDurations);
        if (participants.length !== resultContainer.userIsochrones.length) {
            console.error('An error occurred : the lengths are not the same!', participants, resultContainer);
            return;
        }

        for (let i = 0; i < participants.length; i++) {
            participants[i].isochrone = resultContainer.userIsochrones[i];
            console.log(participants[i].isochrone);
        }

        this.setState({
            overlap: {
                feature: resultContainer.overlap,
                center: resultContainer.overlapCenter
            }
        });
        this.props.onParticipantsChange(participants);
    }

    setPoints() {
        let pointSets = this.props.pointSets;
        let points = [];

        for (let pointSet of pointSets) {
            let intersectingPoints = pointSet.intersect({
                type: "FeatureCollection",
                features: [this.state.overlap.feature]
            });

            intersectingPoints.image = pointSet.mapboxIcon;
            intersectingPoints.name = pointSet.name
            points.push(intersectingPoints);
        }

        this.setState({ points });
    }

    async componentDidMount() {
        await this.loadMapAndLayers();
    }

    async loadMapAndLayers() {
        this.props.onLoadingStart();
        
        await this.setPolygons();
        this.setPoints();
        this.props.onCenterChange(this.state.overlap.center.geometry.coordinates);
        
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
                <OverlapLayer polygon={overlap.feature} />
                <PoiLayer overlap={overlap.features} points={points} />

                {participants.map((participant, index) => (
                    <div key={index}>
                        <IsochroneLayer
                            key={index}
                            polygons={participant.isochrone.features}
                            color={participant.color}
                        />
                        <Layer
                            type='circle'
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
                    </div>
                ))}
			</Map>
		);
	}
}

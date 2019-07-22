import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

export default class OverlapLayer extends Component {
    static defaultProps = {
        polygon: [],
        color: 'rgba(11, 52, 99, 0.15)',
        opacity: 1
    };


    constructor(props) {
        super(props);

        console.log("overlap polygon: ", props.polygon);
    }


    render() {
        return (
            <GeoJSONLayer
                data={{
                    type: "FeatureCollection",
                    features: [this.props.polygon]
                }}
                fillLayout={{
                    'visibility': 'visible'
                }}
                fillPaint={{
                    'fill-color': this.props.color,
                    'fill-opacity': this.props.opacity
                }}
            />
        );
    }
}

import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

export default class OverlapLayer extends Component {
    static defaultProps = {
        polygon: [],
        color: 'rgba(11, 52, 99, 0.6)',
        opacity: 1
    };

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

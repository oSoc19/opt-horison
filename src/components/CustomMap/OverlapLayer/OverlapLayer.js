import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

export default class OverlapLayer extends Component {
    static defaultProps = {
        polygon: [],
        color: '#008080',
        opacity: 1
    };

    render() {
        return (
            <GeoJSONLayer
                data={{
                    type: "FeatureCollection",
                    features: [this.props.polygon]
                }}
                fillPaint={{
                    'fill-color': this.props.color
                }}
            />
        );
    }
}

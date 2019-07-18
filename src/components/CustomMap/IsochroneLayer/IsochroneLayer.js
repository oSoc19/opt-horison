import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

export default class IsochroneLayer extends Component {
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
                linePaint={{
                    'line-color': this.props.color,
                    'line-width': 5,
                    'line-opacity': this.props.opacity
                }}
            />
        );
    }
}

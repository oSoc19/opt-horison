import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

export default class IsochroneLayer extends Component {
    static defaultProps = {
        polygons: [],
        color: '#008080',
        opacity: 0.2
    };

    render() {
        return (
            <GeoJSONLayer
                data={{
                    type: "FeatureCollection",
                    features: this.props.polygons
                }}
                linePaint={{
                    'line-color': this.props.color,
                    'line-width': 3,
                    'line-opacity': this.props.opacity,
                    'line-dasharray': [2,2,2]
                }}
            />
        );
    }
}

import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

/**
 * This component draws individual isochrones for users, (i.e. the dotted lines
 * you see on the map.). However as they are pretty distracting, they're
 * currently not shown on the map. You can use them for debugging purposes
 * though.
 */
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

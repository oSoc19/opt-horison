// @flow
import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

class IsochroneLayer extends Component {
    static defaultProps = {
        polygons: [],
    }

    render() {
        return (
            <GeoJSONLayer
                data={{
                    type: "FeatureCollection",
                    features: this.props.polygons
                }}
                linePaint={{
                    'line-color': '#008080',
                    'line-width': 5
                }} />
        );
    }
}

export default IsochroneLayer;

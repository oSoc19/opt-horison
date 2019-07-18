// @flow
import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

class IsochroneLayer extends Component {
    static defaultProps = {
        polygon: [],
        color: '#008080',
        opacity: 1
    }

    constructor(props) {
        super(props);

        console.log(props.polygon);
    }

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
                }} />
        );
    }
}

export default IsochroneLayer;

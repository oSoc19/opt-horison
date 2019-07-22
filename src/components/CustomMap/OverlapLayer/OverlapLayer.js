import React, { Component } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';

/**
 * This component is responsible for displaying the overlapping area to users.
 */
export default class OverlapLayer extends Component {
    static defaultProps = {
        polygon: [],
        color: '#008080',
        opacity: 0.4
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

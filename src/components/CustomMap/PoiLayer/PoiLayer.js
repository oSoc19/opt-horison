import React, { Component } from 'react';
import { Layer, Feature } from 'react-mapbox-gl';

export default class PoiLayer extends Component {
    static defaultProps = {
        points: []
    };

    render() {
        return (
            this.props.points.map(collection => (
                <Layer
                    key={collection.name}
                    type="symbol"
                    layout={{
                        "icon-image": `${collection.image}-15`,
                        "icon-allow-overlap": true,
                    }}
                >
                    {collection.features.map((point, index) => (
                    <Feature
                        key={index}
                        coordinates={point.geometry.coordinates}
                    />
                    ))}
                </Layer>
            ))
        );
    }
}

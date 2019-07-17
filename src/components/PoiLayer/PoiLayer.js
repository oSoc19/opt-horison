// @flow
import React, { Component } from 'react';
import { Layer, Feature } from 'react-mapbox-gl';

class PoiLayer extends Component {
    static defaultProps = {
        points: []
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.points.map(collection =>
                <Layer
                    key={collection.name}
                    type="symbol"
                    layout={{
                        "icon-image": `${collection.image}-15`,
                        "icon-allow-overlap": true,
                        "text-field": collection.name,
                        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                        "text-size": 11,
                        "text-transform": "uppercase",
                        "text-letter-spacing": 0.05,
                        "text-offset": [0, 1.5]
                    }}
                    paint={{
                        "text-color": "#202",
                        "text-halo-color": "#fff",
                        "text-halo-width": 2
                    }}>
                    {collection.features.map((point, index) =>
                        <Feature
                            key={index}
                            coordinates={point.geometry.coordinates}/>)}
                </Layer>)
        );
    }
}

export default PoiLayer;

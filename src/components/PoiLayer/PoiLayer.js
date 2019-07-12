// @flow
import React, { Component } from 'react';
import { Layer, Feature } from 'react-mapbox-gl';

class PoiLayer extends Component {
    static defaultProps = {
        polygons: [],
        points: []
    }

    constructor(props) {
        super(props);

        this.state = {
            pointCollection: []
        };
    }

    componentDidMount() {
        let points = []

        for (let pointSet of this.props.points) {
            let intersectingPoints = pointSet.intersect(this.props.polygons);
            intersectingPoints.image = pointSet.image;
            intersectingPoints.name = pointSet.name
            points.push(intersectingPoints);
        }

        this.setState({ pointCollection: points });
        console.log(this.state.pointCollection);
    }

    render() {
        return (
            this.state.pointCollection.map(collection =>
                <Layer
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
                    {collection.features.map(point =>
                        <Feature coordinates={point.geometry.coordinates}/>)}
                </Layer>)
        );
    }
}

export default PoiLayer;

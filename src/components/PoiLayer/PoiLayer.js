// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import PointSets, { PointSet } from '../../../data/pointsets.js';

class PoiLayer extends Component {
    constructor(props) {
        super(props);
        this.state = { visiblePoints: [] }
    }

    async componentDidMount() {
        // Load all of the pointSets from the filesystem into memory,
        // intersect them with the currently highlighted polygon and
        // reflect the results into the Layer's state.
        for (let pointSet of this.props.points) {
            await pointSet.load();
            this.setState({ visiblePoints: pointSet.intersect(this.props.polygons) });
        }

        console.log(this.state);
    }

    render() {
        return;
        /*return (
            <Layer>
                {this.state.visiblePoints.map(point => (
                    <Feature coordinates=point.coords properties=point.properties>
                    </Feature>))}
            </Layer>
        );*/
    }
}

PoiLayer.propTypes = {
    polygons: PropTypes.arrayOf(PropTypes.exact({
        type: PropTypes.string,
        features: PropTypes.arrayOf(PropTypes.exact({
            type: PropTypes.string,
            geometry: PropTypes.arrayOf(PropTypes.exact({
                type: PropTypes.string,
                coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)))
            })),
            properties: PropTypes.object
        }))
    })),
    points: PropTypes.arrayOf(PropTypes.instanceOf(PointSet))
}

PoiLayer.defaultProps = {
    polygons: [],
    points: []
}

export default PoiLayer;

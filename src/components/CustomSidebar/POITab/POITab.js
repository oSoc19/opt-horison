import React, { Component} from 'react';
import { List } from 'semantic-ui-react';
import PointOfInterest from './PointOfInterest/PointOfInterest';

import './POITab.css';

export default class POITab extends Component {
	render() {
		return (
            <List relaxed divided>
                {this.props.pointSets.map((pointSet, index) => (
                <PointOfInterest
                    key={`${pointSet.name}-${index}`}
                    pointSet={pointSet}
                    index={index}
                    togglePointSet={this.props.togglePointSet}
                />
                ))}
            </List>
        );
	}
}

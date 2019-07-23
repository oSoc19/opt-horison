import React, { Component} from 'react';
import { Table } from 'semantic-ui-react';
import PointOfInterest from './PointOfInterest/PointOfInterest';

import './POITab.css';

export default class POITab extends Component {
	render() {
		return (
            <Table basic unstackable>
                <Table.Body>
                    {this.props.pointSets.map((pointSet, index) => (
                    <PointOfInterest
                        key={`${pointSet.name}-${index}`}
                        pointSet={pointSet}
                        index={index}
                        togglePointSet={this.props.togglePointSet}
                    />
                    ))}
                </Table.Body>
            </Table>
        );
	}
}

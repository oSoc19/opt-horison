import React, { Component} from 'react';
import PointOfInterest from './PointOfInterest';
import { Icon, List, Checkbox } from 'semantic-ui-react';

import './POITab.css';

export default class POITab extends Component {
    constructor(props) {
        super(props);
    }

	render() {
		return (
            <List relaxed divided>
                {this.props.pointSets.map((pointSet, index) => {
                    return (
                        <List.Item key={`${pointSet.name}-${index}`}>
                            <List.Content floated="left">
                                <List.Icon
                                    circular inverted color='teal'
                                    name={pointSet.semanticIcon} />
                            </List.Content>
                            <List.Content floated="left">
                                <List.Header>
                                    {pointSet.name}
                                </List.Header>
                                <List.Description>
                                    {pointSet.description}
                                </List.Description>
                            </List.Content>
                            <List.Content floated="right">
                                <Checkbox
                                    slider
                                    onChange={this.props.togglePointSet(pointSet.name)}
                                    checked={pointSet.active}/>
                            </List.Content>
                        </List.Item>
                    );
                })}
            </List>
        );
	}
}

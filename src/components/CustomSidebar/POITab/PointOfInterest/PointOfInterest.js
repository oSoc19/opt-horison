import React, { Component} from 'react';
import { List, Checkbox } from 'semantic-ui-react';

export default class PointOfInterest extends Component {
	render() {
		const {pointSet} = this.props;
		return (
			<List.Item>
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
	}
}

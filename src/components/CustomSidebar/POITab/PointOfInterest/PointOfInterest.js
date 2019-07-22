import React, { Component} from 'react';
import { Table, Header, Icon, Checkbox } from 'semantic-ui-react';

import './PointOfInterest.css';

export default class PointOfInterest extends Component {
	render() {
		const {pointSet} = this.props;
		return (
			<Table.Row>
				<Table.Cell>
					<Header>
						<Icon name={pointSet.semanticIcon} size='small' color='orange'/>
						<Header.Content>
							{pointSet.name}
							<Header.Subheader>{pointSet.description}</Header.Subheader>
						</Header.Content>
					</Header>
				</Table.Cell>
				<Table.Cell>
					<Checkbox
						toggle
						onChange={this.props.togglePointSet(pointSet.name)}
						checked={pointSet.active}
					/>
				</Table.Cell>
			</Table.Row>
		);
	}
}

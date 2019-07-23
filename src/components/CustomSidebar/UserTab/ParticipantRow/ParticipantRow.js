import React, { Component } from 'react';
import { Table, Header, Button, Icon } from 'semantic-ui-react';
import TransportModeIcon from '../TransportModeIcon/TransportModeIcon';

import './ParticipantRow.css';

export default class ParticipantRow extends Component {
	render() {
		const { guid, name, duration, modes, color } = this.props;
		return (
			<Table.Row>
				<Table.Cell>
					<Header>
						<Icon name='user' size='small' style={{color}}/>
						<Header.Content>
							{name}
							<Header.Subheader>{duration} min</Header.Subheader>
						</Header.Content>
					</Header>
				</Table.Cell>

				<Table.Cell textAlign='right'>
				{modes.map(mode => (
					<TransportModeIcon key={`${guid}&${mode}`} modeProperties={{color, mode}}/>
				))}
				</Table.Cell>

				<Table.Cell textAlign='right'>
					<Button
						circular
						icon='delete'
						onClick={() => this.props.onParticipantRemove(guid)}
						style={{backgroundColor: 'transparent'}}
					/>
				</Table.Cell>
			</Table.Row>
		);
	}
}

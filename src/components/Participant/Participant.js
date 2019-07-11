import React, { Component } from 'react';
import { Table, Header, Button, Icon } from 'semantic-ui-react';
import TransportModeIcon from '../TransportModeIcon/TransportModeIcon';

export default class Participant extends Component {
	render() {
		const { guid, name, duration, mode } = this.props;
		return (
			<Table.Row>
				<Table.Cell>
					<Header>
						<Icon name='user circle' size='small'/>
						<Header.Content>{name}</Header.Content>
					</Header>
				</Table.Cell>
				<Table.Cell>
					{duration} min
				</Table.Cell>
				<Table.Cell>
					<TransportModeIcon mode={mode} />
				</Table.Cell>

				<Table.Cell>
					<Button 
						basic
						icon="trash alternate"
						color="red"
						onClick={() => this.props.onParticipantRemove(guid) }
					/>
				</Table.Cell>
			</Table.Row>
		);
	}
}

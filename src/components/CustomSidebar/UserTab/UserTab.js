import React, { Component} from 'react';
import { Table, Button, Transition } from 'semantic-ui-react';
import _ from 'lodash';
import ParticipantRow from './ParticipantRow';
import UserCreationModal from './UserCreationModal/UserCreationModal';

import './UserTab.css';

export default class UserTab extends Component {
	constructor(props) {
		super(props);

		this.handleAdd = this.handleAdd.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.showModal = this.showModal.bind(this);
		this.onModalClose = this.onModalClose.bind(this);

		this.state = {
			modalOpen: false
		};
	}

	handleAdd(participant) {
		const { participants } = this.props;
		participants.push(participant);
		this.props.onParticipantsChange(participants);
		this.onModalClose();
	}

	handleRemove(guid) {
		const { participants } = this.props;

		let deletedRow = participants.find(p => p.guid === guid);
		if (deletedRow) {
			participants.splice(participants.indexOf(deletedRow), 1);
		} else {
			console.error('Deleting an undisplayed row is impossible!', deletedRow);
		}

		this.props.onParticipantsChange(participants);
	}

	showModal() {
		this.setState({modalOpen: true});
	}

	onModalClose() {
		this.setState({modalOpen: false});
	}

	render() {
		return (
			<div>
				<UserCreationModal
					initialUserLocation={this.props.initialUserLocation}
					modalOpen={this.state.modalOpen} 
					closeModal={this.onModalClose} 
					addParticipant={this.handleAdd} 
				/>
				<Table basic unstackable>
					<Transition.Group
						as={Table.Body}
						duration={500}
					>
						{_.map(this.props.participants,
							(participant) => 
							<ParticipantRow
								key={participant.guid}
								{...participant}
								onParticipantRemove={this.handleRemove}
							/>
						)}
					</Transition.Group>

					<Table.Footer>
						<Table.Row>
							<Table.HeaderCell colSpan='5'>							
								<Button
									floated='right'
									icon='plus' 
									labelPosition='left' 
									color='orange'
									size='small' 
									content='Add participant' 
									onClick={this.showModal}
								/>
								<Button 
									floated='right'
									icon='refresh' 
									labelPosition='left' 
									color='orange'
									inverted
									size='small' 
									content='Refresh map' 
									onClick={this.props.refreshMap}
								/>
							</Table.HeaderCell>
						</Table.Row>
				</Table.Footer>
				</Table>
			</div>
		);
	}
}

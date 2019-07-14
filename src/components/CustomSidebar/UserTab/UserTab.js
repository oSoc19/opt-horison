import React, { Component} from 'react';
import { Table, Button, Transition } from 'semantic-ui-react';
import _ from 'lodash';
import User from '../../../models';
import ParticipantRow from './ParticipantRow';
import UserCreationModal from './UserCreationModal/UserCreationModal';

import './UserTab.css';

export default class UserTab extends Component {

	constructor(props) {
		super(props);

		this.handleSort = this.handleSort.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.showModal = this.showModal.bind(this);
		this.onModalClose = this.onModalClose.bind(this);

		this.state = {
			modalOpen: false,
			column: null,
			data: [new User('Tinaël', 15, 'car')],
			direction: null
		};
	}

	handleSort = (clickedColumn) => {
		const { column, data, direction } = this.state;
	
		if (column !== clickedColumn) {
		  this.setState({
			column: clickedColumn,
			data: _.sortBy(data, [clickedColumn]),
			direction: 'ascending'
		  });
	
		  return;
		}
	
		this.setState({
		  data: data.reverse(),
		  direction: direction === 'ascending' ? 'descending' : 'ascending',
		});
	}

	handleAdd = (participant) => {
		const {data} = this.state;

		console.log(participant);
		data.push(participant);

		this.setState({data});
		this.onModalClose();
	}

	handleRemove = (guid) => {
		let { data } = this.state;

		let deletedRow = data.find(p => p.guid === guid);
		if (deletedRow) {
			data.splice(data.indexOf(deletedRow), 1);
		} else {
			console.error('Deleting an undisplayed row is impossible!', deletedRow);
		}

		this.setState({data});
	}

	showModal = () => {
		this.setState({modalOpen: true});
	}

	onModalClose = () => {
		this.setState({modalOpen: false});
	}

	render() {
		const { column, data, direction } = this.state;

		return (
			<div>
				<UserCreationModal 
					modalOpen={this.state.modalOpen} 
					closeModal={this.onModalClose} 
					addParticipant={this.handleAdd} 
				/>
				<Table sortable celled compact>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell 
								sorted={column === 'name' ? direction : null}
								onClick={() => this.handleSort('name')}
								content='Participant' 
							/>
							<Table.HeaderCell
								sorted={column === 'duration' ? direction : null}
								onClick={() => this.handleSort('duration')}
								content='Max Duration'
							/>
							<Table.HeaderCell
								sorted={column === 'mode' ? direction : null}
								onClick={() => this.handleSort('mode')}
								content='Mode'
							/>
							<Table.HeaderCell
								content='Delete?'
							/>
						</Table.Row>
					</Table.Header>

					<Transition.Group
						as={Table.Body}
						duration={500}
					>
						{_.map(data,
							(participant) => 
							<ParticipantRow
								key={participant.guid}
								{...participant}
								onParticipantRemove={this.handleRemove}
							/>
						)}
					</Transition.Group>

					<Table.Footer fullWidth>
						<Table.Row>
							<Table.HeaderCell colSpan='4'>
								<Button 
									icon='add user' 
									labelPosition='left' 
									color='blue'
									inverted
									size='small' 
									content='Add participant' 
									onClick={this.showModal}
								/>
							</Table.HeaderCell>
						</Table.Row>
				</Table.Footer>
				</Table>
			</div>
		);
	}
}

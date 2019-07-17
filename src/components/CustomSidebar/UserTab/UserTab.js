import React, { Component} from 'react';
import { Table, Button, Transition } from 'semantic-ui-react';
import _ from 'lodash';
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
			direction: null
		};
	}

	handleSort = (clickedColumn) => {
		const { data } = this.props;
		const { column, direction } = this.state;
	
		if (column !== clickedColumn) {
		  this.setState({
			column: clickedColumn,
			direction: 'ascending'
		  });
		  this.props.changeData(_.sortBy(this.props.data, [clickedColumn]));
	
		  return;
		}
	
		this.setState({
		  direction: direction === 'ascending' ? 'descending' : 'ascending',
		});
		this.props.changeData(data.reverse());
	}

	handleAdd = (participant) => {
		const { data } = this.props;
		data.push(participant);
		this.props.changeData(data);
		this.onModalClose();
	}

	handleRemove = (guid) => {
		const { data } = this.props;

		let deletedRow = data.find(p => p.guid === guid);
		if (deletedRow) {
			data.splice(data.indexOf(deletedRow), 1);
		} else {
			console.error('Deleting an undisplayed row is impossible!', deletedRow);
		}

		this.props.changeData(data);
	}

	showModal = () => {
		this.setState({modalOpen: true});
	}

	onModalClose = () => {
		this.setState({modalOpen: false});
	}

	render() {
		const { column, direction } = this.state;

		return (
			<div>
				<UserCreationModal
					initialUserLocation={this.props.initialUserLocation}
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
						{_.map(this.props.data,
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

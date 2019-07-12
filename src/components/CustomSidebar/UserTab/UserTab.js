import React, { Component} from 'react';
import { Table, Button, Transition } from 'semantic-ui-react';
import _ from 'lodash';
import User from '../../../models';
import ParticipantRow from './ParticipantRow';

import './UserTab.css';

export default class UserTab extends Component {

	constructor(props) {
		super(props);

		this.handleSort = this.handleSort.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleRemove = this.handleRemove.bind(this);

		this.state = {
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

	handleAdd = () => {
		let { data } = this.state;

		let addedRow = new User('Bert', 20, 'bike');
		data.push(addedRow);

		this.setState({data});
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

	render() {
		const { column, data, direction } = this.state;

		return (
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
								onClick={this.handleAdd}
							/>
						</Table.HeaderCell>
					</Table.Row>
			  </Table.Footer>
			</Table>
		);
	}
}

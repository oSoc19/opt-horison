import React, { Component} from 'react';
import { Table, Button } from 'semantic-ui-react';
import _ from 'lodash'

export default class UserTab extends Component {

	constructor(props) {
		super(props);

		const tableData = [
			{
				guid: '1fb13332-d20f-4298-b89a-fe0bf7603f88',
				name: 'Tinaël',
				duration: 15,
				mode: 'cycling'
			},
			{
				guid: '48e9187d-db8d-43c5-8097-3f2559880a0a',
				name: 'Bert',
				duration: 20,
				mode: 'driving'
			},
			{
				guid: '4785ad2c-0916-4566-a7a6-830ccfc1dd55',
				name: 'Tim B.',
				duration: 5,
				mode: 'walking'
			}
		];

		this.state = {
			column: null,
			data: tableData,
			direction: null
		};
	}

	handleSort = clickedColumn => () => {
		const { column, data, direction } = this.state;
	
		if (column !== clickedColumn) {
		  this.setState({
			column: clickedColumn,
			data: _.sortBy(data, [clickedColumn]),
			direction: 'ascending',
		  });
	
		  return;
		}
	
		this.setState({
		  data: data.reverse(),
		  direction: direction === 'ascending' ? 'descending' : 'ascending',
		});
	}

	render() {
		const { column, data, direction } = this.state;

		return (
			<Table sortable celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell 
							sorted={column === 'name' ? direction : null}
							onClick={this.handleSort('name')}
						>
						Participant names
						</Table.HeaderCell>
						<Table.HeaderCell
							sorted={column === 'duration' ? direction : null}
							onClick={this.handleSort('duration')}
						>
						Max. duration (min)
						</Table.HeaderCell>
						<Table.HeaderCell
							sorted={column === 'mode' ? direction : null}
							onClick={this.handleSort('mode')}
						>
						Transport mode
						</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{_.map(data, ({ guid, name, duration, mode }) => (
					<Table.Row key={guid}>
						<Table.Cell>{name}</Table.Cell>
						<Table.Cell>{duration}</Table.Cell>
						<Table.Cell>{mode}</Table.Cell>
					</Table.Row>
					))}
				</Table.Body>

				<Table.Footer fullWidth>
				<Table.Row>
				  <Table.HeaderCell colSpan='3'>
					<Button icon='user' labelPosition='left' primary size='small' content='Add participant' />
				  </Table.HeaderCell>
				</Table.Row>
			  </Table.Footer>
			</Table>
		);
	}
}

import React, { Component} from 'react';
import { Modal, Header } from 'semantic-ui-react';
import UserCreationForm from './UserCreationForm';

import './UserCreationModal.css';

export default class UserCreationModal extends Component {

	constructor(props) {
		super(props);

		this.onClose = this.onClose.bind(this);
	}

	onClose = () => {
		this.props.closeModal();
	};

	render() {
		return (
			<Modal size='small' open={this.props.modalOpen} onClose={this.onClose} closeIcon>
				<Header icon='user' content='Add New Participant' />
				<Modal.Content>
					<UserCreationForm addParticipant={this.props.addParticipant}/>
				</Modal.Content>
			</Modal>
		);
	}
}

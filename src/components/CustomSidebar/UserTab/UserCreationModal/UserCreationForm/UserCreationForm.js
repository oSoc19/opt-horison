import React, { Component} from 'react';
import { Form } from 'semantic-ui-react';

import './UserCreationForm.css';
import User from '../../../../../models';

export default class UserCreationForm extends Component {

	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			name: '',
			duration: '',
			mode: ['walking'],
			agreement: false,

			nameError: false,
			durationError: false,
			modeError: false,
			agreementError: false,
			formError: false
		};
	}
	
	onSubmit (e) {
		e.preventDefault();
		let error = false;
		const {name, duration, mode, agreement } = this.state;

		if (name === '') {
			this.setState({nameError: true});
			error = true;
		} else {
			this.setState({nameError: false});
		}

		if (duration === '' || duration === 0 || isNaN(parseInt(duration))) {
			this.setState({durationError: true});
			error = true;
		} else {
			this.setState({durationError: false});
		}

		if (!mode || mode.length === 0 || mode === []) {
			this.setState({modeError: true});
			error = true;
		} else {
			this.setState({modeError: false});
		}

		if (!agreement) {
			this.setState({agreementError: true});
			error = true;
		} else {
			this.setState({agreementError: false});
		}

		if (error) {
			this.setState({formError: true});
			return;
		}

		this.setState({formError: false});
		
		// create user, add to list and add marker on map
		console.log(this.state);
		
		this.props.addParticipant(new User(name, duration, mode));
	}

	onChange (e, {name, value}) {
		e.preventDefault();

		if ([name].toString() === 'mode') {
			const {mode} = this.state;
			if (mode && mode.length > 0 && mode.includes(value)) {
				mode.splice(mode.indexOf(value), 1);
			} else {
				mode.push(value);
			}
			this.setState({mode});
			return;
		}

		if (value === 'agreed') {
			this.setState({agreement: !this.state.agreement});
			return;
		}
		
		this.setState({[name]: value});
	}

	render() {
		let { name, duration, mode, agreement,
			nameError, durationError, modeError, agreementError, formError
		} = this.state;

		return (
			<Form 
				onSubmit={this.onSubmit}
				error={formError}
			>
				<Form.Field inline>
					<Form.Input
						required
						label='Name' 
						name='name'
						placeholder="Participant's name"
						onChange={this.onChange}
						error={nameError}
						value={name}
					/>
				</Form.Field>
				<Form.Field inline>
					<Form.Input
						required
						type='number'
						label='Duration'
						name='duration'
						placeholder='Maximum duration' 
						onChange={this.onChange}
						error={durationError}
						value={duration}
						min={1}
						max={200}
					/>
				</Form.Field>
				<Form.Group inline>
					<Form.Field label='Transport mode' required />
					<Form.Checkbox
						name='mode'
						value='walking'
						type='checkbox'
						defaultChecked={true}
						toggle
						label='Walking'
						onChange={this.onChange}
						error={modeError}
					/>
					<Form.Checkbox
						name='mode'	
						value='train'
						type='checkbox'	
						disabled
						toggle
						label='Train'
						onChange={this.onChange}
						error={modeError}
					/>
					<Form.Checkbox
						name='mode'
						value='car'
						type='checkbox'
						disabled
						toggle
						label='Car'
						onChange={this.onChange}
						error={modeError}
					/>
					<Form.Checkbox
						name='mode'
						value='bicycle'
						type='checkbox'
						disabled
						toggle
						label='Bike'
						onChange={this.onChange}
						error={modeError}
					/>
				</Form.Group>
				
				<br />
				<Form.Checkbox
					name='agreement'
					value='agreed'
					required
					label='I agree to the Terms and Conditions'
					onChange={this.onChange}
					error={agreementError}
				/>
				<Form.Button 
					content='Submit' 
					fluid 
					type='submit' 
					color='blue'
					disabled={!name || !duration || !mode || !agreement}
				/>
			</Form>
		);
	}
}

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
			modes: ['walking'],
			color: '#FFA500',
			agreement: false,

			nameError: false,
			durationError: false,
			modesError: false,
			colorError: false,
			agreementError: false,
			formError: false
		};
	}
	
	isColor = (strColor) => {
		var s = new Option().style;
		s.color = strColor;

		// return 'false' if color wasn't assigned
		return s.color === strColor.toLowerCase();
	}

	onSubmit (e) {
		e.preventDefault();
		let error = false;
		const {name, duration, modes, color, agreement } = this.state;

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

		if (!modes || modes.length === 0 || modes === []) {
			this.setState({modesError: true});
			error = true;
		} else {
			this.setState({modesError: false});
		}

		if (!color || color.length === 0 || !this.isColor(color)) {
			this.setState({colorError: true});
		} else {
			this.setState({colorError: false});
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
			
		this.props.addParticipant(new User(name, duration, modes, this.props.initialUserLocation, color));
	}

	onChange (e, {name, value}) {
		e.preventDefault();

		if ([name].toString() === 'mode') {
			const {modes} = this.state;
			if (modes && modes.length > 0 && modes.includes(value)) {
				modes.splice(modes.indexOf(value), 1);
			} else {
				modes.push(value);
			}
			this.setState({modes});
			return;
		}

		if (value === 'agreed') {
			this.setState({agreement: !this.state.agreement});
			return;
		}
		
		this.setState({[name]: value});
	}

	render() {
		let { name, duration, modes, color, agreement,
			nameError, durationError, modesError, colorError, agreementError, formError
		} = this.state;

		return (
			<Form 
				onSubmit={this.onSubmit}
				error={formError}
			>
				<Form.Field inline>
					<Form.Input
						required
						type='text'
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
						name='modes'
						value='walking'
						type='checkbox'
						defaultChecked={true}
						toggle
						label='Walking'
						onChange={this.onChange}
						error={modesError}
					/>
					<Form.Checkbox
						name='modes'
						value='car'
						type='checkbox'
						toggle
						label='Car'
						onChange={this.onChange}
						error={modesError}
					/>
					<Form.Checkbox
						name='modes'	
						value='train'
						type='checkbox'	
						disabled
						toggle
						label='Train'
						onChange={this.onChange}
						error={modesError}
					/>
					<Form.Checkbox
						name='modes'
						value='bicycle'
						type='checkbox'
						disabled
						toggle
						label='Bike'
						onChange={this.onChange}
						error={modesError}
					/>
				</Form.Group>
				<Form.Group inline>
					<Form.Input
						name='color'
						id='color'
						type='color'
						value={color}
						label='Marker color'
						onChange={this.onChange}
						error={colorError}
						input={{style: {height: '38px', width: '35px', padding: '5px'}}}
					/>
				</Form.Group>
				<Form.Checkbox
					name='agreement'
					value='agreed'
					type='checkbox'
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
					disabled={!name || !duration || !modes || !agreement}
				/>
			</Form>
		);
	}
}

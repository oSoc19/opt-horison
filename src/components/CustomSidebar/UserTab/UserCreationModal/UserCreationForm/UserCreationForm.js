import React, { Component } from 'react';
import { Form } from 'semantic-ui-react';
import TransportModeGroup from './TransportModeGroup';

import './UserCreationForm.css';
import {User} from '../../../../../models';

export default class UserCreationForm extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);
		this.onDurationChange = this.onDurationChange.bind(this);
		this.onModeChange = this.onModeChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			allModes: [
				{ name: 'car', semanticicon: 'car', active: true },
				{ name: 'walking', semanticicon: 'blind', active: true },
				{ name: 'train', semanticicon: 'train', active: false },
				{ name: 'bike', semanticicon: 'bicycle', active: false }
			],

			name: '',
			duration: '',
			modes: ['walking'],
			color: '#353682',

			nameError: false,
			durationError: false,
			colorError: false,
			formError: false
		};
	}
	
	isColor(strColor) {
		var s = new Option().style;
		s.color = strColor;

		// return 'false' if color wasn't assigned
		return s.color === strColor.toLowerCase();
	}

	onSubmit(e) {
		e.preventDefault();
		let error = false;
		const {name, duration, modes, color } = this.state;

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

		if (!color || color.length === 0 || !this.isColor(color)) {
			this.setState({colorError: true});
		} else {
			this.setState({colorError: false});
		}

		if (error) {
			this.setState({formError: true});
			return;
		}
		this.setState({formError: false});
		
		this.props.addParticipant(new User(name, duration, modes, this.props.initialUserLocation, color));
	}

	onChange(e, {name, value}) {
		e.preventDefault();
		
		this.setState({[name]: value});
	}

	onModeChange(mode) {
		this.setState({modes: [mode.toLowerCase()]});
	}

	onDurationChange(e) {
		e.preventDefault();
		let value = e.target.value;
		if (!isNaN(parseInt(value))) {
			value = parseInt(value);
		} else {
			value = 5;
		}
		this.setState({duration : value});
	}

	render() {
		let { 
			allModes, 
			name, duration, modes, color,
			nameError, durationError, colorError, formError
		} = this.state;

		return (
			<Form 
				onSubmit={this.onSubmit}
				error={formError}
			>
				<Form.Group width={2}>
					<Form.Field className='name'>
						<Form.Input
							type='text'
							label='NAME:' 
							name='name'
							placeholder="Participant's name"
							onChange={this.onChange}
							error={nameError}
							value={name}
							input={{
								style: {
									height: '50px',
									width: '313px',
									boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.15)',
									borderRadius: '0px',
									fontSize: '18px',
									fontFamily: 'Karla',
									lineHeight: '21px',
									letterSpacing: '-0.03em',
									padding: '15px'
								}
							}}
						/>
					</Form.Field>
					<Form.Field className='marker'>
						<Form.Input
							name='color'
							id='color'
							type='color'
							value={color}
							label='MARKER:'
							onChange={this.onChange}
							error={colorError}
							input={{
								style: {
									height: '50px', 
									width: '90px', 
									padding: '0',
									backgroundColor: color,
									borderRadius: '0px',
									boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.15)',
									appearance: 'none'
								}
							}}
						/>
					</Form.Field>
				</Form.Group>
				<Form.Group>
					<TransportModeGroup modes={allModes} onModeChange={this.onModeChange}/>
				</Form.Group>
				<Form.Field inline>
					<div className="field">
						<label>DURATION:</label>
						<div className='ui input'>
							<input
								type='number'
								name='duration'
								placeholder='Maximum time' 
								onChange={this.onDurationChange}
								error={durationError ? durationError : undefined}
								value={duration}
								min={5}
								max={240}
								id='durationInput'
							/>
						</div>
						<span className='metrics'>min</span>
					</div>
				</Form.Field>
				<br/>

				<Form.Button 
					content='Submit' 
					fluid 
					type='submit' 
					color='blue'
					disabled={!name || !duration || !modes}
					style={{
						background: '#0B132B',
						boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.15)',
						borderRadius: '5px'
					}}
				/>
			</Form>
		);
	}
}

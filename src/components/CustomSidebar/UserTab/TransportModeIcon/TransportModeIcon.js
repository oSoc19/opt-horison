import React, { Component} from 'react';
import { Icon } from 'semantic-ui-react';

import './TransportModeIcon.css';

export default class TransportModeIcon extends Component {
	render() {
		const {mode} = this.props;
		let icon;
		if (mode === 'bike') {
			icon = 'bicycle';
		} else if (mode === 'car') {
			icon = 'car';
		} else if (mode === 'bus') {
			icon = 'bus';
		} else if (mode === 'train') {
			icon = 'train';
		} else if (mode === 'subway') {
			icon = 'subway';
		} else {
			icon = 'blind';
		}
		return (<Icon name={icon} size='big' />);
	}
}

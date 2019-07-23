import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

import './ExpandCollapseButton.css';

export default class ExpandCollapseButton extends Component {
	constructor(props) {
		super(props);
		
		this.handleHideClick = this.handleHideClick.bind(this);
		this.handleShowClick = this.handleShowClick.bind(this);
	}

	handleHideClick() {
		this.props.onHideClick();
	}

	handleShowClick() {
		this.props.onShowClick();
	}

	render() {
		return this.props.visible
			? <Button size='mini' className='margotArrow arrow-hide' onClick={this.handleHideClick} icon='chevron left' />
			: <Button size='mini' className='margotArrow arrow-show' onClick={this.handleShowClick} icon='chevron right' />;
	}
}

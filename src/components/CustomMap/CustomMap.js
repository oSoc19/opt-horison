import React, { Component} from 'react';
import ReactMapboxGl from 'react-mapbox-gl';

import './CustomMap.css';

const Map = ReactMapboxGl({
    accessToken: process.env.REACT_APP_MABPOX_TOKEN,
});

export default class CustomMap extends Component {
	constructor(props) {
		super(props);
		
		this.state = {	
			center: this.props.center,
			containerStyle: { height: '100vh', width: '100vw' }
		}
	}
 
	render() {
		return (
			// eslint-disable-next-line
			<Map style='mapbox://styles/mapbox/streets-v11'
				className='CustomMap'
				center={this.state.center} // hardcoded center point in Brussels
				containerStyle={this.state.containerStyle}>
			</Map>
		);
	}
}

// @flow
import React, { Component} from 'react';

import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';

const Map = ReactMapboxGl({
	accessToken: 'pk.eyJ1IjoidGltdXRhYmxlIiwiYSI6ImNqeG45MXp1YzAwN3kzbXBnZnlhaGNndXQifQ.ZpWwVyzwLHNM6dQxdJAx1g',
  });

class CustomMap extends Component {
	static defaultProps = {};
	
	state = {};
 
	render() {
		return (
		<Map
			className="CustomMap"
			style="mapbox://styles/mapbox/streets-v11"
			center={[4.352440, 50.846480]} // hardcoded center point in Brussels
			containerStyle={{
				height: "100vh",
				width: "100vw"
			}}>
			<Layer
				type="symbol"
				id="marker"
				layout={{ "icon-image": "marker-15" }}>
				<Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
			</Layer>
		</Map>
		);
	}
}

CustomMap.defaultProps = {};
CustomMap.propTypes = {};

export default CustomMap;

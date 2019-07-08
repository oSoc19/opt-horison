// @flow
import React, { Component} from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import "./Sidebar.css";

class Sidebar extends Component {
	static defaultProps = {};
	
	state = {};
 
	render() {
		return (
		<Tabs className="Sidebar">
			<TabList>
				<Tab>Participants</Tab>
				<Tab>Meeting locations</Tab>
			</TabList>

			<TabPanel>
				<h2>Participants poll (name, max duration, transport mode)</h2>
			</TabPanel>
			<TabPanel>
				<h2>Checkboxes for possible meeting locations</h2>
			</TabPanel>
		</Tabs>
		);
	}
}

Sidebar.defaultProps = {};
Sidebar.propTypes = {};

export default Sidebar;


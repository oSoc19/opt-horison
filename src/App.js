import React, { Component } from 'react';
import { Sidebar, Segment } from 'semantic-ui-react';
import CustomSidebar from './components/CustomSidebar';
import CustomMap from './components/CustomMap';
import ExpandCollapseButton from './components/ExpandCollapseButton';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleSidebarHide = this.handleSidebarHide.bind(this);
    this.state = { visible: true };
  }

  handleHideClick = () => this.setState({ visible: false })
  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <ExpandCollapseButton
          visible={this.state.visible}
          onHideClick={this.handleHideClick} 
          onShowClick={this.handleShowClick} 
        >
        </ExpandCollapseButton>
        
        <CustomSidebar visible={this.state.visible} onSidebarHide={this.handleSidebarHide}></CustomSidebar>
        
        <Sidebar.Pusher>
          <CustomMap center={[4.352440, 50.846480]}></CustomMap>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

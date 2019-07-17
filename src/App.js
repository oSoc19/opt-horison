import React, { Component } from 'react';
import { Sidebar, Segment } from 'semantic-ui-react';
import CustomSidebar from './components/CustomSidebar';
import CustomMap from './components/CustomMap';
import ExpandCollapseButton from './components/CustomSidebar/ExpandCollapseButton';
import { getAllPointSets } from './data/pointsets.js';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleSidebarHide = this.handleSidebarHide.bind(this);
    this.togglePointSet = this.togglePointSet.bind(this);

    this.mapRef = React.createRef();

    this.state = {
        visible: true,
        points: getAllPointSets(),
        shouldUpdate: false,
    };
  }

  handleHideClick = () => this.setState({ visible: false })
  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })

  togglePointSet(pointSetName) {
      return e => {
          const points = [ ...this.state.points ];
          const pointSet = points.find(ps => ps.name === pointSetName);
          pointSet.active = !pointSet.active;
          this.setState({ points });
          setTimeout(() => {
            this.mapRef.current.setPoints()
          }, 50);
      };
  }

  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <ExpandCollapseButton
          visible={this.state.visible}
          onHideClick={this.handleHideClick}
          onShowClick={this.handleShowClick}>
        </ExpandCollapseButton>

        <CustomSidebar
            pointSets={this.state.points}
            togglePointSet={this.togglePointSet}
            visible={this.state.visible}
            onSidebarHide={this.handleSidebarHide}>
        </CustomSidebar>

        <Sidebar.Pusher>
          <CustomMap
            ref={this.mapRef}
            center={[4.352440, 50.846480]}
            pointSets={this.state.points.filter(ps => ps.active)}>
          </CustomMap>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

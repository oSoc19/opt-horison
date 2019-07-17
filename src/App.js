import React, { Component } from 'react';
import { Sidebar, Segment } from 'semantic-ui-react';
import CustomSidebar from './components/CustomSidebar';
import CustomMap from './components/CustomMap';
import ExpandCollapseButton from './components/CustomSidebar/ExpandCollapseButton';

import './App.css';

const INITIAL_USER_LOCATION = [4.357028, 50.860708]; // lng - lat of BOSA

export default class App extends Component {
  constructor(props) {
    super(props);

    this.changeData = this.changeData.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleSidebarHide = this.handleSidebarHide.bind(this);

    this.state = { 
      mapCenter: INITIAL_USER_LOCATION,
      initialUserLocation: INITIAL_USER_LOCATION,
      visible: true,
      data: []
    };
  }

  componentWillMount = () => {
    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        const { latitude, longitude } = coords;

        this.setState({
          mapCenter: [longitude, latitude],
          initialUserLocation : [longitude, latitude]
        });
      },
      err => {
        console.error('Cannot retrieve your current position', err);
      }
    );
  }

  onDragEnd = ({lngLat}, guid) => {
    const {data} = this.state;
    const index = data.indexOf(data.find(p => p.guid === guid));
    if (index !== -1) {
      data[index].location = [lngLat.lng, lngLat.lat];
      this.setState({data});
    }
  }

  changeData = (data) => {
    if (!Array.isArray(data)) {
      console.error('Data is not an array!', data);
      return;
    }
    console.log(data);
    this.setState({data});
  }

  handleHideClick = () => this.setState({ visible: false })
  handleShowClick = () => this.setState({ visible: true })
  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    const { visible, data, mapCenter, initialUserLocation } = this.state;

    return (
      <Sidebar.Pushable as={Segment}>
        <ExpandCollapseButton
          visible={visible}
          onHideClick={this.handleHideClick} 
          onShowClick={this.handleShowClick} 
        >
        </ExpandCollapseButton>
        
        <CustomSidebar 
          data={data} 
          changeData={this.changeData} 
          visible={visible} 
          onSidebarHide={this.handleSidebarHide}
          initialUserLocation={initialUserLocation}
        />
        
        <Sidebar.Pusher>
          <CustomMap 
            center={mapCenter}
            data={data}
            onDragEnd={this.onDragEnd}
          />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

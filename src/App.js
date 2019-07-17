import React, { Component } from 'react';
import { Sidebar, Segment } from 'semantic-ui-react';
import CustomSidebar from './components/CustomSidebar';
import CustomMap from './components/CustomMap';
import ExpandCollapseButton from './components/CustomSidebar/ExpandCollapseButton';
import { getAllPointSets } from './data/pointsets.js';

import './App.css';
import User from './models';

//                             lng              - lat
const INITIAL_USER_LOCATION = [4.356112791539232, 50.86078680502487];
const BOSA_USER_LOCATION    = [4.356400088940063, 50.859772008199144]; 
const HERMAN_USER_LOCATION  = [4.350017567235199, 50.86568777851741];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.onParticipantsChange = this.onParticipantsChange.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleSidebarHide = this.handleSidebarHide.bind(this);
    this.togglePointSet = this.togglePointSet.bind(this);

    this.state = { 
      mapCenter: INITIAL_USER_LOCATION,
      initialUserLocation: INITIAL_USER_LOCATION,
      visible: true,
      participants: [
        new User('One', 15, ['walk'], BOSA_USER_LOCATION, '#ff0000'),
        new User('Two', 20, ['walk'], HERMAN_USER_LOCATION, 'rgb(166, 33, 222)'),
        new User('Three', 25, ['walk', 'car'], INITIAL_USER_LOCATION, 'orange')
      ],
      loading: false,
      points: getAllPointSets(),
      shouldUpdate: false,
    };
    this.mapRef = React.createRef();
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
    const {participants} = this.state;
    const index = participants.indexOf(participants.find(p => p.guid === guid));
    if (index !== -1) {
      participants[index].location = [lngLat.lng, lngLat.lat];
      this.onParticipantsChange(participants);
      console.log(participants[index].location);
    }
  }

  onParticipantsChange = (participants) => {
    if (!Array.isArray(participants)) {
      console.error('"Participants" variable is not an array!', participants);
      return;
    }
    //TODO: check that participants is an array of User()
    this.setState({participants});
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
    const { visible, participants, mapCenter, initialUserLocation, loading } = this.state;

    return (
      <Sidebar.Pushable as={Segment}>
        <ExpandCollapseButton
          visible={this.state.visible}
          onHideClick={this.handleHideClick}
          onShowClick={this.handleShowClick}>
        </ExpandCollapseButton>
        
        <CustomSidebar 
          participants={participants} 
          onParticipantsChange={this.onParticipantsChange} 
          visible={visible} 
          onSidebarHide={this.handleSidebarHide}
          initialUserLocation={initialUserLocation}
          pointSets={this.state.points}
          togglePointSet={this.togglePointSet}
        />
    
        <Sidebar.Pusher>
          <Segment loading={loading}>
            <CustomMap 
              center={mapCenter}
              participants={participants}
              onDragEnd={this.onDragEnd}
              ref={this.mapRef}
              pointSets={this.state.points.filter(ps => ps.active)}
            />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

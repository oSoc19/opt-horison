import React, { Component } from 'react';
import { Sidebar, Segment } from 'semantic-ui-react';
import CustomSidebar from './components/CustomSidebar';
import CustomMap from './components/CustomMap';
import ExpandCollapseButton from './components/CustomSidebar/ExpandCollapseButton';
import PointSetsData from './data/pointsets';

import './App.css';
import { User } from './models';

const INITIAL_USER_LOCATION   = [4.356112, 50.860786];
const BOSA_USER_LOCATION      = [4.356331, 50.860699]; 
const HERMAN_USER_LOCATION    = [4.350018, 50.865685];
const KBC_USER_LOCATION       = [4.346777, 50.860929];
const GAUCHERET_USER_LOCATION = [4.360043, 50.864025];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.onParticipantsChange = this.onParticipantsChange.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.handleHideClick = this.handleHideClick.bind(this);
    this.handleShowClick = this.handleShowClick.bind(this);
    this.handleSidebarHide = this.handleSidebarHide.bind(this);
    this.togglePointSet = this.togglePointSet.bind(this);
    this.refreshMap = this.refreshMap.bind(this);
    this.onLoadingStart = this.onLoadingStart.bind(this);
    this.onLoadingEnd = this.onLoadingEnd.bind(this);
    this.onCenterChange = this.onCenterChange.bind(this);

    this.state = { 
      mapCenter: INITIAL_USER_LOCATION,
      initialUserLocation: INITIAL_USER_LOCATION,
      visible: true,
      participants: [
        new User('Tim', 15, 'walk', BOSA_USER_LOCATION, '#F7C282'),
        new User('Bert', 15, 'walk', HERMAN_USER_LOCATION, '#C4445B'),
        new User('Tinaël', 15, 'walk', KBC_USER_LOCATION, '#28A987'),
        new User('Pieter', 15, 'walk', GAUCHERET_USER_LOCATION, '#353682')        
      ],
      loading: false,
      pointSets: PointSetsData.getAllPointSets(),
      shouldUpdate: false,
    };
    this.mapRef = React.createRef();
  }

  componentWillMount() {
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

  handleHideClick() {
    this.setState({ visible: false });
  }

  handleShowClick() {
    this.setState({ visible: true });
  }

  handleSidebarHide() {
    this.setState({ visible: false });
  }
  
  onLoadingStart() {
    this.setState({loading: true});
  }

  onLoadingEnd() {
    this.setState({loading:false});
  }

  onDragEnd({lngLat}, guid) {
    const {participants} = this.state;
    const index = participants.indexOf(participants.find(p => p.guid === guid));
    if (index !== -1) {
      participants[index].location = [lngLat.lng, lngLat.lat];
      this.onParticipantsChange(participants);
    } else {
      console.error('Participant not found!');
    }
  };

  onParticipantsChange(participants) {
    if (!Array.isArray(participants)) {
      console.error('"Participants" variable is not an array!', participants);
      return;
    }
    //TODO: check that participants is an array of User()
    this.setState({participants});
  };

  togglePointSet(pointSetName) {
      return () => {
          const pointSets = [ ...this.state.pointSets ];
          const pointSet = pointSets.find(ps => ps.name === pointSetName);
          pointSet.active = !pointSet.active;
          this.setState({ pointSets });
          // Timeout so React can propagate its state first, otherwise the
          // PoI update will only show when the user clicks twice, which 
          // is too late.
          setTimeout(() => {
            this.mapRef.current.setPoints()
          }, 50);
      };
  };

  refreshMap() {
    this.mapRef.current.loadMapAndLayers();
  }

  onCenterChange(newCenter) {
    this.setState({center: newCenter});
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
          visible={visible}  
          onSidebarHide={this.handleSidebarHide}

          participants={participants} 
          onParticipantsChange={this.onParticipantsChange}

          refreshMap={this.refreshMap}
          initialUserLocation={initialUserLocation}

          pointSets={this.state.pointSets}
          togglePointSet={this.togglePointSet}
        />
    
        <Sidebar.Pusher>
          <Segment loading={loading}>
            <CustomMap
              ref={this.mapRef}  
              onLoadingStart={this.onLoadingStart}
              onLoadingEnd={this.onLoadingEnd}

              center={mapCenter}
              onCenterChange={this.onCenterChange}

              participants={participants}
              onParticipantsChange={this.onParticipantsChange}
              onDragEnd={this.onDragEnd}
              
              pointSets={this.state.pointSets.filter(ps => ps.active)}
            />
          </Segment>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

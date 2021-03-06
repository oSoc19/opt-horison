import React, { Component } from 'react';
import { Sidebar, Tab } from 'semantic-ui-react';
import UserTab from './UserTab';
import POITab from './POITab';

import './CustomSidebar.css';

export default class CustomSidebar extends Component {
    constructor(props) {
        super(props);

        this.onHide = this.onHide.bind(this);
    }

    onHide() {
        this.props.onSidebarHide();
    }

    render() {
        const visible = this.props.visible;
        const panes = [
            { 
                menuItem: {
                    content: 'PARTICIPANTS',
                    icon: 'users',
                    key: 'users'
                },
                pane: {
                    key: 'usersPane',
                    content: (<UserTab
                        refreshMap={this.props.refreshMap}
                        initialUserLocation={this.props.initialUserLocation} 
                        onParticipantsChange={this.props.onParticipantsChange} 
                        participants={this.props.participants}
                    />)
                }
            },
            { 
                menuItem: {
                    content: 'MEETING POINTS',
                    icon:'coffee', key:'locations'
                },
                pane: {
                    key: 'locationsPane',
                    content: (<POITab
                        pointSets={this.props.pointSets}
                        togglePointSet={this.props.togglePointSet}
                    />)
                }
            }
        ];
  
        return (
            <Sidebar
                className='sidebar'
                animation='overlay'
                direction='left'
                onHide={this.onHide}
                visible={visible}
                width='wide'

                as={Tab}
                panes={panes}
                menu={{className:'margotColor', inverted: true}}
                renderActiveOnly={false}
            >
            </Sidebar>
        );
    }
}

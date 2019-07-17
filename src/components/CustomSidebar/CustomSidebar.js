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
                    content: 'Participants',
                    icon: 'users',
                    key: 'users'
                },
                pane: {
                    key: 'usersPane',
                    content: (<UserTab initialUserLocation={this.props.initialUserLocation} changeData={this.props.changeData} data={this.props.data}></UserTab>)
                }
            },
            { 
                menuItem: {
                    content: 'Meeting locations',
                    icon:'coffee', key:'locations'
                },
                pane: {
                    key: 'locationsPane',
                    content: (<POITab></POITab>)
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
                width='very wide'

                as={Tab}
                panes={panes}
                menu={{color:'blue'}}
                renderActiveOnly={false}
            >
            </Sidebar>
        );
    }
}

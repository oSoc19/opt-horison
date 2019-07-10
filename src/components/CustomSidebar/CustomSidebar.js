import React, { Component } from 'react';
import { Sidebar, Tab } from 'semantic-ui-react';

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
            { menuItem: 'Participants', render: () => <Tab.Pane><h2>Participants poll (name, max duration, transport mode)</h2></Tab.Pane> },
            { menuItem: 'Meeting locations', render: () => <Tab.Pane><h2>Checkboxes for possible meeting locations</h2></Tab.Pane> }
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
            >
            </Sidebar>
        );
    }
}

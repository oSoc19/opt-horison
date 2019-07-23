import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';

import './TransportModeButton.css';

export default class TransportModeButton extends Component {
    render() {
        return (
            <div 
                className={
                    this.props.mode.active 
                        ? (this.props.isSelected ? "radio-btn selected" : "radio-btn unselected")
                        : 'radio-btn disabled'
                }
                onClick={() => this.props.mode.active ? this.props.onClick(this.props.index) : undefined}
            >
                <Icon 
                    name={this.props.mode.semanticicon} 
                    size='big' 
                    style={{
                        color: this.props.isSelected ? 'white' : 'black'
                    }}
                    disabled={!this.props.mode.active}
                />
                <label>{this.props.mode.name.toUpperCase()}</label>
            </div>
        );
    }
}

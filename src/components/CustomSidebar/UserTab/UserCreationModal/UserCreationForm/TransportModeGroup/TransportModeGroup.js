import React, { Component } from 'react';
import TransportModeButton from './TransportModeButton';

import './TransportModeGroup.css';

export default class TransportModeGroup extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedIndex: 1
        };
    }

    render() {
        const { selectedIndex } = this.state;
        const { modes } = this.props;

        return (
            <div className='field'>
                <label>TRANSPORT MODE:</label>
            {modes.map((mode, i) => 
                <TransportModeButton
                    key={i}
                    index={i}
                    isSelected={selectedIndex === i}
                    mode={mode}
                    onClick={(index) => {
                        this.setState({selectedIndex: index});
                        this.props.onModeChange(mode.name);
                    }}
                />
            )}
            </div>
        );
    }
}
import React, { Component } from 'react';
import './Initial.css';

class Initial extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        const {color} = this.props;
        const {actionHandler} = this.props;
        return (
            <div className={'initial-container'} style={{backgroundColor: color, color: 'white'}}>
                <button onClick={() => actionHandler('EnterBorrowFlow', {})}>Lån</button>
            </div>
        );
    }
}

export default Initial;

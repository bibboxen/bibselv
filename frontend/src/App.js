import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import Initial from './Steps/Initial';

class App extends Component {
    constructor (props) {
        super(props);

        const urlParams = new URLSearchParams(window.location.search);
        const machineId = urlParams.get('machineId');

        this.socket = null;

        this.state = {
            machineId: machineId,
            machineState: {},
            // @TODO: Make configurable.
            endpoint: 'http://0.0.0.0:8010'
        };

        this.handleAction = this.handleAction.bind(this);
    }

    componentDidMount () {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        this.socket = socket;
        socket.emit('StartMachine', this.state.machineId);
        socket.on('UpdateState', data => this.setState({machineState: data}));
    }

    handleAction (action, data) {
        console.log('handleAction', action, data);
        this.socket.emit('Action', {
                action: action,
                data: data
            }
        );
    }

    renderStep (step, machineState) {
        switch (step) {
            case 'initial':
                return <Initial color={machineState.color} actionHandler={this.handleAction} />;
            case 'chooseLogin':
                return <div>ChooseLogin</div>;
            case 'loginScan':
                return <div>LoginScan</div>;
            case 'loading':
            default:
                return (
                    <div className={'app-default'}
                         style={{textAlign: 'center'}}>
                        Please wait...
                    </div>
                );
        }
    }

    render () {
        const {machineState} = this.state;

        return (
            <div className={'app-container'}>
                {this.renderStep(machineState.step, machineState)}
            </div>
        );
    }
}

export default App;

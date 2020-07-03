import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import Initial from './Steps/Initial';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import ScanLogin from './Steps/ScanLogin';
import Borrow from './Steps/Borrow';
import ActionFaker from './actionFaker';

// @TODO: Rewrite as functional component.
class App extends Component {
    constructor(props) {
        super(props);

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        this.socket = null;

        this.state = {
            fake: true,
            token: token,
            machineState: {},
            // @TODO: Make configurable.
            endpoint: 'http://bibbox-website.local.itkdev.dk:8010'
        };

        this.handleAction = this.handleAction.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.setMachineState = this.setMachineState.bind(this);
        this.getMachineState = this.getMachineState.bind(this);
    }

    setMachineState(data) {
        this.setState({machineState: data}, () => {
            console.log('UpdateState', this.state.machineState);
        });
    }

    getMachineState() {
        return this.state.machineState;
    }

    componentDidMount () {
        const { endpoint } = this.state;
        const { fake } = this.state;

        if (fake) {
            this.actionFaker = new ActionFaker(this.getMachineState, this.setMachineState);
        }

        if (!fake) {
            const socket = socketIOClient(endpoint, {
                transports: ['websocket', 'polling'],
            });
            this.socket = socket;
            socket.on('UpdateState', data => {
                this.setMachineState(data)
            });
            // Ready
            socket.emit('ClientReady', {
                token: this.state.token
            });
        }
        else {
            console.log('Running with fake content.');

            this.setState({
                machineState: {
                    step: 'initial'
                }
            });
        }
    }

    handleAction(action, data) {
        console.log('handleAction', action, data);

        const { fake } = this.state;

        if (!fake) {
            this.socket.emit('ClientEvent', {
                name: 'Action',
                token: this.state.token,
                action: action,
                data: data
            });
        }
        else {
            this.actionFaker.handleAction(action, data);
        }
    }

    handleReset () {
        console.log('handleReset');

        const {fake} = this.state;

        if (!fake) {
            this.socket.emit('ClientEvent', {
                name: 'Reset',
                token: this.state.token
            });
        }
        else {
            this.actionFaker.handleReset();
        }
    }

    renderStep(step, machineState) {
        switch (step) {
        case 'initial':
            return <Initial machineState={machineState} actionHandler={this.handleAction} handleReset={this.handleReset} />;
        case 'chooseLogin':
            return <div>@TODO: chooseLogin</div>;
        case 'loginScan':
            return <ScanLogin machineState={machineState} actionHandler={this.handleAction} handleReset={this.handleReset} />;
        case 'borrow':
            return <Borrow machineState={machineState} actionHandler={this.handleAction} handleReset={this.handleReset} />;
        default:
            return (
                <div className={'app-default'}
                    style={{ textAlign: 'center' }}>
                    <Alert variant={'warning'}>
                            Please wait...
                    </Alert>
                </div>
            );
        }
    }

    render() {
        const { machineState } = this.state;

        return (
            <div className={'app-container'}>
                {this.renderStep(machineState.step, machineState)}
            </div>
        );
    }
}

export default App;

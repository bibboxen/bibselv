import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import Initial from './Steps/Initial';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from 'react-bootstrap';
import ScanLogin from './Steps/ScanLogin';
import Borrow from './Steps/Borrow';

class App extends Component {
    constructor (props) {
        super(props);

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        this.socket = null;

        this.state = {
            token: token,
            machineState: {},
            // @TODO: Make configurable.
            endpoint: 'http://bibbox-website.local.itkdev.dk:8010'
        };

        this.handleAction = this.handleAction.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount () {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        this.socket = socket;
        socket.on('UpdateState', data => {
            this.setState({machineState: data}, () => {
                console.log("UpdateState", this.state.machineState);
            });
        });
        // Ready
        socket.emit('ClientReady', {
            token: this.state.token
        });
    }

    handleAction (action, data) {
        console.log('handleAction', action, data);
        this.socket.emit('ClientEvent', {
            name: 'Action',
            token: this.state.token,
            action: action,
            data: data
        });
    }

    handleReset () {
        this.socket.emit('ClientEvent', {
            name: 'Reset',
            token: this.state.token
        });
    }

    renderStep (step, machineState) {
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
                         style={{textAlign: 'center'}}>
                        <Alert variant={'warning'}>
                            Please wait...
                        </Alert>
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

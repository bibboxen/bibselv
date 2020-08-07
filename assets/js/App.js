/**
 * @file
 * Main entry point of react application.
 */

import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import Initial from './Steps/Initial';
import Login from './Steps/Login';
import Status from './Steps/Status';
import CheckInItems from './Steps/CheckInItems';
import NavBar from './Steps/components/navbar';
import MachineStateContext from './context/machineStateContext';
import CheckOutItems from './Steps/CheckOutItems';

/**
 * App.
 *
 * @return {*}
 * @constructor
 */
function App() {
    // @TODO: Get from configuration.
    const socket = socketIOClient('http://bibbox-website.local.itkdev.dk:8010');
    // @TODO: The state should not be set until the state is received through
    // the socket connection. Until then the app should be "loading".
    const [machineState, setMachineState] = useState({ step: 'initial' });
    // @TODO: Should come from configuration.
    const [library, setLibrary] = useState('Tranbjerg bibliotek');
    // @TODO: Add a comment about the store.
    const store = {
        machineState: { get: machineState, set: setMachineState },
        library: { get: library, set: setLibrary }
    };

    /**
     * Set up socket connection.
     */
    useEffect(() => {
        // Signal that the client is ready.
        socket.emit('ClientReady', {
            token: '123'
        });

        // Listen for changes to machine state.
        socket.on('UpdateState', (data) => {
            setMachineState(data);
        });
    }, []);

    /**
     * Handle a user action.
     *
     * @param action
     *   Name of the action
     * @param data
     */
    function handleAction(action, data) {
        // @TODO: Replace so it is the action that is reset insteaf of flow.
        if (data.flow === 'reset') {
            socket.emit('ClientEvent', {
                name: 'Reset',
                token: '123'
            });
        } else {
            socket.emit('ClientEvent', {
                name: 'Action',
                action: action,
                token: '123',
                data: data
            });
        }
    }

    /**
     * @TODO: Document function.
     *
     * @param step
     *   @TODO: Document parameter.
     * @return {*}
     */
    function renderStep(step) {
        switch (step) {
            case 'checkOutItems':
                return <CheckOutItems actionHandler={handleAction} />;
            case 'checkInItems':
                return <CheckInItems actionHandler={handleAction} />;
            case 'status':
                return <Status actionHandler={handleAction} />;
            case 'loginScan':
                return <Login actionHandler={handleAction} />;
            default:
                return <Initial actionHandler={handleAction} />;
        }
    }

    return (
        <>
            <MachineStateContext.Provider value={store}>
                <NavBar actionHandler={handleAction}/>
                <div className="container">
                    <div className="row" style={{ width: '100%' }}>
                        {renderStep(machineState.step)}
                    </div>
                </div>
            </MachineStateContext.Provider>
        </>
    );
}

export default App;

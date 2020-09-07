/**
 * @file
 * The main entrypoint of the react application.
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
import { useIdleTimer } from 'react-idle-timer'

/**
 * App. The main entrypoint of the react application.
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

    // Setup idle tester.
    // See https://github.com/SupremeTechnopriest/react-idle-timer for info.
    const idleTimer = useIdleTimer({
        // @TODO: Timeout (30 s.) should come from configuration.
        timeout: 1000 * 30,
        onIdle: () => {
            // Return to frontpage if not already there.
            if (machineState.step !== 'initial') {
                // @TODO: Use token from local storage.
                socket.emit('ClientEvent', {
                    name: 'Reset',
                    token: '123'
                });
            }
            else {
                idleTimer.reset();
            }
        },
        debounce: 500,
        eventsThrottle: 500
    });

    /**
     * Set up socket connection.
     */
    useEffect(() => {
        // Signal that the client is ready.
        // @TODO: Use token from local storage.
        socket.emit('ClientReady', {
            token: '123'
        });

        // Listen for changes to machine state.
        socket.on('UpdateState', (data) => {
            idleTimer.reset();
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
        idleTimer.reset();

        // @TODO: Replace so it is the action that is reset instead of flow.
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
     * Render the given step.
     *
     * @param step
     *   Name of the step to render.
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

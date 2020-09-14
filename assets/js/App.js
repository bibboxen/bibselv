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
import { useIdleTimer } from 'react-idle-timer';
import PropTypes from 'prop-types';

/**
 * App. The main entrypoint of the react application.
 *
 * @param token
 *   data token
 * @param socketUri
 *   the socket uri
 * @param boxConfiguration
 *   the box configuration
 * @return {*}
 * @constructor
 */
function App({ token, socketUri, boxConfiguration }) {
    // @TODO: The state should not be set until the state is received through
    // the socket connection. Until then the app should be "loading".
    const [machineState, setMachineState] = useState({ step: 'initial' });
    const [boxConfig, setBoxConfig] = useState(boxConfiguration);
    let socket = {};
    // @TODO: Add a comment about the store.
    const store = {
        machineState: { get: machineState, set: setMachineState },
        boxConfig: { get: boxConfig, set: setBoxConfig }
    };

    // Setup idle tester.
    // See https://github.com/SupremeTechnopriest/react-idle-timer for info.
    const idleTimer = useIdleTimer({
        // @TODO: Timeout (30 s.) should come from configuration.
        timeout: 1000 * 30,
        onIdle: () => {
            // Return to initial step if not already there.
            if (machineState.step !== 'initial') {
                socket.emit('ClientEvent', {
                    name: 'Reset',
                    token: token
                });
            } else {
                // Reset the idle timer if already on initial step.
                idleTimer.reset();
            }
        },
        debounce: 500,
        eventsThrottle: 500
    });

    /**
     * Set up application with configuration and socket connections.
     */
    useEffect(() => {
        socket = socketIOClient(socketUri);

        // Signal that the client is ready.
        socket.emit('ClientReady', {
            token: token
        });

        socket.on('Configuration', (data) => {
            setBoxConfig(data);
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
                token: token
            });
        } else {
            socket.emit('ClientEvent', {
                name: 'Action',
                action: action,
                token: token,
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
                <NavBar actionHandler={handleAction} />
                <div className='container'>
                    <div className='row' style={{ width: '100%' }}>
                        {renderStep(machineState.step)}
                    </div>
                </div>
            </MachineStateContext.Provider>
        </>
    );
}

App.propTypes = {
    token: PropTypes.string.isRequired,
    socketUri: PropTypes.string.isRequired,
    boxConfiguration: PropTypes.object.isRequired
};

export default App;

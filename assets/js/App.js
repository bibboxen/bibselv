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

// @TODO: why do we have to have these out here. If places inside App, the variable do not get updated.
let socket;
let boxConfig;

/**
 * App. The main entrypoint of the react application.
 *
 * @return {*}
 * @constructor
 */
function App(props) {

    // @TODO: The state should not be set until the state is received through
    // the socket connection. Until then the app should be "loading".
    const [machineState, setMachineState] = useState({ step: 'initial' });
    const [library, setLibrary] = useState('Loading...');

    // @TODO: Add a comment about the store.
    let store = {
        machineState: { get: machineState, set: setMachineState },
        library: { get: library, set: setLibrary },
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
                    token: props.token
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
        console.debug("Token:" + props.token);
        console.debug("Uri:" + props.socketUri);

        socket = socketIOClient(props.socketUri);

        // Signal that the client is ready.
        socket.emit('ClientReady', {
            token: props.token
        });

        socket.on('Configuration', (data) => {
            console.log(data);
            boxConfig = data;

            setLibrary(boxConfig.school.name);
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
                token: props.token
            });
        } else {
            socket.emit('ClientEvent', {
                name: 'Action',
                action: action,
                token: props.token,
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

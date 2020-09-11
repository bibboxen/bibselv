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
import NavBar from './steps/components/Navbar';
import MachineStateContext from './context/machineStateContext';
import CheckOutItems from './Steps/CheckOutItems';
import { useIdleTimer } from 'react-idle-timer';


/**
 * App. The main entrypoint of the react application.
 *
 * @param initialState
 *   The initial state of the app ("loading")
 *   is overridden in useEffect on updateState
 * @return {*}
 * @constructor
 */
function App({ initialState }) {
    // @TODO: Get from configuration.
    const socket = socketIOClient("http://bibbox-website.local.itkdev.dk:8010");
    const [machineState, setMachineState] = useState(initialState);
    // @TODO: Should come from configuration.
    const [library, setLibrary] = useState("Tranbjerg bibliotek");
    /**
     *
     * The storage contains the machinestate, which is the state of the app.
     * The state of the app determines the which component is rendered, and
     * can only be changed by the state machine.
     * The library is the name of the library the machine is installed on.
     *
     */
    const storage = {
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
                // @TODO: Use token from local storage.
                socket.emit('ClientEvent', {
                    name: 'Reset',
                    token: '123'
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

            socket.emit('ClientEvent', {
                name: 'Action',
                action: action,
                token: '123',
                data: data
            });
    }

    /**
     * renderStep determines which component to render based on the step
     * returned from the state machine.
     *
     * @param step
     *   The step from the machinestate
     * @return component to be rendered
     */
    function renderStep(step) {
        switch (step) {
            case "checkOutItems":
                return <CheckOutItems actionHandler={handleAction} />;
            case "checkInItems":
                return <CheckInItems actionHandler={handleAction} />;
            case "status":
                return <Status actionHandler={handleAction} />;
            case "loginScan":
                return <Login actionHandler={handleAction} />;
            default:
                return <Initial actionHandler={handleAction} />;
        }
    }

    return (
        <>
            <MachineStateContext.Provider value={storage}>
                <NavBar actionHandler={handleAction} />
                <div className="container">
                    <div className="row" style={{ width: "100%" }}>
                        {renderStep(machineState.step)}
                    </div>
                </div>
            </MachineStateContext.Provider>
        </>
    );
}

export default App;

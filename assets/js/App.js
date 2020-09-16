/**
 * @file
 * The main entrypoint of the react application.
 */

import React, { useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import PropTypes from 'prop-types';
import Bibbox from './steps/Bibbox';
import Loading from './steps/Loading';

/**
 * App. The main entrypoint of the react application.
 *
 * @param token
 *   Token, the identifier that connects to the backend
 *
 * @param socketUri
 *   The URI for the socket
 * @return {*}
 * @constructor
 */
function App({ token, socket }) {
    const [machineState, setMachineState] = useState();
    const [boxConfig, setBoxConfig] = useState();
    const [idleTimer, setIdleTimer] = useState(createIdleTimer())

    function createIdleTimer(timeout = 60000) {
        // Setup idle tester.
        // See https://github.com/SupremeTechnopriest/react-idle-timer for info.
        return useIdleTimer({
            // timeout will be overridden
            timeout: 60000,
            onIdle: () => {
                // Return to initial step if not already there.
                socket.emit('ClientEvent', {
                    name: 'Reset',
                    token: token,
                });
                idleTimer.reset();
            },
            debounce: 500,
            eventsThrottle: 500,
        });
    }

    /**
     * Set up application with configuration and socket connections.
     */
    useEffect(() => {
        // Signal that the client is ready.
        socket.emit('ClientReady', {
            token: token,
        });

        // Configuration recieved from backend.
        socket.on('Configuration', (data) => {
            setBoxConfig(data);
            setIdleTimer(createIdleTimer(data.inactivityTimeOut));
        });

        // Listen for changes to machine state.
        socket.on('UpdateState', (data) => {
            if (idleTimer) {
                idleTimer.reset();
            }
            setMachineState(data);
        });
    }, []);

    /**
     * Handle a user action.
     
     * @param action
     *   Name of the action
     * @param data
     *   Data that defines the request to the state machine, e.g. 'flow: 'checkOutItems''
     */
    function handleAction(action, data) {
        if (idleTimer) {
            idleTimer.reset();
        }
        if (data.action === 'reset') {
            socket.emit('ClientEvent', {
                name: 'Reset',
                token: token,
            });
        } else {
            socket.emit('ClientEvent', {
                name: 'Action',
                action: action,
                token: token,
                data: data,
            });
        }
    }

    return (
        <>
            {machineState && boxConfig && (
                <Bibbox
                    boxConfigurationInput={boxConfig}
                    machineStateInput={machineState}
                    actionHandler={handleAction}
                ></Bibbox>
            )}
            {!machineState && !boxConfig && <Loading></Loading>}
        </>
    );
}

App.propTypes = {
    token: PropTypes.string.isRequired,
    socket: PropTypes.object.isRequired,
};

export default App;

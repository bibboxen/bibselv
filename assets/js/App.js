/**
 * @file
 * The main entrypoint of the react application.
 */

import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { useIdleTimer } from "react-idle-timer";
import PropTypes from "prop-types";
import Bibbox from "./steps/Bibbox";
import Loading from "./steps/Loading";

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
let socket;
function App({ token, socketUri }) {
    const [machineState, setMachineState] = useState();
    const [boxConfig, setBoxConfig] = useState();

    // Setup idle tester.
    // See https://github.com/SupremeTechnopriest/react-idle-timer for info.
    const idleTimer = useIdleTimer({
        // timeout will be overridden
        timeout: 3000,
        onIdle: () => {
            // Return to initial step if not already there.
            if (machineState.step !== "initial") {
                socket.emit("ClientEvent", {
                    name: "Reset",
                    token: token,
                });
            } else {
                // Reset the idle timer if already on initial step.
                idleTimer.reset();
            }
        },
        debounce: 500,
        eventsThrottle: 500,
    });

    /**
     * Set up application with configuration and socket connections.
     */
    useEffect(() => {
        socket = socketIOClient(socketUri);
        // Signal that the client is ready.
        socket.emit("ClientReady", {
            token: token,
        });

        // Configuration recieved from backend.
        socket.on("Configuration", (data) => {
            setBoxConfig(data);
            idleTimer.timeout = data.inactivityTimeOut;
        });

        // Listen for changes to machine state.
        socket.on("UpdateState", (data) => {
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
     *   Data that defines the request to the state machine, e.g. "flow: "checkOutItems""
     */
    function handleAction(action, data) {
        idleTimer.reset();

        socket.emit("ClientEvent", {
            name: "Action",
            action: action,
            token: token,
            data: data,
        });
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
    socketUri: PropTypes.string.isRequired,
};

export default App;

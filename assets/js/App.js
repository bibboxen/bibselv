/**
 * @file
 * The main entrypoint of the react application.
 */

import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Initial from "./Steps/Initial";
import Login from "./Steps/Login";
import Status from "./Steps/Status";
import CheckInItems from "./Steps/CheckInItems";
import NavBar from "./steps/components/Navbar";
import MachineStateContext from "./context/machineStateContext";
import CheckOutItems from "./Steps/CheckOutItems";
import { useIdleTimer } from "react-idle-timer";
import PropTypes from "prop-types";
import Loading from "./steps/Loading";

/**
 * App. The main entrypoint of the react application.
 *
 * @param initialState
 *   The initial state of the app ("loading")
 *   is overridden in useEffect on updateState
 * @return {*}
 * @constructor
 */
function App({ token, socketUri, boxConfiguration, initialState }) {
    const [machineState, setMachineState] = useState(initialState);
    const [boxConfig, setBoxConfig] = useState(boxConfiguration);
    let socket = socketIOClient(socketUri);
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
        boxConfig: { get: boxConfig, set: setBoxConfig },
    };

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
        // Signal that the client is ready.
        socket.emit("ClientReady", {
            token: token,
        });

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
            case "login":
                return <Login actionHandler={handleAction} />;
            case "initial":
                return <Initial actionHandler={handleAction} />;
            default:
                return <Loading></Loading>;
        }
    }

    return (
        <>
            <MachineStateContext.Provider value={storage}>
                {machineState.step !== "loading" && (
                    <NavBar actionHandler={handleAction} />
                )}
                <div className="container">
                    <div className="row" style={{ width: "100%" }}>
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
    boxConfiguration: PropTypes.object.isRequired,
};

export default App;

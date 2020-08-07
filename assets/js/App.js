/**
 * @file
 * Main entry point of react application.
 */

import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Initial from "./steps/Initial";
import Login from "./steps/login";
import Status from "./steps/status";
import CheckInItems from "./steps/CheckInItems";
import NavBar from "./steps/components/navbar";
import MachineStateContext from "./context/machineStateContext";
import CheckOutItems from "./steps/CheckOutItems";

function App() {
    const socket = socketIOClient("http://bibbox-website.local.itkdev.dk:8010");
    useEffect(() => {
        // Ready
        socket.emit("ClientReady", {
            token: "123",
        });
        socket.on("UpdateState", (data) => {
            setMachineState(data);
        });
    }, []);

    function handleAction(action, data) {
        if (data.flow === "reset") {
            socket.emit("ClientEvent", {
                name: "Reset",
                token: "123",
            });
        } else {
            socket.emit("ClientEvent", {
                name: "Action",
                action: action,
                token: "123",
                data: data,
            });
        }
    }
    function renderStep({ step }) {
        switch (step.toLowerCase()) {
            case "checkoutitems":
                return <CheckOutItems actionHandler={handleAction} />;
            case "checkinitems":
                return <CheckInItems actionHandler={handleAction} />;
            case "status":
                return <Status actionHandler={handleAction} />;
            case "loginscan":
                return <Login actionHandler={handleAction} />;
            default:
                return <Initial actionHandler={handleAction} />;
        }
    }

    const [machineState, setMachineState] = useState({ step: "initial" });
    const [library, setLibrary] = useState("Tranbjerg bibliotek");
    const store = {
        machineState: { get: machineState, set: setMachineState },
        library: { get: library, set: setLibrary },
    };
    return (
        <>
            <MachineStateContext.Provider value={store}>
                <NavBar actionHandler={handleAction}></NavBar>
                <div className="container">
                    <div className="row" style={{ width: "100%" }}>
                        {renderStep(machineState)}
                    </div>
                </div>
            </MachineStateContext.Provider>
        </>
    );
}

export default App;

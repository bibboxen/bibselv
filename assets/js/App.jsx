import React, { useState } from "react";
import socketIOClient from "socket.io-client";
import Initial from "./steps/Initial";
import { Alert } from "react-bootstrap";
import Login from "./steps/login";
import Status from "./steps/status";
import Handin from "./steps/handin";
import ActionFaker from "./actionFaker";
import Borrow from "./steps/borrow";
import NavBar from "./steps/components/navbar";
import MachineStateContext from "./context/machineStateContext";

// @TODO: Rewrite as functional component.
function App() {
    // constructor(props) {
    //     super(props);

    //     const urlParams = new URLSearchParams(window.location.search);
    //     const token = urlParams.get("token");

    //     this.socket = null;

    //     this.state = {
    //         fake: true,
    //         token: token,
    //         machineState: {},
    //         // @TODO: Make configurable.
    //         endpoint: "http://bibbox-website.local.itkdev.dk:8010",
    //     };

    //     this.handleAction = this.handleAction.bind(this);
    //     this.handleReset = this.handleReset.bind(this);
    //     this.setMachineState = this.setMachineState.bind(this);
    //     this.getMachineState = this.getMachineState.bind(this);
    // }

    // setMachineState(data) {
    //     this.setState({ machineState: data }, () => {
    //         console.log("UpdateState", this.state.machineState);
    //     });
    // }

    // getMachineState() {
    //     return this.state.machineState;
    // }

    // componentDidMount() {
    //     const { endpoint } = this.state;
    //     const { fake } = this.state;

    //     if (!fake) {
    //         const socket = socketIOClient(endpoint, {
    //             transports: ["websocket", "polling"],
    //         });
    //         this.socket = socket;
    //         socket.on("UpdateState", (data) => {
    //             this.setMachineState(data);
    //         });
    //         // Ready
    //         socket.emit("ClientReady", {
    //             token: this.state.token,
    //         });
    //     } else {
    //         console.log("Running with fake content.");

    //         this.actionFaker = new ActionFaker(
    //             this.getMachineState,
    //             this.setMachineState
    //         );

    //         this.setState({
    //             machineState: {
    //                 step: "initial",
    //             },
    //         });
    //     }
    // }

    // function handleAction(action, data) {
    //     console.log("handleAction", action, data);

    //     const { fake } = this.state;

    //     if (!fake) {
    //         this.socket.emit("ClientEvent", {
    //             name: "Action",
    //             token: this.state.token,
    //             action: action,
    //             data: data,
    //         });
    //     } else {
    //         this.actionFaker.handleAction(action, data);
    //     }
    // }

    // handleReset() {
    //     console.log("handleReset");

    //     const { fake } = this.state;

    //     if (!fake) {
    //         this.socket.emit("ClientEvent", {
    //             name: "Reset",
    //             token: this.state.token,
    //         });
    //     } else {
    //         this.actionFaker.handleReset();
    //     }
    // }

    function renderStep(step, machineState) {
        if (step === "initial") {
            return <Initial />;
        }
        if (loggedIn) {
            switch (step) {
                case "chooseLogin":
                    return <div>@TODO: chooseLogin</div>;
                case "borrow":
                    return <Borrow />;
                case "handin":
                    return <Handin />;
                case "status":
                    return <Status />;
                default:
                    return (
                        <div
                            className={"app-default"}
                            style={{ textAlign: "center" }}
                        >
                            <Alert variant={"warning"}>Please wait...</Alert>
                        </div>
                    );
            }
        } else {
            return <Login></Login>;
        }
    }

    const [machineState, setMachineState] = useState();
    const [loggedIn, setLoggedIn] = useState(true);
    const [step, setStep] = useState("handin");
    const [username, setUsername] = useState("sine");
    const [loginConfig, setLoginConfig] = useState("type");
    const store = {
        machineState: { get: machineState, set: setMachineState },
        step: { get: step, set: setStep },
        loggedIn: { get: loggedIn, set: setLoggedIn },
        username: { get: username, set: setUsername },
        loginConfig: { get: loginConfig },
    };
    return (
        <>
            <MachineStateContext.Provider value={store}>
                <NavBar></NavBar>
                <div className="container">
                    {renderStep(step, machineState)}
                </div>
            </MachineStateContext.Provider>
        </>
    );
}

export default App;

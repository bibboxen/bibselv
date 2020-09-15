/**
 * @file
 *
 * Login.
 *
 */

import React, { useContext } from "react";
import PropTypes from "prop-types";
import MachineStateContext from "../context/machineStateContext";
import ScanLogin from "./loginComponents/ScanLogin";
import UniLogin from "./loginComponents/UniLogin";
import ScanPasswordLogin from "../steps/loginComponents/ScanPasswordLogin";

/**
 * Renders a login component based on configuration
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Login({ actionHandler }) {
    // The context of the machine
    const context = useContext(MachineStateContext);
    /**
     * Renders a login component based on configuration
     */
    function renderStep(loginConfig) {
        switch (loginConfig.toLowerCase()) {
            case "login_barcode":
                return (
                    <ScanLogin
                        actionHandler={actionHandler}
                    />
                );
            case "login_barcode_password":
                return (
                    <ScanPasswordLogin
                        actionHandler={actionHandler}
                    />
                );
            case "unilogin":
                return <UniLogin actionHandler={actionHandler} />;
            default:
                return <span>Loginmetode er ikke konfigureret</span>;
        }
    }

    return renderStep(context.boxConfig.get.loginMethod);
}

Login.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default Login;

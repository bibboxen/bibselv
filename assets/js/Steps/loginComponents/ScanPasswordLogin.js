/**
 * @file
 *
 * For users that scans username and types password to login.
 */

import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Input from "../components/Input";
import HelpBox from "../components/HelpBox";
import NumPad from "../components/NumPad";
import Button from "../components/Button";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import PropTypes from "prop-types";
import { faSignInAlt, faBarcode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BarcodeScanner from "../BarcodeScanner";
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_SCANNING_TIMEOUT,
} from "../../constants";
/**
 * ScanPasswordLogin.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 *
 * @return {*}
 * @constructor
 */
function ScanPasswordLogin({ actionHandler }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [subheader, setSubheader] = useState("Scan dit bibliotekskort");
    const [helpboxText, setHelpboxText] = useState(
        "Brug håndscanneren til at scanne stregkoden din lånerkort."
    );
    const [usernameScanned, setUsernameScanned] = useState(false);

    /**
     * Setup component.
     *
     * Starts barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    actionHandler("changeFlow", { flow: "reset" });
                } else {
                    setUsername(code);
                    setHelpboxText("Har du glemt din pinkode kan du kontakte en bibliotekar for at få lavet en ny")
                    setSubheader("Tast dit password");
                }
            }
        };

        barcodeScanner.start(barcodeCallback);

        // Stop scanning when component is unmounted.
        return () => barcodeScanner.stop();
    }, [actionHandler]);
    /**
     * Handles key presses for username and password.
     *
     * @param key
     */
    function onNumPadPress({ key }) {
        if (!usernameScanned) {
            key.toLowerCase() === "c"
                ? setUsername("")
                : setUsername(`${username}${key}`);
        } else {
            key.toLowerCase() === "c"
                ? setPassword("")
                : setPassword(`${password}${key}`);
        }
    }

    /**
     * Handles button press for going from username to password,
     * and for password to actual login.
     */
    function onButtonPress() {
        if (!usernameScanned) {
            setUsernameScanned(true);
        } else {
            actionHandler("login", {
                username: username,
                password: password,
            });
        }
    }

    return (
        <>
            <div className="col-md m-3">
                <Header
                    header="Login"
                    subheader={subheader}
                    which="login"
                    icon={faSignInAlt}
                />
                <div className="row">
                    <div className="col-md-2" />
                    <div className="col-md mt-4">
                        {!usernameScanned && (
                            <div
                                className="content"
                                onClick={() =>
                                    actionHandler("login", {
                                        username: "C023648674",
                                        password: "",
                                    })
                                }
                            >
                                <FontAwesomeIcon icon={faBarcode} />
                            </div>
                        )}
                        {usernameScanned && (
                            <Input
                                name="password"
                                label="Password"
                                value={password}
                                readOnly
                            />
                        )}
                        {usernameScanned && (
                            <NumPad handleNumpadPress={onNumPadPress} />
                        )}
                    </div>
                </div>
            </div>
            <div className="col-md-3 m-3 d-flex flex-column justify-content-between">
                {!usernameScanned && <HelpBox text={helpboxText} />}
                {usernameScanned && (
                    <Button
                        label={"Login"}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={onButtonPress}
                        which="login-button"
                    />
                )}
            </div>
        </>
    );
}

ScanPasswordLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default ScanPasswordLogin;

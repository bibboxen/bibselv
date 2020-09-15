/**
 * @file
 *
 * For users that log in with scanner.
 */

import React, { useEffect } from "react";
import BarcodeScanner from "../utils/BarcodeScanner";
import PropTypes from "prop-types";
import HelpBox from "../components/Helpbox";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt, faBarcode } from "@fortawesome/free-solid-svg-icons";
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_SCANNING_TIMEOUT,
} from "../../constants";
/**
 * Scan login component.
 *
 * Supplies a page for scanning login.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function ScanLogin({ actionHandler }) {
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
                }

                actionHandler("login", {
                    username: code,
                    password: "",
                });
            }
        };

        barcodeScanner.start(barcodeCallback);

        // Stop scanning when component is unmounted.
        return () => barcodeScanner.stop();
    }, [actionHandler]);

    return (
        <>
            <div className="col-md-9">
                <Header
                    header="Login"
                    subheader="Scan dit bibliotekskort"
                    which="login"
                    icon={faSignInAlt}
                />
                <div className="row">
                    <div className="col-md-2" />
                    <div className="col-md mt-4">
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
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={
                        "Brug håndscanneren til at scanne stregkoden din lånerkort."
                    }
                />
            </div>
        </>
    );
}

ScanLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default ScanLogin;

/**
 * @file
 *
 * The status component displays the status from the machinestate for the user.
 */

import React, { useContext, useEffect } from "react";
import BannerList from "./components/BannerList";
import Header from "./components/Header";
import MachineStateContext from "../context/machineStateContext";
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_CHECKOUT,
    BARCODE_COMMAND_CHECKIN,
} from "../constants";
import BarcodeScanner from "./BarcodeScanner";
import PropTypes from "prop-types";
import {
    adaptListOfBooksWithError,
    adaptListOfBooksWithSuccess,
    adaptListOfBooks,
} from "./utils/BannerAdapter";
import {
    faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Status.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Status({ actionHandler }) {
    const context = useContext(MachineStateContext);
    /**
     * Set up barcode listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    actionHandler("reset");
                }

                if (code === BARCODE_COMMAND_CHECKOUT) {
                    actionHandler("changeFlow", {
                        flow: "checkOutItems",
                    });
                }

                if (code === BARCODE_COMMAND_CHECKIN) {
                    actionHandler("changeFlow", {
                        flow: "checkInItems",
                    });
                }
            }
        };

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);

    let loanedItems = [
        ...adaptListOfBooksWithError(
            context.machineState.get.fineItems,
            "Denne bog har en bøde"
        ),
        ...adaptListOfBooksWithError(
            context.machineState.get.overdueItems,
            "Denne bog skal afleveres"
        ),
        ...adaptListOfBooksWithError(
            context.machineState.get.recallItems,
            "Denne bog skal afleveres"
        ),
        ...adaptListOfBooks(context.machineState.get.chargedItems),
    ];
    let holdItems = adaptListOfBooksWithSuccess(
        context.machineState.get.holdItems
    );
    let unavailableHoldItems = adaptListOfBooks(
        context.machineState.get.unavailableHoldItems
    );
    debugger;
    return (
        <div className="col-md">
            <div className="col-md-9" style={{ paddingLeft: "0" }}>
                <Header
                    header="Status"
                    subheader="Dine aktuelle lån og reservationer"
                    which="status"
                    icon={faInfoCircle}
                />
            </div>
            <div className="row">
                <div className="col-md-4 mt-4">
                    <BannerList title={"Aktuelle lån"} items={loanedItems} />
                </div>
                <div className="col-md-4 mt-4">
                    <BannerList
                        title={"Reservationer"}
                        items={unavailableHoldItems}
                    />
                </div>
                <div className="col-md-4 mt-4">
                    <BannerList
                        title={"Klar til afhentning"}
                        items={holdItems}
                    />
                </div>
            </div>
        </div>
    );
}

Status.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default Status;

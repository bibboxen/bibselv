/**
 * @file
 *
 * The component that is shown when the machinestate is checkOutItems.
 * This component creates af view of the books that the user checks out (borrows).
 */

import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { BarcodeScanner } from "./utils/BarcodeScanner";
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_STATUS,
    BARCODE_COMMAND_CHECKIN,
} from "../constants";
import MachineStateContext from "../context/machineStateContext";
import HelpBox from "./components/Helpbox";
import BannerList from "./components/BannerList";
import Header from "./components/Header";
import Input from "./components/Input";
import { adaptListOfBooksToBanner } from "./utils/BannerAdapter";
import { faBookReader } from "@fortawesome/free-solid-svg-icons";

/**
 * CheckOutItems component.
 *
 * Supplies a page for borrowing items from the library.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function CheckOutItems({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const [scannedBarcode, setScannedBarcode] = useState("");

    /**
     * Set up barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                switch (code) {
                    case BARCODE_COMMAND_FINISH:
                        actionHandler("reset");
                        break;
                    case BARCODE_COMMAND_STATUS:
                        actionHandler("changeFlow", {
                            flow: "status",
                        });
                        break;
                    case BARCODE_COMMAND_CHECKIN:
                        actionHandler("changeFlow", {
                            flow: "checkInItems",
                        });
                        break;
                    default:
                        actionHandler("checkOutItem", {
                            itemIdentifier: code,
                        });
                }
            }
            setScannedBarcode(code);
        };

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);

    let items = [];
    if (context.machineState.get.items) {
        items = adaptListOfBooksToBanner(context.machineState.get.items);
    }

    return (
        <>
            <div className="col-md-9">
                <Header
                    header="Lån"
                    subheader="Scan stregkoden på bogen du vil låne"
                    which="checkOutItems"
                    icon={faBookReader}
                />
                <div className="row">
                    <div className="col-md-2" />

                    <div className="col-md mt-4">
                        <Input
                            name="barcode"
                            label="Stregkode"
                            value={scannedBarcode}
                            which="CheckOutItems"
                            readOnly
                        />
                        {items && <BannerList items={items} />}
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={
                        "Brug håndscanneren til at scanne stregkoden på bogen."
                    }
                />
            </div>
        </>
    );
}

CheckOutItems.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default CheckOutItems;

import React, { useContext, useState, useEffect } from "react";
import BarcodeScanner from "./BarcodeScanner";
import PropTypes from "prop-types";
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
} from "../constants";
import MachineStateContext from "../context/machineStateContext";
import HelpBox from "./components/helpBox";
import BannerList from "./components/bannerList";
import Header from "./components/header";
import Input from "./components/input";

/**
 * Borrow component.
 *
 * Supplies a page for borrowing materials.
 *
 * @param props
 * @return {*}
 * @constructor
 */
function Borrow({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const [loanedBooksForBanner, setLoanedBooksForBanner] = useState([]);
    const [scannedBarcode, setScannedBarcode] = useState("");
    const [infoString, setInfoString] = useState("");

    useEffect(() => {
        setLoanedBooksForBanner(context.justLoanedBooks.get);
        setInfoString(
            scannedBarcode ? "Bogen blev registreret. Klar til næste" : ""
        );
    });

    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    // handleReset();
                }
                return;
            }
            setScannedBarcode(code);
            actionHandler("borrowMaterial", {
                itemIdentifier: code,
            });
        };

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);
    return (
        <>
            <div className="col-md-9">
                <Header
                    header="Lån"
                    text="Scan stregkoden på bogen du vil låne"
                ></Header>
                <div className="row">
                    <div className="col-md-2"></div>

                    <div className="col-md mt-4">
                        <Input
                            name="barcode"
                            label="Stregkode"
                            value={scannedBarcode}
                            info={infoString}
                            readOnly
                        ></Input>
                        {context.machineState.get.materials && (
                            <BannerList
                                items={context.machineState.get.materials}
                            ></BannerList>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={
                        "Brug håndscanneren til at scanne stregkoden på bogen."
                    }
                ></HelpBox>
            </div>
        </>
    );
}

Borrow.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default Borrow;

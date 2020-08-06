import React, { useContext, useState, useEffect } from 'react';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_STATUS,
    BARCODE_COMMAND_CHECKIN
} from '../constants';
import MachineStateContext from '../context/machineStateContext';
import HelpBox from './components/helpBox';
import BannerList from './components/bannerList';
import Header from './components/header';
import Input from './components/input';

/**
 * CheckOutItems component.
 *
 * Supplies a page for borrowing items.
 *
 * @param props
 * @return {*}
 * @constructor
 */
function CheckOutItems({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [infoString, setInfoString] = useState('');

    useEffect(() => {
        setInfoString(
            scannedBarcode ? 'Bogen blev registreret. Klar til næste' : ''
        );
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    actionHandler("changeFlow", { flow: "reset" });
                }
                if (code === BARCODE_COMMAND_STATUS) {
                    actionHandler("changeFlow", {
                        flow: "status",
                    });
                }
                
                if (code === BARCODE_COMMAND_CHECKIN) {
                    actionHandler("changeFlow", {
                        flow: "checkInItems",
                    });
                }
                return;
            }
            setScannedBarcode(code);
            actionHandler('checkOutItem', {
                itemIdentifier: code
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
                        {context.machineState.get.items && (
                            <BannerList
                                items={context.machineState.get.items}
                            ></BannerList>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={
                        'Brug håndscanneren til at scanne stregkoden på bogen.'
                    }
                ></HelpBox>
            </div>
        </>
    );
}

CheckOutItems.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default CheckOutItems;

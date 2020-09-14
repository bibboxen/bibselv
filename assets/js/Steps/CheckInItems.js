/**
 * @file
 *
 * @TODO: Describe what it is used for.
 */

import React, { useContext, useState, useEffect } from 'react';
import BarcodeScanner from './BarcodeScanner';
import PropTypes from 'prop-types';
import MachineStateContext from '../context/machineStateContext';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_CHECKOUT,
    BARCODE_COMMAND_STATUS
} from '../constants';
import HelpBox from './components/helpBox';
import BannerList from './components/bannerList';
import Header from './components/header';
import Input from './components/input';

/**
 * CheckInItems component.
 *
 * Supplies a page for returning materials.
 *
 * @return {*}
 * @constructor
 */
function CheckInItems({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [infoString, setInfoString] = useState('');

    /**
     * Set up barcode scanner listener.
     */
    useEffect(() => {
        // @TODO: Why this call?
        setInfoString(
            scannedBarcode ? 'Bogen blev registreret. Klar til næste' : ''
        );

        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    actionHandler('changeFlow', { flow: 'reset' });
                }
                const whichFlow = context.machineState.get.user
                    ? 'changeFlow'
                    : 'enterFlow';
                if (code === BARCODE_COMMAND_STATUS) {
                    actionHandler(whichFlow, {
                        flow: 'status'
                    });
                }

                if (code === BARCODE_COMMAND_CHECKOUT) {
                    actionHandler(whichFlow, {
                        flow: 'checkOutItems'
                    });
                }
                return;
            }
            setScannedBarcode(code);
            actionHandler('checkInItem', {
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
                <Header header="Aflever" text="Scan stregkoden på bogen du vil aflevere"/>
                <div className="row">
                    <div className="col-md-2"/>

                    <div className="col-md mt-4">
                        <Input
                            name="barcode"
                            label="Stregkode"
                            value={scannedBarcode}
                            info={infoString}
                            readOnly
                        />
                        {context.machineState.get.items && (
                            <BannerList items={context.machineState.get.items}/>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-md-3">
                <HelpBox
                    text={
                        'Brug håndscanneren til at scanne stregkoden på bogen. Eller tast bogens ISBN nummer.'
                    }
                />
            </div>
        </>
    );
}

CheckInItems.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default CheckInItems;

import React, { useEffect, useContext } from 'react';
import BarcodeScanner from '../BarcodeScanner';
import PropTypes from 'prop-types';
import HelpBox from '../components/helpBox';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_SCANNING_TIMEOUT
} from '../../constants';
import MachineStateContext from '../../context/machineStateContext';

/**
 * Scan login component.
 *
 * Supplies a page for scanning login.
 *
 * @param props
 * @return {*}
 * @constructor
 */
function ScanLogin({ actionHandler }) {
    const context = useContext(MachineStateContext);
    // Setup component.
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = (code) => {
            if (code === BARCODE_COMMAND_FINISH) {
            }
            if (!context.machineState.get.user) {
                actionHandler('login', {
                    username: code,
                    password: ''
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
                <Header header="Login" text="Scan låner stregkode"></Header>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md mt-4">
                        <div className="content" onClick={() => actionHandler('login', { username: 'C023648674', password: '' })}>
                            <FontAwesomeIcon icon={faBarcode} />
                        </div>
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

ScanLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanLogin;

/**
 * @file
 * For users that log in with scanner.
 */

import React, { useEffect, useContext } from 'react';
import BarcodeScanner from '../utils/barcode-scanner';
import PropTypes from 'prop-types';
import HelpBox from '../components/help-box';
import Button from '../components/button';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faBarcode, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_LENGTH
} from '../../constants';
import MachineStateContext from '../../context/machine-state-context';
import {
    ScanLoginHelpboxText,
    ScanLoginHeader,
    ScanLoginSubheader
} from '../utils/formattedMessages';
/**
 * Scan login component.
 *
 * Supplies a page for scanning login.
 *
 * @param actionHandler
 *  As the state can only be changed by the state machine, the actionHandler
 *  calls the state machine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function ScanLogin({ actionHandler }) {
    const context = useContext(MachineStateContext);

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
                    actionHandler('reset');
                }
            }
            actionHandler('login', {
                username: code,
                password: ''
            });
        };

        barcodeScanner.start(barcodeCallback);

        // Stop scanning when component is unmounted.
        return () => barcodeScanner.stop();
    }, [actionHandler]);

    return (
        <>
            <Header
                header={ScanLoginHeader}
                subheader={ScanLoginSubheader}
                which='login'
                icon={faSignInAlt}
            />
            <div className='col-md-3'>
                <HelpBox text={ScanLoginHelpboxText} />
            </div>
            <div className="col-md-1" />
            <div className='col-md-6'>
                <div className='content'>
                    <FontAwesomeIcon icon={faBarcode} />
                </div>
            </div>
            {context.boxConfig.get.debugEnabled && (
                <div className='col-md'>
                    <Button
                        label={'Snydelogin'}
                        icon={faArrowAltCircleRight}
                        handleButtonPress={() =>
                            actionHandler('login', {
                                username: 'C023648674',
                                password: ''
                            })}
                    />
                </div>
            )}
        </>
    );
}

ScanLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanLogin;

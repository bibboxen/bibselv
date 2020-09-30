/**
 * @file
 * For users that log in with scanner.
 */

import React, { useEffect } from 'react';
import BarcodeScanner from '../utils/barcode-scanner';
import PropTypes from 'prop-types';
import HelpBox from '../components/help-box';
import Header from '../components/header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faBarcode } from '@fortawesome/free-solid-svg-icons';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_LENGTH
} from '../../constants';
import { FormattedMessage } from 'react-intl';

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
    const helpBoxText = <FormattedMessage id='scan-login-help-box-text' defaultMessage='Use the hand scanner to scan the barcode of your library card.' />;

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
            <div className='col-md-9'>
                <Header
                    header='Login'
                    subheader='Scan dit bibliotekskort'
                    which='login'
                    icon={faSignInAlt}
                />
                <div className='row'>
                    <div className='col-md-2' />
                    <div className='col-md mt-4'>
                        <div
                            className='content'
                            onClick={() =>
                                actionHandler('login', {
                                    username: 'C023648674',
                                    password: ''
                                })
                            }
                        >
                            <FontAwesomeIcon icon={faBarcode} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-3'>
                <HelpBox text={helpBoxText}/>
            </div>
        </>
    );
}

ScanLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanLogin;

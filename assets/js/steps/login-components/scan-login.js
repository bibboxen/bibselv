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
    ScanLoginHelpboxText,
    ScanLoginHeader,
    ScanLoginSubheader
} from '../utils/formattedMessages';
import BarcodeHandler from '../utils/barcode-handler';
import { ACTION_RESET } from '../../constants';

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
    /**
     * Setup barcode scanner.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner();
        const barcodeCallback = (new BarcodeHandler([
            ACTION_RESET
        ], actionHandler, function(result) {
            actionHandler('login', {
                username: result.outputCode
            });
        })).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => { barcodeScanner.stop(); };
    }, [actionHandler]);

    return (
        <>
            <div className='col-md-9'>
                <Header
                    header={ScanLoginHeader}
                    subheader={ScanLoginSubheader}
                    which='login'
                    icon={faSignInAlt}
                />
                <div className='row'>
                    <div className='col-md-2' />
                    <div className='col-md mt-4'>
                        <div
                            className='content'
                            onClick={() =>
                                // TODO REMOVE
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
                <HelpBox text={ScanLoginHelpboxText}/>
            </div>
        </>
    );
}

ScanLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default ScanLogin;

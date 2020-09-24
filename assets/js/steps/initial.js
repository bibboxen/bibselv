/**
 * @file
 * The initial page the user meets, from here they can go to other pages.
 */

import React, { useEffect } from 'react';
import BarcodeScanner from './utils/barcode-scanner';
import PropTypes from 'prop-types';
import Bubble from './components/bubble';
import Barcode from './components/barcode';
import {
    BARCODE_COMMAND_CHECKIN,
    BARCODE_COMMAND_CHECKOUT,
    BARCODE_COMMAND_LENGTH,
    BARCODE_COMMAND_STATUS,
    BARCODE_SCANNING_TIMEOUT
} from '../constants';
import {
    faBookReader,
    faInfoCircle,
    faBook
} from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';

/**
 * Initial component.
 *
 * Supplies a front page.
 *
 * @return {*}
 * @constructor
 */
function Initial({ actionHandler }) {
    const bubbleCheckOut = <FormattedMessage id='initial-button-check-out' defaultMessage='Lån' />;
    const bubbleStatus = <FormattedMessage id='initial-button-status' defaultMessage='Status' />;
    const bubbleCheckIn = <FormattedMessage id='initial-button-check-in' defaultMessage='Aflever' />;

    const components = [
        {
            which: 'checkOutItems',
            label: bubbleCheckOut,
            icon: faBookReader
        },
        {
            which: 'status',
            label: bubbleStatus,
            icon: faInfoCircle
        },
        {
            which: 'checkInItems',
            label: bubbleCheckIn,
            icon: faBook
        }
    ];

    // Setup component.
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (code) => {
            // Commands are 5 characters long.
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_CHECKOUT) {
                    actionHandler('enterFlow', {
                        flow: 'checkOutItems'
                    });
                }

                if (code === BARCODE_COMMAND_CHECKIN) {
                    actionHandler('enterFlow', {
                        flow: 'checkInItems'
                    });
                }

                if (code === BARCODE_COMMAND_STATUS) {
                    actionHandler('enterFlow', {
                        flow: 'status'
                    });
                }
            } else {
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
        <div className='col-md-12'>
            <h1 className='mb-5'>
                <FormattedMessage id='initial-choose-a-function' defaultMessage='Vælg en funktion for at starte' />
            </h1>
            <div className='row justify-content-center'>
                {components.map((component) => (
                    <div key={component.which} className='col-md-3'>
                        <Bubble
                            which={component.which}
                            label={component.label}
                            icon={component.icon}
                            actionHandler={actionHandler}
                        />
                    </div>
                ))}
            </div>
            <div className='row justify-content-center mt-5'>
                {components.map((component) => (
                    <div className='col-md-3' key={component.which}>
                        <Barcode
                            key={component.color}
                            which={component.which}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

Initial.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Initial;

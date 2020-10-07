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
    BARCODE_COMMAND_STATUS,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_TYPE_COMMAND
} from '../constants';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {
    InitialButtonCheckOut,
    InitialButtonStatus,
    InitialButtonCheckIn,
    InitialHeader
} from './utils/formattedMessages';
import CheckInIconPurple from '../../scss/images/check-in-purple.svg';
import CheckOutYellow from '../../scss/images/check-out-yellow.svg';

/**
 * Initial component.
 *
 * Supplies a front page.
 *
 * @return {*}
 * @constructor
 */
function Initial({ actionHandler }) {
    const components = [
        {
            type: 'checkOutItems',
            label: InitialButtonCheckOut,
            img: CheckOutYellow
        },
        {
            type: 'status',
            label: InitialButtonStatus,
            icon: faInfoCircle
        },
        {
            type: 'checkInItems',
            label: InitialButtonCheckIn,
            img: CheckInIconPurple
        }
    ];

    // Setup component.
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (result) => {
            if (result.type === BARCODE_TYPE_COMMAND) {
                switch (result.outputCode) {
                    case BARCODE_COMMAND_CHECKOUT:
                        actionHandler('enterFlow', {
                            flow: 'checkOutItems'
                        });
                        break;
                    case BARCODE_COMMAND_CHECKIN:
                        actionHandler('enterFlow', {
                            flow: 'checkInItems'
                        });
                        break;
                    case BARCODE_COMMAND_STATUS:
                        actionHandler('enterFlow', {
                            flow: 'status'
                        });
                        break;
                }
            }
        };

        barcodeScanner.start(barcodeCallback);

        // Stop scanning when component is unmounted.
        return () => barcodeScanner.stop();
    }, [actionHandler]);

    return (
        <div className='col-md-12'>
            <h1 className='mb-5'>
                {InitialHeader}
            </h1>
            <div className='row justify-content-center'>
                {components.map((component) => (
                    <div key={component.type} className='col-md-3'>
                        <Bubble
                            type={component.type}
                            label={component.label}
                            icon={component.icon}
                            img={component.img}
                            actionHandler={actionHandler}
                        />
                    </div>
                ))}
            </div>
            <div className='row justify-content-center mt-5'>
                {components.map((component) => (
                    <div key={component.type} className='col-md-3'>
                        <Barcode
                            key={component.color}
                            type={component.type}
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

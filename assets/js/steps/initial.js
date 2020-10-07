/**
 * @file
 * The initial page the user meets, from here they can go to other pages.
 */

import React, { useEffect } from 'react';
import BarcodeScanner from './utils/barcode-scanner';
import PropTypes from 'prop-types';
import Bubble from './components/bubble';
import Barcode from './components/barcode';
import { ACTION_ENTER_FLOW_CHECKIN, ACTION_ENTER_FLOW_CHECKOUT, ACTION_ENTER_FLOW_STATUS } from '../constants';
import {
    faBookReader,
    faInfoCircle,
    faBook
} from '@fortawesome/free-solid-svg-icons';
import {
    InitialButtonCheckOut,
    InitialButtonStatus,
    InitialButtonCheckIn,
    InitialHeader
} from './utils/formattedMessages';
import BarcodeHandler from './utils/barcode-handler';

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
            which: 'checkOutItems',
            label: InitialButtonCheckOut,
            icon: faBookReader
        },
        {
            which: 'status',
            label: InitialButtonStatus,
            icon: faInfoCircle
        },
        {
            which: 'checkInItems',
            label: InitialButtonCheckIn,
            icon: faBook
        }
    ];

    // Setup barcode scanner.
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner();
        const barcodeCallback = (new BarcodeHandler([
            ACTION_ENTER_FLOW_CHECKIN, ACTION_ENTER_FLOW_CHECKOUT, ACTION_ENTER_FLOW_STATUS
        ], actionHandler)).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => { barcodeScanner.stop(); };
    }, [actionHandler]);

    return (
        <div className='col-md-12'>
            <h1 className='mb-5'>
                {InitialHeader}
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

/**
 * @file
 * The status component displays the status from the machinestate for the user.
 */

import React, { useContext, useEffect } from 'react';
import BannerList from './components/banner-list';
import Header from './components/header';
import MachineStateContext from '../context/machine-state-context';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_CHECKOUT,
    BARCODE_COMMAND_CHECKIN
} from '../constants';
import BarcodeScanner from './utils/barcode-scanner';
import PropTypes from 'prop-types';
import {
    adaptListOfBooksWithMessage,
    adaptListOfBooksWithSuccess,
    adaptListOfBooks
} from './utils/banner-adapter';
import {
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import {
    StatusHeader,
    StatusSubheader,
    StatusHeaderCurrentLoans,
    StatusHeaderReservations,
    StatusHeaderReadyForPickup,
    StatusBannerHeaderFinedBook,
    StatusBannerHeaderOverdueBook
} from './utils/formattedMessages';


/**
 * Status.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Status({ actionHandler }) {
    const context = useContext(MachineStateContext);
    
    /**
     * Set up barcode listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                if (code === BARCODE_COMMAND_FINISH) {
                    actionHandler('reset');
                }

                if (code === BARCODE_COMMAND_CHECKOUT) {
                    actionHandler('changeFlow', {
                        flow: 'checkOutItems'
                    });
                }

                if (code === BARCODE_COMMAND_CHECKIN) {
                    actionHandler('changeFlow', {
                        flow: 'checkInItems'
                    });
                }
            }
        };

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);
    const loanedItems = [
        ...adaptListOfBooksWithMessage(
            context.machineState.get.fineItems,
            StatusBannerHeaderFinedBook
        ),
        ...adaptListOfBooksWithMessage(
            context.machineState.get.overdueItems,
            StatusBannerHeaderOverdueBook
        ),
        ...adaptListOfBooksWithMessage(
            context.machineState.get.recallItems,
            StatusBannerHeaderOverdueBook
        ),
        ...adaptListOfBooks(context.machineState.get.chargedItems)
    ];

    const holdItems = adaptListOfBooksWithSuccess(
        context.machineState.get.holdItems
    );

    const unavailableHoldItems = adaptListOfBooks(
        context.machineState.get.unavailableHoldItems
    );

    return (
        <div className='col-md'>
            <div className='col-md-9' style={{ paddingLeft: '0' }}>
                <Header
                    header={StatusHeader}
                    subheader={StatusSubheader}
                    which='status'
                    icon={faInfoCircle}
                />
            </div>
            <div className='row'>
                <div className='col-md-4 mt-4'>
                    <BannerList title={StatusHeaderCurrentLoans} items={loanedItems} visibleOnPrint={true} />
                </div>
                <div className='col-md-4 mt-4'>
                    <BannerList
                        title={StatusHeaderReservations}
                        items={unavailableHoldItems}
                        visibleOnPrint={true}
                    />
                </div>
                <div className='col-md-4 mt-4'>
                    <BannerList
                        title={StatusHeaderReadyForPickup}
                        items={holdItems}
                        visibleOnPrint={true}
                    />
                </div>
            </div>
        </div>
    );
}

Status.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Status;

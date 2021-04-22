/**
 * @file
 * The status component displays the status from the machinestate for the user.
 */

import React, { useContext, useEffect } from 'react';
import BannerList from './components/banner-list';
import Header from './components/header';
import MachineStateContext from './utils/machine-state-context';
import BarcodeScanner from './utils/barcode-scanner';
import PropTypes from 'prop-types';
import {
    adaptListOfBooksWithSuccess,
    adaptListOfBooks,
    adaptListOfBooksWitErrorAndTitle
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
    StatusBannerHeaderOverdueBook,
    StatusHeaderPrint,
    StatusUnavailable
} from './utils/formatted-messages';
import BarcodeHandler from './utils/barcode-handler';
import {
    ACTION_CHANGE_FLOW_CHECKIN,
    ACTION_CHANGE_FLOW_CHECKOUT,
    ACTION_PRINT,
    ACTION_RESET,
    CONNECTION_OFFLINE,
    CONNECTION_ONLINE
} from '../constants';
import Alert from './utils/alert';
import Banner from "./components/banner";
import BookBanner from "./components/book-banner";
import BookStatus from "./utils/book-status";
import OverdueBooksBanner from "./components/overdue-books-banner";

/**
 * Status.
 *
 * @param actionHandler
 *   As the state can only be changed by the state machine, the actionHandler
 *   calls the state machine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Status({ actionHandler }) {
    const context = useContext(MachineStateContext);

    /**
     * Set up barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner();
        const barcodeCallback = (new BarcodeHandler([
            ACTION_CHANGE_FLOW_CHECKIN, ACTION_CHANGE_FLOW_CHECKOUT, ACTION_RESET, ACTION_PRINT
        ], actionHandler)).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);


    const holdItems = [
        ...context.machineState.get.holdItems,
        {
            id: '12312312',
            author: 'Author Larsen',
            title: 'En fed bog'
        }
    ];
    const unavailableHoldItems = [
        ...context.machineState.get.unavailableHoldItems,
        {
            id: '12312312',
            author: 'Author Larsen',
            title: 'En fed bog'
        }
    ];
    const overdueItems = [
        ...context.machineState.get.overdueItems,
    ];
    let loanedItems = [
        ...context.machineState.get.chargedItems,
        {
            id: '12312312',
            title: 'En fed bog'
        }
    ];

    // Filter out loaned items that are not in overdueItems.
    loanedItems = loanedItems.filter(function (obj) {
        return !overdueItems.some(function(obj2) {
            return obj.id === obj2.id;
        });
    });

    const currentLoansContent = (<>
        {overdueItems && (
            <OverdueBooksBanner items={overdueItems} />
        )}
        {loanedItems && loanedItems.map((item) => (
            <BookBanner item={item} key={'loanedItem' + item.id || item.itemIdentifier} />
        ))}
    </>);

    const reservationsContent = (
        <>
            {unavailableHoldItems && unavailableHoldItems.map((item) => (
                <BookBanner item={item} key={'unavailableHoldItem' + item.id || item.itemIdentifier} />
            ))}
        </>
    );

    const readyForPickupContent = (
        <>
            {holdItems && holdItems.map((item) => {
                item.status = BookStatus.SUCCESS;
                return <BookBanner item={item} key={'holdItem' + item.id || item.itemIdentifier} visibleOnPrint={true}/>
            })}
        </>
    );

    return (
        <>
            <Header
                header={StatusHeader}
                subheader={StatusSubheader}
                type='status'
                icon={faInfoCircle}
            />
            {context.connectionState.get === CONNECTION_OFFLINE &&
            <div className='status-container'>
                <Alert message={StatusUnavailable} />
            </div>
            }
            {context.connectionState.get === CONNECTION_ONLINE &&
            <div className='status-container'>
                <h1>{StatusHeaderPrint}</h1>
                <div className='col-md-4 mt-4'>
                    <BannerList
                        title={StatusHeaderCurrentLoans}
                        numberOfItems={loanedItems.length + overdueItems.length}
                        content={currentLoansContent}
                        visibleOnPrint={true}
                    />
                </div>
                <div className='col-md-4 mt-4'>
                    <BannerList
                        title={StatusHeaderReservations}
                        numberOfItems={unavailableHoldItems.length}
                        content={reservationsContent}
                        visibleOnPrint={true}
                    />
                </div>
                <div className='col-md-4 mt-4'>
                    <BannerList
                        title={StatusHeaderReadyForPickup}
                        numberOfItems={holdItems.length}
                        content={readyForPickupContent}
                        visibleOnPrint={true}
                    />
                </div>
            </div>
            }
        </>
    );
}

Status.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Status;

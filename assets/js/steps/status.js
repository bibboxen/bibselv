/**
 * @file
 * The status component displays the status from the machinestate for the user.
 */

import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { faInfoCircle, faPrint } from "@fortawesome/free-solid-svg-icons";
import BannerList from "./components/banner-list";
import Header from "./components/header";
import MachineStateContext from "./utils/machine-state-context";
import BarcodeScanner from "./utils/barcode-scanner";
import {
    StatusHeader,
    StatusSubheader,
    StatusHeaderCurrentLoans,
    StatusHeaderReservations,
    StatusHeaderReadyForPickup,
    StatusHeaderPrint,
    StatusButtonPrint,
    StatusUnavailable,
} from "./utils/formatted-messages";
import BarcodeHandler from "./utils/barcode-handler";
import {
    ACTION_CHANGE_FLOW_CHECKIN,
    ACTION_CHANGE_FLOW_CHECKOUT,
    ACTION_PRINT,
    ACTION_RESET,
    BARCODE_SCANNING_TIMEOUT,
    CONNECTION_OFFLINE,
    CONNECTION_ONLINE,
} from "../constants";
import Alert from "./utils/alert";
import BookBanner from "./components/book-banner";
import BookStatus from "./utils/book-status";
import OverdueBooksBanner from "./components/overdue-books-banner";
import Button from "./components/button";
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
        const barcodeScanner = new BarcodeScanner(
            context.boxConfig.get.barcodeTimeout || BARCODE_SCANNING_TIMEOUT
        );
        const barcodeCallback = new BarcodeHandler(
            [
                ACTION_CHANGE_FLOW_CHECKIN,
                ACTION_CHANGE_FLOW_CHECKOUT,
                ACTION_RESET,
                ACTION_PRINT,
            ],
            actionHandler
        ).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);

    /**
   * Prints the page, available in status component.
   */
    function printPage() {
        window.print();
    }

    const holdItems = [...context.machineState.get.holdItems];
    const unavailableHoldItems = [
        ...context.machineState.get.unavailableHoldItems,
    ];
    const overdueItems = [...context.machineState.get.overdueItems];
    let loanedItems = [...context.machineState.get.chargedItems];

    // Filter out loaned items that are not in overdueItems.
    loanedItems = loanedItems.filter(function(obj) {
        return !overdueItems.some(function(obj2) {
            return obj.id === obj2.id;
        });
    });

    const currentLoansContent = (
        <>
            {overdueItems && overdueItems.length > 0 && (
                <OverdueBooksBanner items={overdueItems} />
            )}
            {loanedItems &&
        loanedItems.map((item) => (
            <BookBanner
                item={item}
                key={`loanedItem${item.id}` || item.itemIdentifier}
            />
        ))}
        </>
    );

    const reservationsContent = (
        <>
            {unavailableHoldItems &&
        unavailableHoldItems.map((item) => (
            <BookBanner
                item={item}
                key={`unavailableHoldItem${item.id}` || item.itemIdentifier}
            />
        ))}
        </>
    );

    const readyForPickupContent = (
        <>
            {holdItems &&
        holdItems.map((item) => {
            item.status = BookStatus.SUCCESS;
            return (
                <BookBanner
                    item={item}
                    key={`holdItem${item.id}` || item.itemIdentifier}
                    visibleOnPrint
                />
            );
        })}
        </>
    );

    return (
        <>
            <Header
                header={StatusHeader}
                subheader={StatusSubheader}
                type="status"
                icon={faInfoCircle}
            />
            <div className="col-md-2">
                {context.boxConfig.get.hasPrinter && (
                    <Button
                        label={StatusButtonPrint}
                        icon={faPrint}
                        onClick={printPage}
                        className="button print"
                    />
                )}
            </div>
            {context.connectionState.get === CONNECTION_OFFLINE && (
                <div className="status-container">
                    <Alert message={StatusUnavailable} />
                </div>
            )}
            {context.connectionState.get === CONNECTION_ONLINE && (
                <div className="status-container">
                    <h1>{StatusHeaderPrint}</h1>
                    <div className="col-md-4 mt-4">
                        <BannerList
                            title={StatusHeaderCurrentLoans}
                            numberOfItems={loanedItems.length + overdueItems.length}
                            content={currentLoansContent}
                            visibleOnPrint
                        />
                    </div>
                    <div className="col-md-4 mt-4">
                        <BannerList
                            title={StatusHeaderReservations}
                            numberOfItems={unavailableHoldItems.length}
                            content={reservationsContent}
                            visibleOnPrint
                        />
                    </div>
                    <div className="col-md-4 mt-4">
                        <BannerList
                            title={StatusHeaderReadyForPickup}
                            numberOfItems={holdItems.length}
                            content={readyForPickupContent}
                            visibleOnPrint
                        />
                    </div>
                </div>
            )}
        </>
    );
}

Status.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default Status;

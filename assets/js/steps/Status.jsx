/**
 * @file
 * The status component displays the status from the machinestate for the user.
 */

import React, { useContext, useEffect, useState } from "react";
import BannerList from "./components/BannerList";
import Header from "./components/Header";
import MachineStateContext from "./utils/MachineStateContext";
import BarcodeScanner from "./utils/barcode-scanner";
import PropTypes from "prop-types";
import { faInfoCircle, faPrint } from "@fortawesome/free-solid-svg-icons";
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
import Alert from "./utils/Alert";
import BookBanner from "./components/BookBanner";
import BookStatus from "./utils/book-status";
import OverdueBooksBanner from "./components/OverdueBooksBanner";
import Button from "./components/Button";
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
  const [loanedItems, setLoanedItems] = useState([]);
  const {
    connectionState,
    boxConfig: { barcodeTimeout, hasPrinter },
    machineState: {
      holdItems,
      unavailableHoldItems,
      overdueItems,
      chargedItems,
    },
  } = useContext(MachineStateContext);

  /**
   * Set up barcode scanner listener.
   */
  useEffect(() => {
    const barcodeScanner = new BarcodeScanner(
      barcodeTimeout || BARCODE_SCANNING_TIMEOUT
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
  }, [actionHandler, barcodeTimeout]);

  /**
   * Prints the page, available in status component.
   */
  function printPage() {
    window.print();
  }

  useEffect(() => {
    // Filter out loaned items that are not in overdueItems.
    setLoanedItems(
      chargedItems.filter(function ({ id: obj1Id }) {
        return !overdueItems.some(function ({ id: obj2Id }) {
          return obj1Id === obj2Id;
        });
      })
    );
  }, [chargedItems, overdueItems]);

  return (
    <>
      <Header
        header={StatusHeader}
        subheader={StatusSubheader}
        type="status"
        icon={faInfoCircle}
      />
      <div className="col-md-2">
        {hasPrinter && (
          <Button
            label={StatusButtonPrint}
            icon={faPrint}
            onClick={printPage}
            className="button print"
          />
        )}
      </div>
      {connectionState === CONNECTION_OFFLINE && (
        <div className="status-container">
          <Alert message={StatusUnavailable} />
        </div>
      )}
      {connectionState === CONNECTION_ONLINE && (
        <div className="status-container">
          <h1>{StatusHeaderPrint}</h1>
          <div className="col-md-4 mt-4">
            <BannerList
              title={StatusHeaderCurrentLoans}
              numberOfItems={loanedItems.length + overdueItems.length}
              visibleOnPrint={true}
            >
              <>
                {overdueItems && overdueItems.length > 0 && (
                  <OverdueBooksBanner items={overdueItems} />
                )}
                {loanedItems &&
                  loanedItems.map((item) => (
                    <BookBanner
                      item={item}
                      key={"loanedItem" + item.id || item.itemIdentifier}
                    />
                  ))}
              </>
            </BannerList>
          </div>
          <div className="col-md-4 mt-4">
            <BannerList
              title={StatusHeaderReservations}
              numberOfItems={unavailableHoldItems.length}
              visibleOnPrint={true}
            >
              <>
                {unavailableHoldItems &&
                  unavailableHoldItems.map((item) => (
                    <BookBanner
                      item={item}
                      key={
                        "unavailableHoldItem" + item.id || item.itemIdentifier
                      }
                    />
                  ))}
              </>
            </BannerList>
          </div>
          <div className="col-md-4 mt-4">
            <BannerList
              title={StatusHeaderReadyForPickup}
              numberOfItems={holdItems.length}
              visibleOnPrint={true}
            >
              <>
                {holdItems &&
                  holdItems.map((item) => {
                    item.status = BookStatus.SUCCESS;
                    return (
                      <BookBanner
                        item={item}
                        key={"holdItem" + item.id || item.itemIdentifier}
                        visibleOnPrint={true}
                      />
                    );
                  })}
              </>
            </BannerList>
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

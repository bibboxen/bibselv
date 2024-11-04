/**
 * @file
 * The component that is shown when the machinestate is checkInItems.
 * This component creates af view of the books that the user hands in (returns).
 */

import React, { useContext, useState, useEffect, useCallback } from "react";
import BarcodeScanner from "./utils/barcode-scanner";
import PropTypes from "prop-types";
import HelpBox from "./components/HelpBox";
import BannerList from "./components/BannerList";
import Header from "./components/Header";
import { adaptListOfBooksToBanner } from "./utils/BannerAdapter";
import NumPad from "./utils/NumPad";
import Print from "./utils/Print";
import Sound from "./utils/sound";
import BookStatus from "./utils/book-status";
import MachineStateContext from "./utils/MachineStateContext";
import {
  CheckInItemsOkButton,
  CheckInItemsDeleteButton,
  CheckInItemsHelpBoxText,
  CheckInItemsInputLabel,
  CheckInItemsHeader,
  CheckInItemsSubheader,
} from "./utils/formatted-messages";
import BarcodeHandler from "./utils/barcode-handler";
import {
  ACTION_CHANGE_FLOW_CHECKOUT,
  ACTION_CHANGE_FLOW_STATUS,
  ACTION_RESET,
  BARCODE_SCANNING_TIMEOUT, CHECKIN_MESSAGE_SEND_TO_OTHER_LIBRARY_PREFIX,
} from "../constants";
import CheckInWhite from "../../scss/images/check-in-white.svg";
import { Card } from "react-bootstrap";

/**
 * CheckInItems component.
 *
 * Supplies a page for returning materials.
 *
 * @return {*}
 * @constructor
 */
function CheckInItems({ actionHandler }) {
  const {
    machineState: { items },
    boxConfig: {
      barcodeTimeout,
      soundEnabled,
      reservedMaterialInstruction,
      otherPermanentLocationInstruction,
      hasPrinter,
      debugEnabled,
    },
  } = useContext(MachineStateContext);

  const [scannedBarcode, setScannedBarcode] = useState("");
  const [handledReservations, setHandledReservations] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(null);
  const [newReservation, setNewReservation] = useState(null);
  const [checkedInBooksLength, setCheckedInBooksLength] = useState(0);
  const [errorsLength, setErrorLength] = useState(0);
  const [soundToPlay, setSoundToPlay] = useState("");

  /**
   * Handles numpad presses.
   *
   * @param key
   *    The pressed button.
   */
  function onInput(key) {
    const typedBarcode = `${scannedBarcode}`;
    switch (key) {
      case CheckInItemsDeleteButton:
        setScannedBarcode(typedBarcode.slice(0, -1));
        break;
      case CheckInItemsOkButton:
        handleItemCheckIn(scannedBarcode);
        break;
      default:
        setScannedBarcode(`${typedBarcode}${key}`);
        break;
    }
  }

  /**
   * Handles keyboard inputs.
   */
  const handleItemCheckIn = useCallback(
    (barcode) => {
      // Ignore empty check ins.
      if (barcode && barcode.length > 0) {
        actionHandler("checkInItem", {
          itemIdentifier: barcode,
        });
        setScannedBarcode("");
      }
    },
    [actionHandler]
  );

  /**
   * Set up barcode scanner listener.
   */
  useEffect(() => {
    const barcodeScanner = new BarcodeScanner(
      barcodeTimeout || BARCODE_SCANNING_TIMEOUT
    );
    const barcodeCallback = new BarcodeHandler(
      [ACTION_CHANGE_FLOW_CHECKOUT, ACTION_CHANGE_FLOW_STATUS, ACTION_RESET],
      actionHandler,
      function (result) {
        handleItemCheckIn(result.code);
      }
    ).createCallback();

    barcodeScanner.start(barcodeCallback);
    return () => {
      barcodeScanner.stop();
    };
  }, [actionHandler, barcodeTimeout, handleItemCheckIn]);

  /**
   * Clear new reservation.
   */
  useEffect(() => {
    setNewReservation(null);
  }, [newReservation]);

  /**
   * Determines whether to play a sound and which to play.
   */
  useEffect(() => {
    if (items === undefined) return;
    let newReservedBook = null;

    /**
     * Evaluate if a new checked-in book is reserved by another user.
     */
    items.forEach((book, { itemIdentifier, reservedByOtherUser, message }) => {
      if (
        reservedByOtherUser &&
        !handledReservations.includes(itemIdentifier)
      ) {
        const newBook = { ...book };
        newBook.message = reservedMaterialInstruction || message;
        newReservedBook = newBook;

        const newHandledReservations = handledReservations;
        newHandledReservations.push(itemIdentifier);
        setHandledReservations(newHandledReservations);
        setSoundToPlay("reserved");
        if (newReservedBook !== null) {
          setNewReservation(newReservedBook);
        }
      }
    });

    /**
     * Handle successful checkin.
     */
    const newCheckInLength = items.filter(
      (book) =>
        book.status === BookStatus.CHECKED_IN && book.message !== "Reserveret"
    ).length;

    if (newCheckInLength !== checkedInBooksLength) {
      setCheckedInBooksLength(newCheckInLength);
    }

    /**
     * Play sound for check-in error or if the item should be delivered to another library.
     *
     * Fbs returns a string if a book should be sent to another
     * library, containing something like this: "Sendes til X bibliotek"
     * TODO: Handle this in engine instead.
     */
    const newErrorsLength = items.filter(
      ({ status, message }) => status === BookStatus.ERROR || message?.indexOf(CHECKIN_MESSAGE_SEND_TO_OTHER_LIBRARY_PREFIX) === 0
    ).length;

    if (newErrorsLength !== errorsLength) {
      setErrorLength(newErrorsLength);
      setSoundToPlay("error");
    }
  }, [
    checkedInBooksLength,
    errorsLength,
    handledReservations,
    items,
    reservedMaterialInstruction,
  ]);

  /**
   * Play sound.
   */
  useEffect(() => {
    if (soundEnabled && soundToPlay !== "") {
      let sound = new Sound();
      sound.playSound(soundToPlay);
    }
  }, [soundEnabled, soundToPlay]);

  useEffect(() => {
    if (items && items.length > 0) {
      setDisplayedItems(
        adaptListOfBooksToBanner(
          items,
          reservedMaterialInstruction,
          otherPermanentLocationInstruction
        ).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
      );
    }
  }, [items, otherPermanentLocationInstruction, reservedMaterialInstruction]);

  return (
    <>
      {newReservation !== null && hasPrinter && (
        <Print key={newReservation.title} book={newReservation} />
      )}
      <Header
        header={CheckInItemsHeader}
        subheader={CheckInItemsSubheader}
        type="checkInItems"
        img={CheckInWhite}
      />
      <div className="col-md-3">
        <HelpBox text={CheckInItemsHelpBoxText} />
      </div>
      <div className="col-md-1" />
      <div className="col-md-8">
        {displayedItems && <BannerList items={displayedItems} />}
      </div>
      {debugEnabled && (
        <Card className="col-md-12 m-5">
          <Card.Body className="row">
            <div className="col-md-6">
              <label className="control-label">{CheckInItemsInputLabel}</label>
              <div className="form-control">{scannedBarcode}</div>
            </div>
            <div className="col-md-6">
              <NumPad
                handleNumpadPress={onInput}
                deleteButtonLabel={CheckInItemsDeleteButton}
                okButtonLabel={CheckInItemsOkButton}
              />
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
}

CheckInItems.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default CheckInItems;

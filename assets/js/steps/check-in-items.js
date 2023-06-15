/**
 * @file
 * The component that is shown when the machinestate is checkInItems.
 * This component creates af view of the books that the user hands in (returns).
 */

import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import BarcodeScanner from "./utils/barcode-scanner";
import HelpBox from "./components/help-box";
import BannerList from "./components/banner-list";
import Header from "./components/header";
import { adaptListOfBooksToBanner } from "./utils/banner-adapter";
import NumPad from "./utils/num-pad";
import Print from "./utils/print";
import Sound from "./utils/sound";
import BookStatus from "./utils/book-status";
import MachineStateContext from "./utils/machine-state-context";
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
  BARCODE_SCANNING_TIMEOUT,
} from "../constants";
import CheckInWhite from "../../scss/images/check-in-white.svg";

/**
 * CheckInItems component.
 *
 * Supplies a page for returning materials.
 *
 * @return {*}
 * @constructor
 */
function CheckInItems({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const [scannedBarcode, setScannedBarcode] = useState("");
    const [handledReservations, setHandledReservations] = useState([]);
    const [newReservation, setNewReservation] = useState(null);
    const [checkedInBooksLength, setCheckedInBooksLength] = useState(0);
    const [errorsLength, setErrorLength] = useState(0);
    const sound = new Sound();

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
    const handleItemCheckIn = (barcode) => {
    // Ignore empty check ins.
        if (barcode && barcode.length > 0) {
            actionHandler("checkInItem", {
                itemIdentifier: barcode,
            });
            setScannedBarcode("");
        }
    };

    /**
   * Set up barcode scanner listener.
   */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(
            context.boxConfig.get.barcodeTimeout || BARCODE_SCANNING_TIMEOUT
        );
        const barcodeCallback = new BarcodeHandler(
            [ACTION_CHANGE_FLOW_CHECKOUT, ACTION_CHANGE_FLOW_STATUS, ACTION_RESET],
            actionHandler,
            function(result) {
                handleItemCheckIn(result.code);
            }
        ).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);

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
        if (context.machineState.get.items === undefined) return;
        let soundToPlay = null;
        let newReservedBook = null;

        /**
     * Evaluate if a new checked-in book is reserved by another user.
     */
        context.machineState.get.items.forEach((book) => {
            if (
                book.reservedByOtherUser &&
        !handledReservations.includes(book.itemIdentifier)
            ) {
                const newBook = { ...book };
                newBook.message =
          context.boxConfig.get.reservedMaterialInstruction || book.message;
                newReservedBook = newBook;

                const newHandledReservations = handledReservations;
                newHandledReservations.push(book.itemIdentifier);
                setHandledReservations(newHandledReservations);
                soundToPlay = "reserved";
            }
        });

        /**
     * Handle successful checkin.
     */
        let booksLength = context.machineState.get.items.filter(
            (book) =>
                book.status === BookStatus.CHECKED_IN && book.message !== "Reserveret"
        ).length;
        if (booksLength > checkedInBooksLength) {
            setCheckedInBooksLength(booksLength);
        }

        /**
     * Play sound for check-in error.
     */
        booksLength = context.machineState.get.items.filter(
            (book) => book.status === BookStatus.ERROR
        ).length;
        if (booksLength > errorsLength) {
            setErrorLength(booksLength);
            soundToPlay = "error";
        }

        /**
     * Play sound.
     */
        if (context.boxConfig.get.soundEnabled && soundToPlay) {
            sound
                .playSound(soundToPlay)
                .then(() => {
                    if (newReservedBook !== null) {
                        setNewReservation(newReservedBook);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    if (newReservedBook !== null) {
                        setNewReservation(newReservedBook);
                    }
                });
        } else if (newReservedBook !== null) {
            setNewReservation(newReservedBook);
    }
    }, [context.machineState.get.items]);

    let items;
    if (context.machineState.get.items) {
        items = adaptListOfBooksToBanner(
            context.machineState.get.items,
            context.boxConfig.get.reservedMaterialInstruction
        );

        // Sort items according to timestamp.
        items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    }

    return (
        <>
            {newReservation !== null && context.boxConfig.get.hasPrinter && (
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
            <div className="col-md-8">{items && <BannerList items={items} />}</div>
            {context.boxConfig.get.debugEnabled && (
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

/**
 * @file
 * The component that is shown when the machine state is checkOutItems.
 * This component creates a view of the books that the user checks out (borrows).
 */

import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BarcodeScanner } from './utils/barcode-scanner';
import {
    ACTION_CHANGE_FLOW_STATUS,
    ACTION_CHANGE_FLOW_CHECKIN,
    ACTION_RESET,
    BARCODE_SCANNING_TIMEOUT
} from '../constants';
import MachineStateContext from './utils/machine-state-context';
import HelpBox from './components/help-box';
import BannerList from './components/banner-list';
import Header from './components/header';
import { adaptListOfBooksToBanner } from './utils/banner-adapter';
import NumPad from './utils/num-pad';
import Sound from './utils/sound';
import BookStatus from './utils/book-status';
import {
    CheckOutItemsOkButton,
    CheckOutItemsDeleteButton,
    CheckOutItemsHelpBoxText,
    CheckOutItemsInputLabel,
    CheckOutItemsHeader,
    CheckOutItemsSubheader
} from './utils/formatted-messages';
import BarcodeHandler from './utils/barcode-handler';
import CheckOutWhite from '../../scss/images/check-out-white.svg';
import { Card } from 'react-bootstrap';

/**
 * CheckOutItems component.
 *
 * Supplies a page for borrowing items from the library.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function CheckOutItems({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [checkedOutBooksLength, setCheckedOutBooksLength] = useState(0);
    const [errorsLength, setErrorLength] = useState(0);
    const sound = new Sound();

    /**
     * Set up barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(context.boxConfig.get.barcodeTimeout || BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (new BarcodeHandler([
            ACTION_CHANGE_FLOW_STATUS, ACTION_CHANGE_FLOW_CHECKIN, ACTION_RESET
        ], actionHandler, function(result) {
            setScannedBarcode(result.outputCode);
            handleItemCheckOut(result.code);
        })).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => {
            barcodeScanner.stop();
        };
    }, [actionHandler]);

    /**
     * Handles numpad presses.
     *
     * @param key
     *    The pressed button.
     */
    function onInput(key) {
        const typedBarcode = `${scannedBarcode}`;
        switch (key) {
            case CheckOutItemsDeleteButton:
                setScannedBarcode(typedBarcode.slice(0, -1));
                break;
            case CheckOutItemsOkButton:
                handleItemCheckOut(scannedBarcode);
                break;
            default:
                setScannedBarcode(`${typedBarcode}${key}`);
                break;
        }
    }

    /**
     * Handles keyboard inputs.
     */
    function handleItemCheckOut(scannedBarcode) {
        actionHandler('checkOutItem', {
            itemIdentifier: scannedBarcode
        });
        setScannedBarcode('');
    }

    /**
     * Play sound for successful checkout.
     */
    useEffect(() => {
        if (context.machineState.get.items === undefined) return;
        let soundToPlay = null;

        /**
         * Handle successful checkout.
         */
        let booksLength = context.machineState.get.items.filter(book => book.status === BookStatus.CHECKED_OUT || book.status === BookStatus.RENEWED).length;
        if (booksLength > checkedOutBooksLength) {
            setCheckedOutBooksLength(booksLength);
        }

        /**
         * Play sound for erring checkout.
         */
        booksLength = context.machineState.get.items.filter(book => book.status === BookStatus.ERROR).length;
        if (booksLength > errorsLength) {
            setErrorLength(booksLength);
            soundToPlay = 'error';
        }

        /**
         * Play sound.
         */
        if (context.boxConfig.get.soundEnabled && soundToPlay) {
            sound.playSound(soundToPlay);
        }
    }, [context.machineState.get.items]);

    let items = [];
    if (context.machineState.get.items) {
        items = adaptListOfBooksToBanner(context.machineState.get.items);

        // Sort items according to timestamp.
        items.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);
    }

    return (
        <>
            <Header
                header={CheckOutItemsHeader}
                subheader={CheckOutItemsSubheader}
                type="checkOutItems"
                img={CheckOutWhite}
            />
            <div className="col-md-3">
                <HelpBox text={CheckOutItemsHelpBoxText}/>
            </div>
            <div className="col-md-1"/>
            <div className="col-md-8">
                {items && <BannerList items={items}/>}
            </div>
            {(context.boxConfig.get.debugEnabled) &&
                <Card className="col-md-12 m-5">
                    <Card.Body className="row">
                        <div className="col-md-6">
                            <label className="control-label">{CheckOutItemsInputLabel}</label>
                            <div className="form-control">
                                {scannedBarcode}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <NumPad handleNumpadPress={onInput}
                                deleteButtonLabel={CheckOutItemsDeleteButton}
                                okButtonLabel={CheckOutItemsOkButton}/>
                        </div>
                    </Card.Body>
                </Card>
            }
        </>
    );
}

CheckOutItems.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default CheckOutItems;

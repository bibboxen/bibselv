/**
 * @file
 * The component that is shown when the machine state is checkOutItems.
 * This component creates a view of the books that the user checks out (borrows).
 */

import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { BarcodeScanner } from './utils/barcode-scanner';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_STATUS,
    BARCODE_COMMAND_CHECKIN
} from '../constants';
import MachineStateContext from './utils/machine-state-context';
import HelpBox from './components/help-box';
import BannerList from './components/banner-list';
import Header from './components/header';
import Input from './components/input';
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
} from './utils/formattedMessages';
import CheckOutWhite from '../../scss/images/check-out-white.svg';

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
    const [activeBanner, setActiveBanner] = useState(false);
    const [checkedOutBooksLength, setCheckedOutBooksLength] = useState(0);
    const [errorsLength, setErrorLength] = useState(0);
    const sound = new Sound();

    /**
     * Set up barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);
        const barcodeCallback = (code) => {
            if (code.length === BARCODE_COMMAND_LENGTH) {
                switch (code) {
                    case BARCODE_COMMAND_FINISH:
                        actionHandler('reset');
                        break;
                    case BARCODE_COMMAND_STATUS:
                        actionHandler('changeFlow', {
                            flow: 'status'
                        });
                        break;
                    case BARCODE_COMMAND_CHECKIN:
                        actionHandler('changeFlow', {
                            flow: 'checkInItems'
                        });
                        break;
                }
            } else {
                setScannedBarcode(code);
                handleItemCheckOut();
            }
        };

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
        setActiveBanner(false);
        switch (key) {
            case CheckOutItemsDeleteButton:
                setScannedBarcode(typedBarcode.slice(0, -1));
                break;
            case CheckOutItemsOkButton:
                setActiveBanner(true);
                handleItemCheckOut(scannedBarcode);
                break;
            default:
                setScannedBarcode(`${typedBarcode}${key}`);
                break;
        }
    }

    /**
     * Function to handle when keydown is enter.
     */
    function keyDownFunction(event) {
        if (event.key === 'Enter') {
            handleItemCheckOut();
        }
    }

    /**
     * Set up keydown listener.
     */
    useEffect(() => {
        window.addEventListener('keydown', keyDownFunction);
        return () => window.removeEventListener('keydown', keyDownFunction);
    }, [scannedBarcode]);

    /**
     * Handles keyboard inputs.
     *
     * @param target
     *    The pressed target.
     */
    function onKeyboardInput({ target }) {
        setActiveBanner(false);
        setScannedBarcode(target.value);
    }

    /**
     * Handles keyboard inputs.
     *
     */
    function handleItemCheckOut() {
        setActiveBanner(true);
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
         * Play sound for successful checkout.
         */
        let booksLength = context.machineState.get.items.filter(book => book.status === BookStatus.CHECKED_OUT || book.status === BookStatus.RENEWED).length;
        if (booksLength > checkedOutBooksLength) {
            setCheckedOutBooksLength(booksLength);
            soundToPlay = 'success';
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
    }

    return (
        <>
            <Header
                header={CheckOutItemsHeader}
                subheader={CheckOutItemsSubheader}
                type='checkOutItems'
                img={CheckOutWhite}
            />
            <div className='col-md-3'>
                <HelpBox text={CheckOutItemsHelpBoxText} />
            </div>
            <div className='col-md-1' />
            <div className='col-md-6'>
                <Input
                    name='barcode'
                    label={CheckOutItemsInputLabel}
                    value={scannedBarcode}
                    activeBanner={activeBanner}
                    onChange={onKeyboardInput}
                />
                {items && <BannerList items={items} />}
            </div>
            <div className='col-md-5'>
                {(context.boxConfig.get.debugEnabled || context.boxConfig.get.hasTouch) &&
                    <NumPad handleNumpadPress={onInput}
                        deleteButtonLabel={CheckOutItemsDeleteButton}
                        okButtonLabel={CheckOutItemsOkButton} />
                }
            </div>
        </>
    );
}

CheckOutItems.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default CheckOutItems;

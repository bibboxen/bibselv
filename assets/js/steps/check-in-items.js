/**
 * @file
 * The component that is shown when the machinestate is checkInItems.
 * This component creates af view of the books that the user hands in (returns).
 */

import React, { useContext, useState, useEffect } from 'react';
import BarcodeScanner from './utils/barcode-scanner';
import PropTypes from 'prop-types';
import MachineStateContext from '../context/machine-state-context';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_STATUS,
    BARCODE_COMMAND_CHECKOUT
} from '../constants';
import HelpBox from './components/help-box';
import BannerList from './components/banner-list';
import Header from './components/header';
import Input from './components/input';
import { adaptListOfBooksToBanner } from './utils/banner-adapter';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import NumPad from './utils/num-pad';
import Print from '../steps/utils/print';
import Sound from './utils/sound';
import BookStatus from './utils/book-status';

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
    const [scannedBarcode, setScannedBarcode] = useState('');
    const [activeBanner, setActiveBanner] = useState(false);
    const [handledReservations, setHandledReservations] = useState([]);
    const [newReservation, setNewReservation] = useState(null);
    const [checkedInBooksLength, setCheckedInBooksLength] = useState(0);
    const [errorsLength, setErrorLength] = useState(0);
    const okButtonLabel = 'Ok';
    const deleteButtonLabel = 'Slet';
    const sound = new Sound();

    /**
     * Handles numpad presses.
     *
     * @param key
     *    The pressed button.
     */
    function onNumPadPress(key) {
        const typedBarcode = `${scannedBarcode}`;
        setActiveBanner(false);
        switch (key) {
            case deleteButtonLabel:
                setScannedBarcode(typedBarcode.slice(0, -1));
                break;
            case okButtonLabel:
                setActiveBanner(true);
                handleItemCheckIn(scannedBarcode);
                break;
            default:
                setScannedBarcode(`${typedBarcode}${key}`);
                break;
        }
    }

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
     */
    function handleItemCheckIn() {
        // Ignore empty check ins.
        if (scannedBarcode && scannedBarcode.length > 0) {
            setActiveBanner(true);
            actionHandler('checkInItem', {
                itemIdentifier: scannedBarcode
            });
            setScannedBarcode('');
        }
    }

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
                    case BARCODE_COMMAND_CHECKOUT:
                        actionHandler('changeFlow', {
                            flow: 'checkOutItems'
                        });
                        break;
                }
            } else {
                setScannedBarcode(code);
                handleItemCheckIn();
            }
        };

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
     * Determines whether to play a soumd and which to play.
     */
    useEffect(() => {
        /**
        * Evaluate if a new checked-in book is reserved by another user.
        */
        if (context.machineState.get.items === undefined) return;

        let playSound = false;
        let soundToPlay = '';
        context.machineState.get.items.forEach(book => {
            if (book.message === 'Reserveret' && !handledReservations.includes(book.itemIdentifier)) {
                setNewReservation(book);

                const newHandledReservations = handledReservations;
                newHandledReservations.push(book.itemIdentifier);
                setHandledReservations(newHandledReservations);

                playSound = true;
                soundToPlay = 'reserved';
            }
        });

        /**
         * Play sound for successful checkin.
         */
        let booksLength = context.machineState.get.items.filter(book => book.status === BookStatus.CHECKED_IN && book.message !== 'Reserveret').length;
        if (booksLength > checkedInBooksLength) {
            setCheckedInBooksLength(booksLength);
            playSound = true;
            soundToPlay = 'success';
        }

        /**
         * Play sound for erring checkin.
         */
        booksLength = context.machineState.get.items.filter(book => book.status === BookStatus.ERROR).length;
        if (booksLength > errorsLength) {
            setErrorLength(booksLength);
            playSound = true;
            soundToPlay = 'error';
        }

        /**
         * Play sound.
         */
        if (context.boxConfig.get.soundEnabled && playSound) {
            sound.playSound(soundToPlay);
        }
    }, [context.machineState.get.items]);

    let items;
    if (context.machineState.get.items) {
        items = adaptListOfBooksToBanner(context.machineState.get.items);
    }

    return (
        <>
            {newReservation !== null &&
                <Print key={newReservation.title} book={newReservation}/>
            }
            <div className='col-md-9'>
                <Header
                    header='Aflever'
                    subheader='Scan stregkoden på bogen du vil aflevere'
                    which='checkInItems'
                    icon={faBook}
                />

                <div className='row'>
                    <div className='col-md-2' />

                    <div className='col-md mt-4'>
                        <Input
                            name='barcode'
                            label='Stregkode'
                            value={scannedBarcode}
                            activeBanner={activeBanner}
                            onChange={onKeyboardInput}

                        />
                        {items && <BannerList items={items} />}
                        {context.boxConfig.get.debugEnabled && (
                            <NumPad handleNumpadPress={onNumPadPress}
                                deleteButtonLabel={deleteButtonLabel}
                                okButtonLabel={okButtonLabel}/>
                        )}
                    </div>
                </div>
            </div>
            <div className='col-md-3'>
                <HelpBox
                    text={
                        'Brug håndscanneren til at scanne stregkoden på bogen. Eller tast bogens ISBN nummer.'
                    }
                />
            </div>
            <div className="print"/>
        </>
    );
}

CheckInItems.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default CheckInItems;

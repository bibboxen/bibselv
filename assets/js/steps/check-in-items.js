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
import BookStatus from './utils/book-status';
import Print from '../steps/utils/print';

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
    const okButtonLabel = 'Ok';
    const deleteButtonLabel = 'Slet';
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

    let items = [];
    if (context.machineState.get.items) {
        items = adaptListOfBooksToBanner(context.machineState.get.items);
    }
    
    const reservedBookForPrint = items.filter(book => book.status === BookStatus.RESERVED).pop();

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
     *
     */
    function handleItemCheckIn() {
        setActiveBanner(true);
        actionHandler('checkInItem', {
            itemIdentifier: scannedBarcode
        });
        setScannedBarcode('');
    }

    return (
        <>
            {reservedBookForPrint &&
                <Print key={reservedBookForPrint.text} book={reservedBookForPrint}></Print>
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
            <div className="print"></div>
        </>
    );
}

CheckInItems.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default CheckInItems;

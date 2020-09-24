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
import MachineStateContext from '../context/machine-state-context';
import HelpBox from './components/help-box';
import BannerList from './components/banner-list';
import Header from './components/header';
import Input from './components/input';
import { adaptListOfBooksToBanner } from './utils/banner-adapter';
import { faBookReader } from '@fortawesome/free-solid-svg-icons';
import NumPad from './utils/num-pad';
import { FormattedMessage } from 'react-intl';

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
    const okButtonLabel = 'Ok';
    const deleteButtonLabel = 'Slet';
    const helpBoxText = <FormattedMessage id='check-out-items-help-box-text' defaultMessage='Brug håndscanneren til at scanne stregkoden på bogen.' />;
    const inputLabel = <FormattedMessage id='check-out-items-input-label' defaultMessage='Stregkode' />;

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
    function onNumPadPress(key) {
        const typedBarcode = `${scannedBarcode}`;
        setActiveBanner(false);
        switch (key) {
            case deleteButtonLabel:
                setScannedBarcode(typedBarcode.slice(0, -1));
                break;
            case okButtonLabel:
                setActiveBanner(true);
                handleItemCheckOut(scannedBarcode);
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
    function handleItemCheckOut() {
        setActiveBanner(true);
        actionHandler('checkOutItem', {
            itemIdentifier: scannedBarcode
        });
        setScannedBarcode('');
    }

    let items = [];
    if (context.machineState.get.items) {
        items = adaptListOfBooksToBanner(context.machineState.get.items);
    }

    return (
        <>
            <div className='col-md-9'>
                <Header
                    header='Lån'
                    subheader='Scan stregkoden på bogen du vil låne'
                    which='checkOutItems'
                    icon={faBookReader}
                />
                <div className='row'>
                    <div className='col-md-2' />

                    <div className='col-md mt-4'>
                        <Input
                            name='barcode'
                            label={inputLabel}
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
                    text={helpBoxText}
                />
            </div>
        </>
    );
}

CheckOutItems.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default CheckOutItems;

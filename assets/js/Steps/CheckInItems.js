/**
 * @file
 *
 * The component that is shown when the machinestate is checkInItems.
 * This component creates af view of the books that the user hands in (returns).
 */

import React, { useContext, useState, useEffect } from 'react';
import BarcodeScanner from './utils/BarcodeScanner';
import PropTypes from 'prop-types';
import MachineStateContext from '../context/machineStateContext';
import {
    BARCODE_COMMAND_FINISH,
    BARCODE_COMMAND_LENGTH,
    BARCODE_SCANNING_TIMEOUT,
    BARCODE_COMMAND_STATUS,
} from '../constants';
import HelpBox from './components/Helpbox';
import BannerList from './components/BannerList';
import Header from './components/Header';
import Input from './components/Input';
import { adaptListOfBooksToBanner } from './utils/BannerAdapter';
import { faBook } from '@fortawesome/free-solid-svg-icons';

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

    /**
     * Set up barcode scanner listener.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner(BARCODE_SCANNING_TIMEOUT);

        const barcodeCallback = (code) => {
            const whichFlow = context.machineState.get.user
                ? 'changeFlow'
                : 'enterFlow';
            if (code.length === BARCODE_COMMAND_LENGTH) {
                switch (code) {
                    case BARCODE_COMMAND_FINISH:
                        actionHandler('reset');
                        break;
                    case BARCODE_COMMAND_STATUS:
                        actionHandler(whichFlow, {
                            flow: 'status',
                        });
                        break;
                    case BARCODE_COMMAND_CHECKIN:
                        actionHandler(whichFlow, {
                            flow: 'checkOutItem',
                        });
                        break;
                    default:
                        actionHandler('checkInItem', {
                            itemIdentifier: code,
                        });
                }
                setScannedBarcode(code);
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
    return (
        <>
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
                            which='CheckInItems'
                            readOnly
                        />
                        {items && <BannerList items={items} />}
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
        </>
    );
}

CheckInItems.propTypes = {
    actionHandler: PropTypes.func.isRequired,
};

export default CheckInItems;

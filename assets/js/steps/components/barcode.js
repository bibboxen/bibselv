/**
 * @file
 * Barcode component.
 *
 * Display a barcode for manoeuvring via the scanner, CheckInItems, CheckOutItems or Status.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Barcode.
 *
 * @param type
 *   Which barcode to display, CheckInItems, CheckOutItems or Status.
 * @return {*}
 * @constructor
 */
function Barcode({ type }) {
    const classes = `barcode ${type.toLowerCase()}`;

    return (
        <div className={classes}>
            <div className='barcode-inner' />
        </div>
    );
}

Barcode.propTypes = {
    type: PropTypes.string.isRequired
};

export default Barcode;

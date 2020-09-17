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
 * @param which
 *   Which barcode to display, CheckInItems, CheckOutItems or Status.
 * @return {*}
 * @constructor
 */
function Barcode({ which }) {
    const classes = `barcode ${which.toLowerCase()}`;

    return (
        <div className={classes}>
            <div className='barcode-inner' />
        </div>
    );
}

Barcode.propTypes = {
    which: PropTypes.string.isRequired
};

export default Barcode;

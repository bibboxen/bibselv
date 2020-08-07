/**
 * @file
 * Barcode component.
 *
 * @TODO: Describe what it is used for.
 * @TODO: Missing tests.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Barcode.
 *
 * @param which
 *   @TODO: Rename to more meaningful name than 'which' and document.
 * @return {*}
 * @constructor
 */
function Barcode({ which }) {
    const classes = `barcode ${which.toLowerCase()}`;

    return (
        <div className={classes}>
            <div className="barcode-inner" />
        </div>
    );
}

Barcode.propTypes = {
    which: PropTypes.string.isRequired
};

export default Barcode;

import React from 'react';
import PropTypes from 'prop-types';
function Barcode({ color }) {
    const classes = `barcode ${color}`;
    return <div className={classes}><div className="barcode-inner"></div></div>;
}
Barcode.propTypes = {
    color: PropTypes.string.isRequired
};

export default Barcode;
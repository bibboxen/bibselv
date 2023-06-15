/**
 * @file
 * Barcode component.
 *
 * Display a barcode for manoeuvring via the scanner, CheckInItems, CheckOutItems or Status.
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * Barcode.
 *
 * @param type
 *   Which barcode to display, CheckInItems, CheckOutItems or Status.
 * @param disabled
 *   Disable the barcode
 *
 * @return {*}
 * @constructor
 */
function Barcode({ type, disabled }) {
  const classes = `barcode ${type.toLowerCase()} ${disabled ? "disabled" : ""}`;

  return (
    <div className={classes}>
      <div className="barcode-inner" />
    </div>
  );
}

Barcode.propTypes = {
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default Barcode;

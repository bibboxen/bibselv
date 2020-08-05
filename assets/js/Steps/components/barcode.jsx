import React from "react";
import PropTypes from "prop-types";
function Barcode({ which }) {
  const classes = `barcode ${which}`;
  return (
    <div className={classes}>
      <div className="barcode-inner"></div>
    </div>
  );
}
Barcode.propTypes = {
  which: PropTypes.string.isRequired,
};

export default Barcode;

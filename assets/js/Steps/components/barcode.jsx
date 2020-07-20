import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function Barcode({ color }) {
  let classes = `barcode ${color}`;
  return <div className={classes}></div>;
}
Barcode.propTypes = {
  color: PropTypes.string.isRequired,
};

export default Barcode;

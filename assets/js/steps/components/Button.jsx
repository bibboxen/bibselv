/**
 * @file
 * The button component is used to display a button on screen.
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Button.
 *
 * @param label
 *   Label for the button.
 * @param icon
 *   Button icon.
 * @param img
 *   Button image.
 * @param disabled
 *   Disable button
 *
 * @return {*}
 * @constructor
 */
function Button({ label, icon, img, disabled, ...rest }) {
  return (
    <button type="button" disabled={disabled} {...rest}>
      <span>
        <div className="icon">
          {img && <img src={img} height={18} />}
          {icon && <FontAwesomeIcon icon={icon} />}
        </div>
        {label}
      </span>
      <div className="button-barcode" />
    </button>
  );
}

Button.propTypes = {
    label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    icon: PropTypes.object,
    img: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;

/**
 * @file
 *
 * A numpad for entering book ids and login.
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faBackspace } from "@fortawesome/free-solid-svg-icons";

/**
 * NumPad.
 *
 * @param handleNumpadPress
 *   The callback when a button is pressed.
 * @return {*}
 * @constructor
 */
function NumPad({ handleNumpadPress, okButtonLabel, deleteButtonLabel }) {
  const buttons = [
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    {
      key: "delete",
      label: deleteButtonLabel,
      icon: faBackspace,
      extraClass: "red",
    },
    { label: "0" },
    {
      key: "ok",
      label: okButtonLabel,
      icon: faArrowAltCircleRight,
      extraClass: "green",
    },
  ];

  return (
    <div className="num-pad">
      {buttons.map(({ key, label, icon, extraClass }) => (
        <div
          key={key || label}
          className={
            extraClass ? `button-numpad ${extraClass}` : "button-numpad"
          }
          onClick={() => handleNumpadPress(label)}
        >
          {label}
          {icon && (
            <div className="icon">
              <FontAwesomeIcon icon={icon} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

NumPad.propTypes = {
  handleNumpadPress: PropTypes.func.isRequired,
  okButtonLabel: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
  deleteButtonLabel: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
    .isRequired,
};

export default NumPad;

/**
 * @file
 * Alert.
 */

import React from "react";
import PropTypes from "prop-types";

/**
 * Alert.
 *
 * @param message.
 *   The message to be displayed in the alert.
 * @param variant
 *   The variant of the alert (bootstrap). Eg. danger (default), warning
 *
 * @return {*}
 * @constructor
 */
function Alert({ message, variant }) {
  const classes = `alert alert-${variant || "danger"} m-5`;

  return (
    <div
      data-cy="alert"
      className={classes}
      style={{ width: "100%" }}
      role="alert"
    >
      {message}
    </div>
  );
}

Alert.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    variant: PropTypes.string,
};

export default Alert;

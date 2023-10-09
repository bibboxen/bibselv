/**
 * @file
 * Banner component.
 *
 * Displays a book banner (error, inprogress, neutral or success).
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BookStatus from "../utils/book-status";
import {
  faCheck,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Banner.
 *
 * @param item
 *   Item to be displayed by the banner components
 * @param visibleOnPrint
 *   Display on print output?
 * @return {*}
 * @constructor
 */
function Banner({ item, visibleOnPrint = false }) {
  let classes = visibleOnPrint ? "banner visibe-on-print " : "banner ";
  let { text, title, status, itemIdentifier, message } = item;
  let icon = null;
  switch (status) {
    case BookStatus.ERROR:
    case BookStatus.RESERVED:
      classes += "danger";
      icon = faExclamationTriangle;
      break;
    case BookStatus.IN_PROGRESS:
      icon = faSpinner;
      text = `${itemIdentifier}`;
      break;
    case BookStatus.RENEWED:
    case BookStatus.CHECKED_OUT:
    case BookStatus.CHECKED_IN:
    case BookStatus.SUCCESS:
      if (message?.indexOf("Sendes til") === 0) {
        classes += "warning";
      } else {
        classes += "success";
        icon = faCheck;
      }

      break;
  }

  return (
    <div className={classes} data-cy="banner">
      {icon && (
        <div className="icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <span className="header">{title}</span>
      {text && <span className="text">{text}</span>}
    </div>
  );
}
Banner.propTypes = {
  item: PropTypes.object.isRequired,
  visibleOnPrint: PropTypes.bool,
};

export default Banner;

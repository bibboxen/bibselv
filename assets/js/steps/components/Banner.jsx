/**
 * @file
 * Banner component.
 *
 * Displays a book banner (error, inprogress, neutral or success).
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BookStatus from "../utils/BookStatus";

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
    let { text, title, status, itemIdentifier } = item;
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
            classes += "success";
            icon = faCheck;
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

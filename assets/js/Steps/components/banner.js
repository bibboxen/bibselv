/**
 * @file
 * Banner component.
 *
 * Displays a book banner (error, inprogress, neutral or success).
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bookStatus from "./BookStatus";
import {
    faCheck,
    faSpinner,
    faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Banner.
 *
 * @param item
 *   item to be displayed by the banner components.
 * @return {*}
 * @constructor
 */
function Banner({ item }) {
    let classes = "banner ";
    let { text, title, status, itemIdentifier } = item;
    let icon = {};
    switch (status) {
        case bookStatus.ERROR:
            classes += "danger";
            icon = faExclamationTriangle;
            break;
        case bookStatus.IN_PROGRESS:
            icon = faSpinner;
            text = `${itemIdentifier}`;
            break;
        case bookStatus.RENEWED:
        case bookStatus.CHECKED_OUT:
        case bookStatus.CHECKED_IN:
        case bookStatus.SUCCESS:
            classes += "success";
            icon = faCheck;
            break;
    }
    return (
        <div className={classes}>
            {icon && (
                <div className="icon">
                    <FontAwesomeIcon icon={icon} />
                </div>
            )}
            <div className="d-flex flex-column">
                <div className="header">{title}</div>
                <div>{text}</div>
            </div>
        </div>
    );
}
Banner.propTypes = {
    item: PropTypes.object.isRequired,
};

export default Banner;

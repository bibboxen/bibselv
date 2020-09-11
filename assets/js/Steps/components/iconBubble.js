/**
 * @file
 *
 * Displays the icon bubble in the header
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

 /**
 * IconBubble.
 *
 * @param which
 *   Which bubble to display, CheckInItems, CheckOutItems, Status or login. 
 * @param icon
 *   Which icon the bubble has. 
 * @return {*}
 * @constructor
 */
function IconBubble({ which, icon }) {
    const classes = `header-icon ${which.toLowerCase()}`;
    return (
        <div className="col-md-2">
            <div className={classes}>
                <div className="icon">
                    <FontAwesomeIcon icon={icon} />
                </div>
            </div>
        </div>
    );
}

IconBubble.propTypes = {
    which: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
};

export default IconBubble;

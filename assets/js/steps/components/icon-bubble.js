/**
 * @file
 * Displays the icon bubble in the header
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * IconBubble.
 *
 * @param which
 *   Which bubble to display, CheckInItems, CheckOutItems, Status or login.
 * @param icon
 *   If the icon in the header has an icon, this is it.
 * @param img
 *   If the icon in the header has an img, this is it.
 * @return {*}
 * @constructor
 */
function IconBubble({ which, icon, img }) {
    const classes = `header-icon ${which.toLowerCase()}`;
    return (
        <div className={classes}>
            <div className='icon'>
                {img &&
                    <img src={img} height={28} />
                }
                {icon &&
                    <FontAwesomeIcon icon={icon} />
                }
            </div>
        </div>
    );
}

IconBubble.propTypes = {
    which: PropTypes.string.isRequired,
    icon: PropTypes.object,
    img: PropTypes.string
};

export default IconBubble;

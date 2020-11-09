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
 * @param type
 *   type: CheckInItems, CheckOutItems, Status or login.
 * @param icon
 *   Bubble icon.
 * @param img
 *   Bubble image.
 * @return {*}
 * @constructor
 */
function IconBubble({ type, icon, img }) {
    const classes = `header-icon ${type.toLowerCase()}`;
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
    type: PropTypes.string.isRequired,
    icon: PropTypes.object,
    img: PropTypes.string
};

export default IconBubble;

/**
 * @file
 * The button component is used to display a button on screen.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Button.
 *
 * @param label
 *   Label for the button.
 * @param icon
 *   Icon for the button.
 * @param handleButtonPress
 *   Function for when button is pressed.
 * @param color
 *   Which color the button has.
 * @return {*}
 * @constructor
 */
const Button = ({ label, icon, handleButtonPress, color }) => {
    const classes = color ? `button ${color.toLowerCase()}` : 'button';

    return (
        <button
            onClick={handleButtonPress}
            className={classes}
            type='button'
        >
            {label}
            <span className='icon'>
                <FontAwesomeIcon icon={icon} />
            </span>
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    icon: PropTypes.object.isRequired,
    color: PropTypes.string,
    handleButtonPress: PropTypes.func.isRequired
};

export default Button;

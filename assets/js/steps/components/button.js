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
 * @param which
 *   Which button, Reset, CheckInItems, CheckOutItems, Login, or Status.
 * @return {*}
 * @constructor
 */
const Button = ({ label, icon, handleButtonPress, which }) => {
    const classes = `button ${which.toLowerCase()}`;

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
    which: PropTypes.string,
    handleButtonPress: PropTypes.func.isRequired
};

export default Button;

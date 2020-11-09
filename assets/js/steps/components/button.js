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
 *   Button icon.
 * @param img
 *   Button image.
 * @param handleButtonPress
 *   Function for when button is pressed.
 * @param color
 *   Which color the button has.
 * @param disabled
 *   Disable button
 *
 * @return {*}
 * @constructor
 */
const Button = ({ label, icon, img, handleButtonPress, color, disabled }) => {
    const classes = color ? `button ${color.toLowerCase()}` : 'button';

    return (
        <button
            onClick={handleButtonPress}
            className={classes}
            type='button'
            disabled={disabled}
        >
            {label}
            <span className='icon'>
                {img &&
                    <img src={img} height={18} />
                }
                {icon &&
                    <FontAwesomeIcon icon={icon} />
                }
            </span>
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    icon: PropTypes.object,
    img: PropTypes.string,
    color: PropTypes.string,
    disabled: PropTypes.bool,
    handleButtonPress: PropTypes.func.isRequired
};

export default Button;

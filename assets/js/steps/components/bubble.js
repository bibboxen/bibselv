/**
 * @file
 * A bubble is the initial three buttons the user meets.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Bubble.
 *
 * @param type
 *   Which bubble to display, CheckInItems, CheckOutItems or Status.
 * @param label
 *   Which label the bubble has.
 * @param icon
 *   Bubble icon.
 * @param img
 *   Bubble image.
 * @param disabled
 *   Disable the Bubble.
 * @param onlyText
 *
 * @param rest
 *
 * @return {*}
 * @constructor
 */
function Bubble({ type, label, icon, img, disabled, onlyText = false, ...rest }) {
    const classes = `bubble ${type.toLowerCase()} ${disabled ? 'disabled' : ''}`;

    const onlyTextStyling = {};

    if (onlyText) {
        onlyTextStyling.marginTop = '40%';
    }

    return (
        <div
            className={classes}
            {...rest}
        >
            <div className='inner-bubble'>
                <div className='text-and-icon' style={onlyTextStyling}>
                    <div className='icon'>
                        {img &&
                            <img src={img} height={60} />
                        }
                        {icon &&
                            <FontAwesomeIcon icon={icon} color={disabled ? 'grey' : null} />
                        }
                    </div>
                    {label}
                </div>
            </div>
        </div>
    );
}
Bubble.propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    icon: PropTypes.object,
    img: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    onlyText: PropTypes.bool,
};

export default Bubble;

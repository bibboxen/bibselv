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
 * @param which
 *   Which bubble to display, CheckInItems, CheckOutItems or Status.
 * @param label
 *   Which label the bubble has.
 * @param icon
 *   If the bubble has an icon, this is it.
 * @param img
 *   If the bubble has an img, this is it.
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Bubble({ which, label, icon, img, actionHandler }) {
    const classes = `bubble ${which.toLowerCase()}`;

    return (
        <div
            className={classes}
            onClick={() => actionHandler('enterFlow', { flow: which })}
        >
            <div className='inner-bubble'>
                <div className='text-and-icon'>
                    <div className='icon'>
                        {img &&
                    <img src={img} height={60} />
                        }
                        {icon &&
                        <FontAwesomeIcon icon={icon} />
                        }
                    </div>
                    {label}
                </div>
            </div>
        </div>
    );
}
Bubble.propTypes = {
    which: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    icon: PropTypes.object,
    img: PropTypes.string,
    actionHandler: PropTypes.func.isRequired
};

export default Bubble;

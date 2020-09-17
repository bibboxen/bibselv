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
 *   Which icon the bubble has.
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Bubble({ which, label, icon, actionHandler }) {
    const classes = `bubble ${which.toLowerCase()}`;

    return (
        <div
            className={classes}
            onClick={() => actionHandler('enterFlow', { flow: which })}
        >
            <div className='inner-bubble'>
                <div className='text-and-icon'>
                    <div className='icon'>
                        <FontAwesomeIcon icon={icon} />
                    </div>
                    {label}
                </div>
            </div>
        </div>
    );
}
Bubble.propTypes = {
    which: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    actionHandler: PropTypes.func.isRequired
};

export default Bubble;

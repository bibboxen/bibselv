/**
 * @file
 *
 * @TODO: Describe what it is used for.
 * @TODO: Missing tests.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Bubble.
 *
 * @param which
 *   @TODO: Describe prop.
 * @param label
 *   @TODO: Describe prop.
 * @param icon
 *   @TODO: Describe prop.
 * @param actionHandler
 *   @TODO: Describe prop.
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
            <div className="inner-bubble">
                <div className="text-and-icon">
                    <div className="icon">
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

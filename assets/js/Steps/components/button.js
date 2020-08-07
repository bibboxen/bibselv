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
 * Button.
 *
 * @param label
 *   @TODO: Describe prop.
 * @param icon
 *   @TODO: Describe prop.
 * @param handleButtonPress
 *   @TODO: Describe prop.
 * @param which
 *   @TODO: Describe prop.
 * @param rest
 *   @TODO: Describe prop.
 * @return {*}
 * @constructor
 */
const Button = ({ label, icon, handleButtonPress, which, ...rest }) => {
    const classes = `button ${which.toLowerCase()}`;

    return (
        <button
            onClick={() => handleButtonPress(which)}
            className={classes}
            type="button"
        >
            {label}
            <span className="icon">
                <FontAwesomeIcon icon={icon} />
            </span>
        </button>
    );
};

Button.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    which: PropTypes.string,
    handleButtonPress: PropTypes.func.isRequired
};

export default Button;

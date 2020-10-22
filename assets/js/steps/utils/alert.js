/**
 * @file
 * Alert.
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Alert.
 *
 * @param message.
 *   The message to be displayed in the alert.
 * @param variant
 *
 * @return {*}
 * @constructor
 */
const Alert = ({ message, variant }) => {
    const classes = `alert alert-${variant ? variant : 'danger'} m-5`;

    return (
        <div className={classes} role="alert">
            {message}
        </div>
    );
};

Alert.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
};

export default Alert;

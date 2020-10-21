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
 *
 * @return {*}
 * @constructor
 */
const Alert = ({ message }) => {
    return (
        <div className="alert alert-danger m-5" role="alert">
            {message}
        </div>
    );
};

Alert.propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
};

export default Alert;

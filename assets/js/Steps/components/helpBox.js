/**
 * @file
 *
 * @TODO: Describe what it is used for.
 * @TODO: Missing tests.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * HelpBox.
 *
 * @param text
 *   @TODO: Describe prop.
 * @return {*}
 * @constructor
 */
function HelpBox({ text }) {
    return (
        <div className="help-box">
            <div className="header">
                <span className="icon-helpbox">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
                <span>Hjælp</span>
                <p>{text}</p>
            </div>
        </div>
    );
}

HelpBox.propTypes = {
    text: PropTypes.string.isRequired
};

export default HelpBox;

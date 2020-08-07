/**
 * @file
 *
 * @TODO: Describe what it is used for.
 * @TODO: Missing tests.
 */

import React from 'react';
import PropTypes from 'prop-types';
import IconBubble from './iconBubble';

/**
 * Header.
 *
 * @param header
 *   @TODO: Describe prop.
 * @param text
 *   @TODO: Describe prop.
 * @return {*}
 * @constructor
 */
function Header({ header, text }) {
    return (
        <div className="row">
            <IconBubble></IconBubble>
            <div className="col-md-10">
                <div className="header">{header}</div>
                <div className="sub-header">{text}</div>
            </div>
        </div>
    );
}

Header.propTypes = {
    header: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};
export default Header;

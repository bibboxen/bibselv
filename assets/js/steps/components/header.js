/**
 * @file
 *
 * To display the header with icon in the different components.
 */

import React from 'react';
import PropTypes from 'prop-types';
import IconBubble from './icon-bubble';

/**
 * Header.
 *
 * @param header
 *   Header text.
 * @param subheader
 *   Subheader subheader.
 * @param which
 *   Which header.
 * @param icon
 *   Icon.
 * @return {*}
 * @constructor
 */
function Header({ header, subheader, which, icon }) {
    return (
        <div className='row'>
            <IconBubble which={which} icon={icon} />
            <div className='col-md-10'>
                <div className='header'>{header}</div>
                <div className='sub-header'>{subheader}</div>
            </div>
        </div>
    );
}

Header.propTypes = {
    header: PropTypes.string.isRequired,
    subheader: PropTypes.string.isRequired,
    which: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired
};

export default Header;

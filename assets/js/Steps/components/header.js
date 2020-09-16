/**
 * @file
 *
 * To display the header with icon in the different components. 
 */

import React from 'react';
import PropTypes from 'prop-types';
import IconBubble from './IconBubble';

/**
 * Header.
 *
 * @param header
 *   Header text.
 * @param subheader
 *   Subheader subheader.
 * @return {*}
 * @constructor
 */
function Header({ header, subheader, which, icon }) {
    return (
        <div className='row'>
            <IconBubble which={which} icon={icon}></IconBubble>
            <div className='col-md-10'>
                <div className='header'>{header}</div>
                <div className='sub-header'>{subheader}</div>
            </div>
        </div>
    );
}

Header.propTypes = {
    header: PropTypes.string.isRequired,
    subheader: PropTypes.string.isRequired
};
export default Header;

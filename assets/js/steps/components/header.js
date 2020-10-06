/**
 * @file
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
 *   If the header has an icon, this is it.
 * @param img
 *   If the heaßder has an img, this is it.
 * @return {*}
 * @constructor
 */
function Header({ header, subheader, which, icon, img }) {
    return (
        <>
            <div className='col-md-1'>
                <IconBubble which={which} icon={icon} img={img} />
            </div>
            <div className='col-md-8'>
                <div className='header'>{header}</div>
                <div className='subheader'>{subheader}</div>
            </div>
        </>
    );
}

Header.propTypes = {
    header: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    subheader: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    which: PropTypes.string.isRequired,
    icon: PropTypes.object,
    img: PropTypes.string
};

export default Header;

/**
 * @file
 * BannerList component.
 *
 * Displays a list of items with the banner component and with optional header.
 */

import React from 'react';
import Banner from './Banner';
import PropTypes from 'prop-types';

/**
 * BannerList.
 *
 * @param items
 *   List of items to be displayed.
 * @param title
 *   Title for the list. 
 * @return {*}
 * @constructor
 */
function BannerList({ items, title }) {
    return (
        <>
            {title && (
                <div className='banner-list-header'>
                    {title}
                    {items && <div className='counter'>{items.length}</div>}
                </div>
            )}
            {items && items.map((item) => (
                <Banner item={item} key={item.id || item.itemIdentifier} />
            ))}
        </>
    );
}
BannerList.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string,
};

export default BannerList;

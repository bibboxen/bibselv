/**
 * @file
 * BannerList component.
 *
 * Displays a list of items with the banner component and with optional header.
 */

import React from 'react';
import Banner from './banner';
import PropTypes from 'prop-types';

/**
 * BannerList.
 *
 * @param items
 *   List of items to be displayed.
 * @param title
 *   Title for the list.
 * @param visibleOnPrint
 *   Visible on print.
 *
 * @return {*}
 * @constructor
 */
function BannerList({ items, title, visibleOnPrint }) {
    const sortedItems = [].concat(items)
        .sort((a, b) => a.timestamp < b.timestamp ? 1 : -1);

    return (
        <>
            {title && (
                <div className='banner-list-header'>
                    {title}
                    {items && <div className='counter'>{items.length}</div>}
                </div>
            )}
            {sortedItems && sortedItems.map((item) => (
                <Banner item={item} key={item.id || item.itemIdentifier} visibleOnPrint={visibleOnPrint} />
            ))}
        </>
    );
}
BannerList.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    visibleOnPrint: PropTypes.bool
};

export default BannerList;

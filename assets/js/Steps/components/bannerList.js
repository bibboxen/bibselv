/**
 * @file
 * BannerList component.
 *
 * @TODO: Describe what it is used for.
 * @TODO: Missing tests.
 */

import React from 'react';
import Banner from './banner';
import PropTypes from 'prop-types';

/**
 * BannerList.
 *
 * @param items
 *   @TODO: Describe prop.
 * @param title
 *   @TODO: Describe prop.
 * @return {*}
 * @constructor
 */
function BannerList({ items, title }) {
    /**
     * Sort function for item statuses.
     *
     * @param a
     *   First item status.
     * @param b
     *   Second item status.
     * @return {number}
     */
    function itemSort(a, b) {
        if (a.status > b.status) {
            return -1;
        }

        if (a.status < b.status) {
            return 1;
        }

        return 0;
    }

    items.reverse();
    items.sort(itemSort);

    return (
        <>
            {title && (
                <div className="banner-list-header">
                    {title} <div className="counter">{items.length}</div>
                </div>
            )}
            {items.map((item) => (
                <Banner item={item} key={item.id || item.itemIdentifier} />
            ))}
        </>
    );
}
BannerList.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string
};

export default BannerList;

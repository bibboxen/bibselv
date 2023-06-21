/**
 * @file
 * BannerList component.
 *
 * Displays a list of items with the banner component and with optional header.
 */

import React from "react";
import Banner from "./Banner";
import PropTypes from "prop-types";

/**
 * BannerList.
 *
 * @param items
 *   List of items to be displayed.
 * @param title
 *   Title for the list.
 * @param visibleOnPrint
 *   Visible on print.
 * @param numberOfItems
 *   Number of items. Will be inferred from items.length, if not set.
 * @param children
 *   Children
 *
 * @return {*}
 * @constructor
 */
function BannerList({ items, title, visibleOnPrint, numberOfItems, children }) {
  return (
    <>
      {title && (
        <div className="banner-list-header" data-cy="banner-list-header">
          {title}
          {(items || numberOfItems > 0) && (
            <div className="counter">{numberOfItems || items.length}</div>
          )}
        </div>
      )}
      {children}
      {items &&
        items.map((item) => (
          <Banner
            item={item}
            key={item.id || item.itemIdentifier}
            visibleOnPrint={visibleOnPrint}
          />
        ))}
    </>
  );
}
BannerList.propTypes = {
  items: PropTypes.array,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.ReactNode,
  numberOfItems: PropTypes.number,
  visibleOnPrint: PropTypes.bool,
};

export default BannerList;

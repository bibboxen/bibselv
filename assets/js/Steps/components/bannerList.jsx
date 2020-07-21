import React, { useContext, useState } from "react";
import Banner from "./banner";
import PropTypes from "prop-types";

function BannerList({ items, title }) {
  function compare(a, b) {
    if (a.status.status > b.status.status) {
      return -1;
    }
    if (a.status.status < b.status.status) {
      return 1;
    }
    return 0;
  }

  items.reverse();
  items.sort(compare);
  return (
    <>
      {title && (
        <div className="banner-list-header">
          {title} <div className="counter">{items.length}</div>
        </div>
      )}
      {items.map((book) => (
        <Banner
          status={book.status}
          key={book.barcodeNumber}
          text={`${book.bookTitle} af ${book.writer}`}
        ></Banner>
      ))}
    </>
  );
}
BannerList.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string,
};

export default BannerList;

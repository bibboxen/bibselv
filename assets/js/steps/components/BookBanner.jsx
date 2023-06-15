/**
 * @file
 * BookBanner component.
 *
 * Displays a book banner (error, inprogress, neutral or success).
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import BookStatus from "../utils/BookStatus";
import {
  BookBannerByAuthor,
  BookBannerWithoutAuthor,
} from "../utils/formatted-messages";

/**
 * BookBanner.
 *
 * @param item
 *   Item to be displayed by the banner components
 *
 * @return {*}
 * @constructor
 */
function BookBanner({ item }) {
  const classes = ["book-banner"];

  let { author, title, status, id } = item;
  let icon = null;

  switch (status) {
    case BookStatus.ERROR:
    case BookStatus.RESERVED:
      classes.push("danger");
      icon = faExclamationTriangle;
      break;
    case BookStatus.IN_PROGRESS:
      icon = faSpinner;
      title = `${id}`;
      break;
    case BookStatus.RENEWED:
    case BookStatus.CHECKED_OUT:
    case BookStatus.CHECKED_IN:
    case BookStatus.SUCCESS:
      classes.push("success");
      icon = faCheck;
      break;
  }

  const classNames = classes.join(" ");

  return (
    <div className={classNames} data-cy="book-banner">
      {icon && <FontAwesomeIcon icon={icon} className="icon mr-2 mt-1" />}
      <div className="body">
        {title && <div className="title">{title}</div>}
        {author && <div className="author">{BookBannerByAuthor(author)}</div>}
        {!author && <div className="author">{BookBannerWithoutAuthor}</div>}
      </div>
    </div>
  );
}

BookBanner.propTypes = {
  item: PropTypes.object.isRequired,
};

export default BookBanner;

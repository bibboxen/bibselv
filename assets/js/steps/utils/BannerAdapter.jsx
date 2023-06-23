/**
 * @file
 * BannerAdapter adapts the different book types to the banner.
 *
 */

import BookStatus from "./book-status";
import {
  BannerAdapterFetchingInfo,
  BannerTitleAuthor,
} from "./formatted-messages";

/**
 * Adapts books from state machine to the banner component from checkinitems
 * or checkoutitems, where they are sent with a status.
 *
 * @param listOfBooks
 * @param reservedMaterialInstruction
 * @return {[]}
 */
export function adaptListOfBooksToBanner(
  listOfBooks,
  reservedMaterialInstruction
) {
  const items = [];

  listOfBooks.forEach((book) => {
    const displayInfo = {
      ...book,
      text:
        book.title && book.author
          ? BannerTitleAuthor(book.title, book.author)
          : "",
    };
    switch (book.status) {
      case BookStatus.ERROR:
        displayInfo.title = book.message;
        break;
      case BookStatus.IN_PROGRESS:
        displayInfo.title = BannerAdapterFetchingInfo;
        displayInfo.text = book.itemIdentifier;
        break;
      case BookStatus.CHECKED_IN:
      case BookStatus.CHECKED_OUT:
      case BookStatus.RENEWED:
        if (book.author) {
          displayInfo.text = BannerTitleAuthor(book.title, book.author);
        }
        if (book.reservedByOtherUser) {
          displayInfo.status = BookStatus.RESERVED;
          displayInfo.title = reservedMaterialInstruction || book.message;
        }
        break;
    }

    items.push(displayInfo);
  });
  return items;
}

/**
 * Adapts books from state machine to the banner component in status
 * where they are not sent with a status.
 *
 * @param listOfBooks
 * @param status
 * @param title
 * @return {[]}
 */
export function adaptListOfBooks(listOfBooks, status, title) {
  const items = [];
  listOfBooks.forEach((book) => {
    const displayInfo = { ...book };
    displayInfo.status = status || null;
    displayInfo.title = title || book.title;
    displayInfo.text = book.author ? BannerTitleAuthor("", book.author) : "";
    items.push(displayInfo);
  });
  return items;
}

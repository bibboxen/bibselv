/**
 * @file
 * BannerAdapter adapts the different book types to the banner.
 *
 */

import BookStatus from './book-status';

/**
 * Adapts books from state machine to the banner component from checkinitems
 * or checkoutitems, where they are sent with a status.
 *
 * @param listOfBooks
 * @return {[]}
 */
export function adaptListOfBooksToBanner(listOfBooks) {
    const items = [];
    listOfBooks.forEach((book) => {
        const displayInfo = { ...book };
        switch (book.status) {
            case BookStatus.ERROR:
                displayInfo.title = book.message;
                displayInfo.text = `${book.title} af ${book.author}`;
                break;
            case BookStatus.IN_PROGRESS:
                displayInfo.title = 'Henter informationer';
                displayInfo.text = book.itemIdentifier;
                break;
            case BookStatus.CHECKED_IN:
            case BookStatus.CHECKED_OUT:
            case BookStatus.RENEWED:
                displayInfo.title = book.title;
                displayInfo.text = '';
                if (book.author) {
                    displayInfo.text = `af ${book.author}`;
                }
                if (book.message === 'Reserveret') {
                    displayInfo.status = BookStatus.RESERVED;
                    displayInfo.title = book.message;
                    displayInfo.text = book.title;
                }
                break;
        }

        items.push(displayInfo);
    });
    return items;
}

/**
 * Adapts books from state machine with message to the banner component.
 *
 * @param listOfBooks
 * @return {[]}
 */
export function adaptListOfBooksWithMessage(listOfBooks, message) {
    const items = [];
    listOfBooks.forEach((book) => {
        const displayInfo = { ...book };
        displayInfo.title = message || book.message;
        displayInfo.text = `${book.title} af ${book.author}`;
        items.push(displayInfo);
    });
    return items;
}

/**
 * Adapts books from state machine to the banner component in status
 * where they are not sent with a status.
 *
 * @param listOfBooks
 * @return {[]}
 */
export function adaptListOfBooks(listOfBooks, status) {
    const items = [];
    listOfBooks.forEach((book) => {
        const displayInfo = { ...book };
        if (status) {
            displayInfo.status = status;
        }
        displayInfo.text = `af ${book.author}`;
        items.push(displayInfo);
    });
    return items;
}

/**
 * Adapts books from state machine with success (green banner) to the banner component.
 *
 * @param listOfBooks
 * @return {[]}
 */
export function adaptListOfBooksWithSuccess(listOfBooks) {
    return adaptListOfBooks(listOfBooks, BookStatus.SUCCESS);
}

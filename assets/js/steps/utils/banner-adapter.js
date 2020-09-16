/**
 * @file
 * BannerAdapter adapts the different book types to the banner.
 *
 */

import bookStatus from '../components/book-status';

export function adaptListOfBooksToBanner(listOfBooks) {
    const items = [];
    listOfBooks.forEach((book) => {
        const displayInfo = { ...book };
        switch (book.status) {
            case bookStatus.ERROR:
                displayInfo.title = book.message;
                displayInfo.text = `${book.title} af ${book.author}`;
                break;
            case bookStatus.IN_PROGRESS:
                displayInfo.title = 'Henter informationer';
                displayInfo.text = book.itemIdentifier;
                break;
            case bookStatus.CHECKED_IN:
            case bookStatus.CHECKED_OUT:
                displayInfo.title = book.title;
                displayInfo.text = '';
                if (book.author) {
                    displayInfo.text = `af ${book.author}`;
                }
                break;
        }

        items.push(displayInfo);
    });
    return items;
}

export function adaptListOfBooksWithError(listOfBooks) {
    const items = [];
    listOfBooks.forEach((book) => {
        const displayInfo = { ...book };
        displayInfo.title = book.message;
        displayInfo.text = `${book.title} af ${book.author}`;
        items.push(displayInfo);
    });
    return items;
}

export function adaptListOfBooks(listOfBooks) {
    const items = [];
    listOfBooks.forEach((book) => {
        const displayInfo = { ...book };
        displayInfo.text = `af ${book.author}`;
        items.push(displayInfo);
    });
    return items;
}

export function adaptListOfBooksWithSuccess(listOfBooks) {
    const items = [];
    listOfBooks.forEach((book) => {
        const displayInfo = { ...book };
        displayInfo.status = bookStatus.SUCCESS;
        displayInfo.text = `af ${book.author}`;
        items.push(displayInfo);
    });
    return items;
}

/**
 * @file
 *
 * Print of book.
 */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Print.
 *
 * @param book
 *   The book to print.
 * @return {*}
 * @constructor
 */
function Print({ book }) {
    /**
     * Print on load
     */
    useEffect(() => {
        // window.print();
    }, []);

    return (
        <div key={book.title} className='flex-column visible-on-print'>
            <div>{book.message}</div>
            <div>{book.title}</div>
        </div>
    );
}

Print.propTypes = {
    book: PropTypes.object.isRequired
};

export default Print;

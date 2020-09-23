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
        console.log('sdf');
        window.print();
    }, []);
    console.log('sdfsdfsdf');
    return (
        <div key={book.text} className='flex-column visible-on-print'>
            <div>{book.title}</div>
            <div>{book.text}</div>
        </div>
    );
}

Print.propTypes = {
    book: PropTypes.object.isRequired
};

export default Print;

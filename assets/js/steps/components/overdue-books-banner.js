/**
 * @file
 * OverdueBooksBanner component.
 *
 * Displays a banner with items that are overdue.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BookStatus from '../utils/book-status';
import {
    faCheck,
    faSpinner,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import {StatusBannerHeaderOverdueBook, StatusBannerHeaderOverdueBooks} from "../utils/formatted-messages";

/**
 * OverdueBookBanner.
 *
 * @param item
 *   Item to be displayed by the banner components
 * @param visibleOnPrint
 *   Display on print output?
 *
 * @return {*}
 * @constructor
 */
function OverdueBooksBanner({ items, visibleOnPrint = false }) {
    let classes = ['overdue-books-banner', 'danger'];

    let icon = faExclamationTriangle;

    if (visibleOnPrint) {
        //classes.push('visible-on-print');
    }

    const classNames = classes.join(' ');

    return (
        <div className={classNames}>
            <div className={'top'}>
                <span className={'header'}>
                    {icon && <FontAwesomeIcon icon={icon} size={'lg'} className={'mr-2'} />}
                    {items.length} {StatusBannerHeaderOverdueBooks}
                </span>
            </div>
            <div className={'items mt-2'}>
                {items && items.map((item) => (
                    <div className={'item mb-2'} key={'overdueItem' + (item.id || item.itemIdentifier)}>
                        {item.title && <div className='title'>{item.title}</div>}
                        {item.author &&
                        <span className='author'>Af {item.author}</span>
                        }
                        {!item.author &&
                        <span className='author'>Uden forfatter</span>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
}

OverdueBooksBanner.propTypes = {
    items: PropTypes.array.isRequired,
    visibleOnPrint: PropTypes.bool
};

export default OverdueBooksBanner;
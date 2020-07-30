import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bookStatus from './bookStatus';
import {
    faCheck,
    faSpinner,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
function Banner({ item }) {
    let classes = 'banner ';
    let icon = '';
    let title = item.title;
    let text = `af ${item.writer}`;
    switch (item.status) {
    case bookStatus.OVERDUE:
    case bookStatus.RESERVED_FOR_SOMEONE_ELSE:
        classes += 'danger';
        icon = faExclamationTriangle;
        title = bookStatus.OVERDUE
            ? 'Skal afleveres'
            : 'Denne bog er reserveret til en anden';
        text = `${item.title} af ${item.writer}`;
        break;
    case bookStatus.WAITING_FOR_INFO:
        icon = faSpinner;
        title = 'Afventer informationer';
        text = `${item.title} af ${item.writer}`;
        break;
    case bookStatus.READY_FOR_PICKUP:
    case bookStatus.HANDED_IN:
    case bookStatus.LOANED:
        classes = 'banner success';
        icon = faCheck;
        break;
    }

    return (
        <div className={classes}>
            {icon && (
                <div className="banner-icon">
                    <FontAwesomeIcon icon={icon} />
                </div>
            )}
            <div className="d-flex flex-column">
                <div className="header">{title}</div>
                <div>{text}</div>
            </div>
        </div>
    );
}
Banner.propTypes = {
    item: PropTypes.object.isRequired
};

export default Banner;

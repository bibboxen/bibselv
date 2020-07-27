import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import bookStatus from './bookStatus';
import {
    faCheck,
    faSpinner,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
function Banner({ title, text, status }) {
    let classes = 'banner ';
    let icon;
    if (status === bookStatus.OVERDUE || status === bookStatus.RESERVED_FOR_SOMEONE_ELSE) {
        classes += 'danger';
        icon = faExclamationTriangle;
    } else if (status === bookStatus.WAITING_FOR_INFO) {
        icon = faSpinner;
    } else if (status === bookStatus.READY_FOR_PICKUP || status === bookStatus.HANDED_IN) {
        classes += 'success';
        icon = faCheck;
    }
    return (
        <div className={classes}>
            {icon && (
                <div className="banner-icon">
                    <FontAwesomeIcon icon={icon} />
                </div>
            )}
            <div className="flex-container">
                <div className="header">{title}</div>
                <div>{text}</div>
            </div>
        </div>
    );
}
Banner.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired
};

export default Banner;

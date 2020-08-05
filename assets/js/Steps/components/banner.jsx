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
    let text = `af ${item.author}`;
    switch (item.status) {
    case bookStatus.ERROR:
    case bookStatus.BORROWED:
        classes += 'danger';
        icon = faExclamationTriangle;
        title = item.message;
        if (!item.renewelOk){
            title="Denne titel er reserveret til en anden"
        }
        text = `${item.title} af ${item.author}`;
        break;
    case bookStatus.IN_PROGRESS:
        icon = faSpinner;
        title = 'Afventer informationer';
        text = `${item.itemIdentifier}`;
        break;
    case bookStatus.RENEWED:
        classes = 'banner success';
        icon = faCheck;
        break;
    }

    return (
        <div className={classes}>
            {icon && (
                <div className="icon">
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

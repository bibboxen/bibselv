/**
 * @file
 * An input field component
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FormattedMessage } from 'react-intl';

/**
 * Input.
 *
 * @param name
 *   Name of the input, used for id as well.
 * @param label
 *   The label of the input.
 * @param value
 *   The value of the input.
 * @param activeBanner
 *   Determines if the banner is active.
 * @param rest
 *   Remaining attributes
 * @return {*}
 * @constructor
 */
const Input = ({ name, label, value, activeBanner = false, ...rest }) => {
    const cssClass = activeBanner ? 'input info' : 'input';

    return (
        <div className={cssClass}>
            <label htmlFor={name}>{label}</label>
            <input name={name} id={name} type='text' value={value} autoFocus {...rest} />
            {activeBanner && (
                <div className='info-banner'>
                    <span className='info-banner-icon'>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <FormattedMessage id='book-is-registered' defaultMessage='The book has been registered. Ready for the next one' />
                </div>
            )}
        </div>
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ]),
    value: PropTypes.string.isRequired,
    activeBanner: PropTypes.bool.isRequired,
    rest: PropTypes.object
};

export default Input;

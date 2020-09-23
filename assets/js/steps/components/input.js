/**
 * @file
 * An input field component
 */

import React from 'react';
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
 * @param which
 *   Which determines whether the info bar should be shown, and which color it should have.
 * @param rest
 *   Remaining attributes
 * @return {*}
 * @constructor
 */
const Input = ({ name, label, value, readOnly, which, ...rest }) => {
    let cssClass = 'input';
    if (which && value) {
        cssClass =
            which.toLowerCase() === 'checkoutitems'
                ? `info ${cssClass}`
                : `${cssClass} info purple`;
    }
    return (
        <div className={cssClass}>
            <label htmlFor={name}>{label}</label>
            <input value={value} readOnly={readOnly} name={name} id={name} type='text' {...rest} />
            {value && which && (
                <div className='info-banner'>
                    <span className='info-banner-icon'>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <FormattedMessage id='book-is-registered' defaultMessage='Bogen blev registreret. Klar til næste' />
                </div>
            )}
        </div>
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    which: PropTypes.string
};

export default Input;

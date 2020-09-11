/**
 * @file
 *
 * An input field component
 */

import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

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
 * @return {*}
 * @constructor
 */
const Input = ({ name, label, value, which }) => {
    let classes = "input";
    if (which) {
        classes =
            which.toLowerCase() === "checkoutitems"
                ? `info ${classes}`
                : `${classes} info purple`;
    }
    return (
        <div className={classes}>
            <label htmlFor={name}>{label}</label>
            <input value={value} name={name} id={name} type="text" />
            {value && which && (
                <div className="info-banner">
                    <span className="info-banner-icon">
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    Bogen blev registreret. Klar til næste
                </div>
            )}
        </div>
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    which: PropTypes.string,
};
export default Input;

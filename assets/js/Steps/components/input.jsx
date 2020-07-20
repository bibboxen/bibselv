import React from "react";
import PropTypes from "prop-types";

const Input = ({ name, label, error, ...rest }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} type={name} />
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.array,
};
export default Input;

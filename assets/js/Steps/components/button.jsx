import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = ({ label, color, icon, handleButtonPress, ...rest }) => {
  let classes = `button ${color}`;

  return (
    <button onClick={() => handleButtonPress({  })} className={classes} type="button">
      {label}
      <span className="icon">
        <FontAwesomeIcon icon={icon} />
      </span>
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  handleButtonPress: PropTypes.func.isRequired,
};
export default Button;

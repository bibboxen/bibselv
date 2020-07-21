import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import MachineStateContext from "../../context/machineStateContext";

const Input = ({ name, label, error, info, ...rest }) => {
  const context = useContext(MachineStateContext);
  let classes = info ? `input info` : `input`;
  classes =
    context.step.get === "borrow" ? `${classes}` : `${classes} purple`;
  return (
    <div className={classes}>
      <label htmlFor={name}>{label}</label>
      <input {...rest} name={name} id={name} type={name} />
      {info && (
        <div className="info-banner">
          <span className="info-banner-icon">
            <FontAwesomeIcon icon={faCheck} />
          </span>
          {info}
        </div>
      )}
    </div>
  );
};

Input.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.array,
};
export default Input;

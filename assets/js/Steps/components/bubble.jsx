import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MachineStateContext from "../../context/machineStateContext";

function Bubble({ color, which, label, icon, actionHandler }) {
  let classes = `bubble ${color}`;
  const context = useContext(MachineStateContext);
  return (
    <div className={classes} onClick={() => context.step.set(which)}>
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      {label}
    </div>
  );
}
Bubble.propTypes = {
  color: PropTypes.string.isRequired,
  which: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
};

export default Bubble;

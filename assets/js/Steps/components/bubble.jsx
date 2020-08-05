import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Bubble({ which, label, icon, actionHandler }) {
  const classes = `bubble ${which}`;
  return (
    <div
      className={classes}
      onClick={() => actionHandler("enterFlow", { flow: which })}
    >
      <div className="inner-bubble">
        <div className="text-and-icon">
          <div className="icon">
            <FontAwesomeIcon icon={icon} />
          </div>
          {label}
        </div>
      </div>
    </div>
  );
}
Bubble.propTypes = {
  which: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  actionHandler: PropTypes.func.isRequired,
};

export default Bubble;

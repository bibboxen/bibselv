import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MachineStateContext from "../../context/machineStateContext";
import "../../../scss/helpBox.scss";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
function HelpBox({ text }) {
  return (
    <div className="help-box">
      <div className="header">
        <span className="icon-helpbox">
          <FontAwesomeIcon icon={faQuestionCircle} />
        </span>
        <span>Hjælp</span>
        <p>{text}</p>
      </div>
    </div>
  );
}

HelpBox.propTypes = {
    text: PropTypes.string.isRequired,
  };
  
export default HelpBox;

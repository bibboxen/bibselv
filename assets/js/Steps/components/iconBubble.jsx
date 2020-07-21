import React, { useContext } from "react";
import MachineStateContext from "../../context/machineStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookReader,
  faInfoCircle,
  faBook,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../../../scss/icon-bubble.scss";

function IconBubble() {
  const context = useContext(MachineStateContext);
  function renderStep(step) {
    if (context.loggedIn.get) {
      switch (step) {
        case "borrow":
          return (
            <div className="header-icon yellow">
              <FontAwesomeIcon icon={faBookReader} />
            </div>
          );
        case "handin":
          return (
            <div className="header-icon purple">
              <FontAwesomeIcon icon={faBook} />
            </div>
          );
        case "status":
          return (
            <div className="header-icon blue">
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
          );
      }
    } else {
      return (
        <div className="header-icon">
          <FontAwesomeIcon icon={faSignInAlt} />
        </div>
      );
    }
  }

  return <>{renderStep(context.step.get)}</>;
}

export default IconBubble;

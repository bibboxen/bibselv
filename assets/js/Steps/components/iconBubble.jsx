import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MachineStateContext from "../../context/machineStateContext";
import "../../../scss/icon-bubble.scss";
import {
  faBookReader,
  faInfoCircle,
  faBook,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
function IconBubble() {
  const context = useContext(MachineStateContext);
  function renderStep(step) {
    if (context.loggedIn.get) {
      switch (step) {
        case "borrow":
          return <></>;
        case "handin":
          return <></>;
        case "status":
          return <></>;
      }
    } else {
      return (
        <div className="login-icon">
          <FontAwesomeIcon icon={faSignInAlt} />
        </div>
      );
    }
  }


  return <>{renderStep(context.step.get)}</>;
}

export default IconBubble;

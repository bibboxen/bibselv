import React, { useContext } from "react";
import MachineStateContext from "../../context/machineStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookReader,
  faInfoCircle,
  faBook,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";

function IconBubble() {
  const context = useContext(MachineStateContext);
  function renderStep() {
    switch (context.machineState.get.step.toLowerCase()) {
      case "checkoutitems":
        return (
          <div className="header-icon checkoutitems">
            <div className="icon">
              <FontAwesomeIcon icon={faBookReader} />
            </div>
          </div>
        );
      case "checkinitems":
        return (
          <div className="header-icon checkinitems">
            <div className="icon">
              <FontAwesomeIcon icon={faBook} />
            </div>
          </div>
        );
      case "status":
        return (
          <div className="header-icon status">
            <div className="icon">
              <FontAwesomeIcon icon={faInfoCircle} />
            </div>
          </div>
        );
      default:
        return(
        <div className="header-icon login">
          <div className="icon">
            <FontAwesomeIcon icon={faSignInAlt} />
          </div>
        </div>);
    }
  }
  return <div className="col-md-2">{renderStep()}</div>;
}

export default IconBubble;

/**
 * @file
 * The navbar is the navigation bar in the top.
 */

import React, { useContext } from "react";
import Button from "./Button";
import MachineStateContext from "../utils/MachineStateContext";
import {
  faInfoCircle,
  faPlayCircle,
  faStopCircle,
  faBug,
  faBirthdayCake,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  NavbarButtonCheckOut,
  NavbarButtonStatus,
  NavbarButtonCheckIn,
  NavbarButtonFinish,
  NavbarButtonReset,
  NavbarStopLoginSession,
  NavbarStartLoginSession,
} from "../utils/formatted-messages";
import CheckInIconWhite from "../../../scss/images/check-in-white.svg";
import CheckOutIconBlack from "../../../scss/images/check-out-black.svg";
import { CONNECTION_OFFLINE, CONNECTION_ONLINE } from "../../constants";

/**
 * NavBar.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function NavBar({ actionHandler }) {
  const {
    connectionState,
    boxConfig: {
      loginSessionEnabled,
      school,
      loginSessionMethods,
      debugEnabled,
    },
    machineState: { step, activeLoginSession, user },
  } = useContext(MachineStateContext);

  const classes = step === "initial" ? "navbar initial" : "navbar";
  const components = [
    {
      additionalClass: "check-out-items",
      data: { flow: "checkOutItems" },
      label: NavbarButtonCheckOut,
      img: CheckOutIconBlack,
    },
    {
      additionalClass:
        connectionState === CONNECTION_ONLINE ? "status" : "offline",
      data: { flow: "status" },
      disabled: connectionState === CONNECTION_OFFLINE,
      label: NavbarButtonStatus,
      icon: faInfoCircle,
    },
    {
      additionalClass: "check-in-items",
      data: { flow: "checkInItems" },
      label: NavbarButtonCheckIn,
      img: CheckInIconWhite,
    },
  ];

  const showStartLoginSessionButton =
    user?.isAdmin &&
    loginSessionEnabled &&
    loginSessionMethods?.length > 0 &&
    !activeLoginSession &&
    step !== "changeLoginMethod";

  /**
   * Stop login session.
   */
  function stopLoginSession() {
    actionHandler("stopLoginSession");
  }

  /**
   * Stop login session.
   */
  function startLoginSession() {
    actionHandler("startLoginSession");
  }

  return (
    <div className={classes} data-cy="navbar">
      <div className="text-container">
        <span className="text">{school.name}</span>
        {user && <span className="text bold">{user.name}</span>}
        {user?.birthdayToday && (
          <span className="birthday-icon">
            <FontAwesomeIcon icon={faBirthdayCake} />
          </span>
        )}
        {debugEnabled && (
          <span className="text bold">
            Debug mode!
            <FontAwesomeIcon
              icon={faBug}
              style={{ paddingLeft: "4px", color: "hotpink" }}
            />
          </span>
        )}
      </div>
      <div className="button-container">
        {showStartLoginSessionButton && (
          <Button
            onClick={startLoginSession}
            icon={faPlayCircle}
            label={NavbarStartLoginSession}
            className="button start-session"
          />
        )}
        {activeLoginSession && (
          <Button
            onClick={stopLoginSession}
            icon={faStopCircle}
            label={NavbarStopLoginSession}
            className="button stop-session"
          />
        )}
        {step !== "initial" && (
          <>
            {["status", "checkInItems", "checkOutItems"].includes(step) &&
              components.map(
                ({ additionalClass, label, icon, disabled, data, img }) => (
                  <Button
                    key={additionalClass}
                    data-cy={additionalClass}
                    label={label}
                    icon={icon}
                    disabled={disabled}
                    onClick={() => actionHandler("changeFlow", data)}
                    className={`button ${additionalClass}`}
                    img={img}
                  />
                )
              )}
          </>
        )}
        <Button
          label={step === "initial" ? NavbarButtonReset : NavbarButtonFinish}
          icon={faSignOutAlt}
          onClick={() => actionHandler("reset")}
          data-cy="logout"
          className="button logout"
        />
      </div>
    </div>
  );
}

NavBar.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default NavBar;

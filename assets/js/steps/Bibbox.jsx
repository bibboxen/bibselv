/**
 * @file
 * Contains main logic for loading steps.
 */

import React, { useEffect, useCallback, useContext } from "react";
import Initial from "./Initial";
import Status from "./Status";
import Alert from "./utils/Alert";
import CheckInItems from "./CheckInItems";
import NavBar from "./components/NavBar";
import CheckOutItems from "./CheckOutItems";
import PropTypes from "prop-types";
import MachineStateContext from "./utils/MachineStateContext";
import { Sound } from "./utils/sound";
import ChangeLoginMethod from "./ChangeLoginMethod";
import ScanLogin from "./login-components/scan-login";
import ScanPasswordLogin from "./login-components/scan-password-login";
import AzureADLogin from "./login-components/azure-ad-login";
import "../../scss/index.scss";

/**
 * Bibbox app.
 *
 * @param actionHandler
 *   Callback on requested state change.
 *
 * @return {*}
 * @constructor
 */
function Bibbox({ actionHandler }) {
  const {
    errorMessage,
    machineState: { step },
    boxConfig: { soundEnabled },
    user,
  } = useContext(MachineStateContext);

  /**
   * Play birthday music if user has birthday.
   */
  useEffect(() => {
    if (user === undefined || !soundEnabled) return;

    // @TODO: Add configuration option to disable birthday sound.
    const lastPlayed = window.localStorage.getItem(user.id);
    const lastPlayedDate = lastPlayed
      ? new Date(parseInt(lastPlayed))
      : undefined;
    const today = new Date();
    if (
      user.birthdayToday &&
      lastPlayedDate?.getFullYear() !== today.getFullYear()
    ) {
      window.localStorage.setItem(user.id, Date.now());
      new Sound().playSound("birthday");
    }
  }, [soundEnabled, user]);

  /**
   * renderStep determines which component to render based on the step
   * returned from the state machine.
   *
   * @param step
   *   The step from the machine state
   * @return component to be rendered
   */
  const renderStep = useCallback(
    (step) => {
      switch (step) {
        case "checkOutItems":
          return <CheckOutItems actionHandler={actionHandler} />;
        case "checkInItems":
          return <CheckInItems actionHandler={actionHandler} />;
        case "status":
          return <Status actionHandler={actionHandler} />;
        case "changeLoginMethod":
          return <ChangeLoginMethod actionHandler={actionHandler} />;
        case "loginAzureAD":
          return <AzureADLogin />;
        case "loginScanUsername":
          return <ScanLogin actionHandler={actionHandler} />;
        case "loginScanUsernamePassword":
          return <ScanPasswordLogin actionHandler={actionHandler} />;
        case "initial":
        default:
          return <Initial actionHandler={actionHandler} />;
      }
    },
    [actionHandler]
  );

  return (
    <>
      <NavBar actionHandler={actionHandler} />
      <div className="container">
        <div className="row" style={{ width: "100%" }}>
          <>
            {errorMessage && <Alert message={errorMessage} />}
            {!errorMessage && renderStep(step)}
          </>
        </div>
      </div>
    </>
  );
}

Bibbox.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default Bibbox;

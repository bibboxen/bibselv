/**
 * @file
 * Contains main logic for loading steps.
 */

import React, { useEffect } from "react";
import Initial from "./Initial";
import Status from "./status";
import Alert from "./utils/Alert";
import CheckInItems from "./CheckInItems";
import NavBar from "./components/navbar";
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
 * @param boxConfigurationInput
 *   The configuration of the bibbox.
 * @param machineStateInput
 *   The state of the app.
 * @param actionHandler
 *   Callback on requested state change.
 * @param connectionState
 *   Connection state.
 * @param errorMessage
 *   Message for displaying error
 *
 * @return {*}
 * @constructor
 */
function Bibbox({
  boxConfigurationInput,
  machineStateInput,
  actionHandler,
  connectionState,
  errorMessage,
}) {
  const sound = new Sound();
  const { user } = machineStateInput;

  /**
   * The storage contains the machine state.
   * The step of the machine state determines which component is rendered, and
   * can only be changed by the state machine.
   */
  const storage = {
    machineState: { get: machineStateInput },
    boxConfig: { get: boxConfigurationInput },
    connectionState: { get: connectionState },
  };

  /**
   * Play birthday music if user has birthday.
   */
  useEffect(() => {
    if (user === undefined || !boxConfigurationInput.soundEnabled) return;

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
      sound.playSound("birthday");
    }
  }, [user]);

  /**
   * renderStep determines which component to render based on the step
   * returned from the state machine.
   *
   * @param step
   *   The step from the machine state
   * @return component to be rendered
   */
  function renderStep(step) {
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
  }

  return (
    <MachineStateContext.Provider value={storage}>
      <NavBar actionHandler={actionHandler} />
      <div className="container">
        <div className="row" style={{ width: "100%" }}>
          <>
            {errorMessage && <Alert message={errorMessage} />}
            {!errorMessage && renderStep(machineStateInput.step ?? "")}
          </>
        </div>
      </div>
    </MachineStateContext.Provider>
  );
}

Bibbox.propTypes = {
  boxConfigurationInput: PropTypes.object.isRequired,
  machineStateInput: PropTypes.object.isRequired,
  connectionState: PropTypes.string.isRequired,
  actionHandler: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default Bibbox;

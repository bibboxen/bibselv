/**
 * @file
 * For users that log in with scanner.
 */

import React, { useEffect, useContext } from "react";
import BarcodeScanner from "../utils/barcode-scanner";
import PropTypes from "prop-types";
import Header from "../components/Header";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import MachineStateContext from "../utils/MachineStateContext";
import {
  ScanLoginHeader,
  ScanLoginSubheader,
} from "../utils/formatted-messages";
import BarcodeHandler from "../utils/barcode-handler";
import { ACTION_RESET, BARCODE_SCANNING_TIMEOUT } from "../../constants";
import BarcodeScannerIcon from "../../../scss/images/barcode-scanner.svg";

/**
 * Scan login component.
 *
 * Supplies a page for scanning login.
 *
 * @param actionHandler
 *  As the state can only be changed by the state machine, the actionHandler
 *  calls the state machine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function ScanLogin({ actionHandler }) {
  const {
    boxConfig: { barcodeTimeout },
  } = useContext(MachineStateContext);

  /**
   * Setup barcode scanner.
   */
  useEffect(() => {
    const barcodeScanner = new BarcodeScanner(
      barcodeTimeout || BARCODE_SCANNING_TIMEOUT
    );
    const barcodeCallback = new BarcodeHandler(
      [ACTION_RESET],
      actionHandler,
      function (result) {
        actionHandler("login", {
          username: result.outputCode,
          useDefaultPassword: true,
        });
      }
    ).createCallback();

    barcodeScanner.start(barcodeCallback);
    return () => {
      barcodeScanner.stop();
    };
    // todo, below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionHandler]);

  return (
    <>
      <Header
        header={ScanLoginHeader}
        subheader={ScanLoginSubheader}
        type="login"
        icon={faSignInAlt}
      />
      <div className="col-md-3" />
      <div className="col-md-1" />
      <div className="col-md-6">
        <div className="content">
          <img src={BarcodeScannerIcon} height={300} width={300} />
        </div>
      </div>
    </>
  );
}

ScanLogin.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default ScanLogin;

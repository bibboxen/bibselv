/**
 * @file
 * The initial page the user meets, from here they can go to other pages.
 */

import React, { useContext, useEffect } from "react";
import BarcodeScanner from "./utils/barcode-scanner";
import PropTypes from "prop-types";
import Bubble from "./components/Bubble";
import Barcode from "./components/Barcode";
import {
  ACTION_ENTER_FLOW_CHECKIN,
  ACTION_ENTER_FLOW_CHECKOUT,
  ACTION_ENTER_FLOW_STATUS,
  ACTION_RESET,
  BARCODE_SCANNING_TIMEOUT,
  CONNECTION_OFFLINE,
} from "../constants";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import {
  InitialButtonCheckOut,
  InitialButtonStatus,
  InitialButtonCheckIn,
  InitialHeader,
  StatusUnavailable,
  LoginLoginError,
} from "./utils/formatted-messages";
import BarcodeHandler from "./utils/barcode-handler";
import CheckInIconPurple from "../../scss/images/check-in-purple.svg";
import CheckOutYellow from "../../scss/images/check-out-yellow.svg";
import MachineStateContext from "./utils/MachineStateContext";
import Alert from "./utils/Alert";

/**
 * Initial component.
 *
 * Supplies a front page.
 *
 * @return {*}
 * @constructor
 */
function Initial({ actionHandler }) {
  const context = useContext(MachineStateContext);
  const activeLoginSession =
    context?.machineState?.get?.activeLoginSession ?? false;

  const components = [
    {
      type: "checkOutItems",
      label: InitialButtonCheckOut,
      img: CheckOutYellow,
    },
    {
      type: "status",
      label: InitialButtonStatus,
      disabled: context.connectionState?.get === CONNECTION_OFFLINE,
      icon: faInfoCircle,
    },
    {
      type: "checkInItems",
      label: InitialButtonCheckIn,
      img: CheckInIconPurple,
    },
  ];

  /**
   * Handle scanned items.
   *
   * @param scannedBarcode
   */
  function handleItemCheckIn(scannedBarcode) {
    actionHandler("enterFlow", {
      flow: "checkInItems",
      checkInItemOnEnter: scannedBarcode,
    });
  }

  // Setup barcode scanner.
  useEffect(() => {
    const barcodeScanner = new BarcodeScanner(
      context.boxConfig.get.barcodeTimeout || BARCODE_SCANNING_TIMEOUT
    );
    const barcodeCallback = new BarcodeHandler(
      actionHandler,
      [
        ACTION_ENTER_FLOW_CHECKIN,
        ACTION_ENTER_FLOW_CHECKOUT,
        ACTION_ENTER_FLOW_STATUS,
        ACTION_RESET,
      ],
      function (result) {
        // If hasFrontpageCheckIn enabled in the box configuration, go to checkIn flow and pass
        // the scanned items for instant check in.
        if (
          context.boxConfig?.get?.hasFrontpageCheckIn &&
          !activeLoginSession
        ) {
          handleItemCheckIn(result.code);
        }
      }
    ).createCallback();

    barcodeScanner.start(barcodeCallback);
    return () => {
      barcodeScanner.stop();
    };
  }, [actionHandler]);

  return (
    <div className="col-md-12">
      {!context?.machineState?.get?.processing && (
        <>
          <h1 className="mb-5" data-cy="header">
            {InitialHeader}
          </h1>
          <div className="row justify-content-center" data-cy="bubble-buttons">
            {components.map((component) => (
              <div key={component.type} className="col-md-3">
                <Bubble
                  type={component.type}
                  label={component.label}
                  icon={component.icon}
                  img={component.img}
                  disabled={component.disabled}
                  onClick={() =>
                    actionHandler("enterFlow", {
                      flow: component.type,
                    })
                  }
                />
              </div>
            ))}
          </div>
          <div className="row justify-content-center mt-5" data-cy="barcodes">
            {components.map((component) => (
              <div key={component.type} className="col-md-3">
                <Barcode
                  key={"barcode" + component.type}
                  type={component.type}
                  disabled={component.disabled}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {context.connectionState?.get === CONNECTION_OFFLINE && (
        <div>
          <Alert variant="warning" message={StatusUnavailable} />
        </div>
      )}
      {context.machineState?.get?.loginError && (
        <div>
          <Alert message={LoginLoginError} />
        </div>
      )}
    </div>
  );
}

Initial.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default Initial;

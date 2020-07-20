import React, { useEffect } from "react";
import BarcodeScanner from "./BarcodeScanner";
import PropTypes from "prop-types";
import "../../scss/initial.scss";

function Status({ actionHandler }) {
  const COMMAND_LENGTH = 5;
  
  useEffect(() => {
    const barcodeScanner = new BarcodeScanner(400);

    const barcodeCallback = (code) => {
      if (code.length <= COMMAND_LENGTH) {
        if (code === "03009") {
          actionHandler("enterFlow", {
            flow: "borrow",
          });
        }
      }
    };

    barcodeScanner.start(barcodeCallback);
    return () => barcodeScanner.stop();
  }, [actionHandler]);

  return (
    <div className="container">
      <p className="library">Statusg</p>
    </div>
  );
}

Status.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default Status;

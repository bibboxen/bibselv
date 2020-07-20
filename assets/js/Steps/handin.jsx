import React, { useEffect } from "react";
import BarcodeScanner from "./BarcodeScanner";
import PropTypes from "prop-types";
import "../../scss/initial.scss";

function Handin({ actionHandler }) {
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
      <p className="library">Handing</p>
    </div>
  );
}

Handin.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default Handin;

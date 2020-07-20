import React, { useEffect,useContext } from "react";
import BarcodeScanner from "./BarcodeScanner";
import PropTypes from "prop-types";
import "../../scss/initial.scss";
import {
  faBookReader,
  faInfoCircle,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

import Bubble from "./components/bubble";
import Barcode from "./components/barcode";

function Initial() {

  const COMMAND_LENGTH = 5;
  const components = [
    {
      which: "borrow",
      color: "yellow",
      label: "Lån",
      icon: faBookReader,
    },
    {
      which: "status",
      color: "blue",
      label: "Status",
      icon: faInfoCircle,
    },
    { which: "handin", color: "purple", label: "Aflever", icon: faBook },
  ];
  // useEffect(() => {
  //   const barcodeScanner = new BarcodeScanner(400);

  //   const barcodeCallback = (code) => {
  //     if (code.length <= COMMAND_LENGTH) {
  //       if (code === "03009") {
  //         actionHandler("enterFlow", {
  //           flow: "borrow",
  //         });
  //       }
  //     }
  //   };

  //   barcodeScanner.start(barcodeCallback);
  //   return () => barcodeScanner.stop();
  // }, [actionHandler]);

  return (
    <>
      <h1>Vælg en funktion for at starte</h1>
      <div className="initial-container">
        {components.map((component) => (
          <Bubble
            key={component.which}
            which={component.which}
            color={component.color}
            label={component.label}
            icon={component.icon}
          />
        ))}
      </div>
      <div className="initial-container">
        {components.map((component) => (
          <Barcode key={component.color} color={component.color} />
        ))}
      </div>
    </>
  );
}

Initial.propTypes = {
  // actionHandler: PropTypes.func.isRequired,
};

export default Initial;

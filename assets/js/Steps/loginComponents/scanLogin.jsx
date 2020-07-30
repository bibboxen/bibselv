import React from "react";
import HelpBox from "../components/helpBox";
import Header from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode } from "@fortawesome/free-solid-svg-icons";

function ScanLogin() {
  return (
    <>
      <div className="col-md-9">
        <Header header="Login" text="Scan låner stregkode"></Header>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md mt-4">
            <div
              className="content"
              onClick={() => actionHandler("login", context)}
            >
              <FontAwesomeIcon icon={faBarcode} />
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <HelpBox
          text={"Brug håndscanneren til at scanne stregkoden på bogen."}
        ></HelpBox>
      </div>
    </>
  );
}

export default ScanLogin;

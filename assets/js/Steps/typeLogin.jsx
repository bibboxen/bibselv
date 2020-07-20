import React, { useContext, useState } from "react";
import MachineStateContext from "../context/machineStateContext";
import "../../scss/login.scss";
import Header from "./components/header";
import Input from "./components/input";
import HelpBox from "./components/helpBox";
import NumPad from "./components/numPad";
import Button from "./components/button";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";

function ScanLogin() {
  const [loanNumber, setLoanNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loanNumberEntering, setLoanNumberEntering] = useState(true);
  const context = useContext(MachineStateContext);
  function onNumPadPress({ button }) {
    if (loanNumberEntering) {
      button.toLowerCase() === "c"
        ? setLoanNumber("")
        : setLoanNumber(`${loanNumber}${button}`);
    } else {
      button.toLowerCase() === "c"
        ? setPassword("")
        : setPassword(`${password}${button}`);
    }
  }
  function onButtonPress() {
    if (loanNumberEntering) {
      setLoanNumberEntering(false);
    } else {
      // some validation
      context.loggedIn.set(true);
      context.username.set(loanNumber);
    }
  }
  return (
    <div className="flex-container-row">
      <div className="flex-container">
        <Header header="Login" text="Indtast lånernummer"></Header>
        <div className="content-with-numpad">
          {loanNumberEntering && (
            <Input
              name="loanNumber"
              label="Lånenummer"
              value={loanNumber}
              readOnly
            ></Input>
          )}
          {!loanNumberEntering && (
            <Input
              name="password"
              label="Password"
              value={password}
              readOnly
            ></Input>
          )}
          <NumPad handleNumpadPress={onNumPadPress}></NumPad>
        </div>
      </div>
      <div className="flex-container">
        <HelpBox
          text={"Indtast dit lånernummer med knapperne her på skærmen."}
        ></HelpBox>
        <Button
          label={"Fortsæt"}
          icon={faArrowAltCircleRight}
          handleButtonPress={onButtonPress}
          color="green"
        ></Button>
      </div>
    </div>
  );
}

// ScanLogin.propTypes = {
// };

export default ScanLogin;

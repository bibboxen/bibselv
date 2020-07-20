import React, { useContext } from "react";
import MachineStateContext from "../context/machineStateContext";
import ScanLogin from "./ScanLogin";
import TypeLogin from "./typeLogin";
import UniLogin from "./uniLogin";

function Login() {
  const context = useContext(MachineStateContext);

  function renderStep(loginConfig) {
    switch (loginConfig) {
      case "scan":
        return <ScanLogin></ScanLogin>;
      case "type":
        return <TypeLogin></TypeLogin>;
      case "uni":
        return <UniLogin></UniLogin>;
      default:
        return <span>Loginmetode er ikke konfigureret</span>;
    }
  }

  return <>{renderStep(context.loginConfig.get)}</>;
}

export default Login;

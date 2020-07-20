import React, { useContext } from "react";
import "../../../scss/navbar.scss";
import MachineStateContext from "../../context/machineStateContext";

function NavBar() {
  const context = useContext(MachineStateContext);
  let classes = context.step.get === "initial" ? "navbar initial" : "navbar";
  function login() {
    if (context.loggedIn.get) {
      context.username.set();
      context.loggedIn.set(false);
    } else {
      context.username.set("Rick Sanchez");
      context.loggedIn.set(true);
    }
  }
  return (
    <div className={classes}>
      Biblioteket{" "}
      {context.loggedIn && (
        <span className="username">{context.username.get}</span>
      )}
      <button onClick={() => login()}>Login logout</button>
    </div>
  );
}
NavBar.propTypes = {};

export default NavBar;

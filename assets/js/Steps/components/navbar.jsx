import React, { useContext } from "react";
import MachineStateContext from "../../context/machineStateContext";
import Button from "../components/button";
import {
  faBookReader,
  faInfoCircle,
  faBook,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
function NavBar({ actionHandler }) {
  const context = useContext(MachineStateContext);
  const classes = context.step.get === "initial" ? "navbar initial" : "navbar";

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
    { which: "logout", color: "red", label: "Afslut", icon: faSignOutAlt },
  ];

  function onButtonPress(which) {
    actionHandler(which, context);
  }

  return (
    <div className={classes}>
      <div className="text-container">
        <span className="text">{context.library.get}</span>
        {context.loggedIn && (
          <span className="text bold">{context.username.get}</span>
        )}
      </div>
      <div className="button-container">
        {context.loggedIn.get &&
          components.map((button) => (
            <Button
              key={button.which}
              label={button.label}
              icon={button.icon}
              handleButtonPress={onButtonPress}
              color={button.color}
              which={button.which}
            ></Button>
          ))}
      </div>
    </div>
  );
}
NavBar.propTypes = {
  actionHandler: PropTypes.func.isRequired,
};

export default NavBar;

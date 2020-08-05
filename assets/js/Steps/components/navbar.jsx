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
  const classes =
    context.machineState.get.step === "initial" ? "navbar initial" : "navbar";

  const components = [
    {
        which: "borrow",
        label: "Lån",
        icon: faBookReader,
    },
    {
        which: "status",
        label: "Status",
        icon: faInfoCircle,
    },
    {
        which: "returnMaterials",
        label: "Aflever",
        icon: faBook,
    }, {
        which: "logout",
        label: "Afslut",
        icon: faSignOutAlt,
    }
  ];

  function onButtonPress(which) {
    context.machineState.get.step = which
    context.machineState.get.flow = which
    context.machineState.set(context.machineState.get)
    debugger
    // actionHandler("enterFlow", { flow: which });
  }

  return (
    <div className={classes}>
      <div className="text-container">
        <span className="text">{context.library.get}</span>
        {context.machineState.get.user && (
          <span className="text bold">
            {context.machineState.get.user.name}
          </span>
        )}
      </div>
      <div className="button-container">
        {context.machineState.get.user &&
          components.map((button) => (
            <Button
              key={button.which}
              label={button.label}
              icon={button.icon}
              handleButtonPress={onButtonPress}
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

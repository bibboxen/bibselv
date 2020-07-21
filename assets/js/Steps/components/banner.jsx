import React, { useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MachineStateContext from "../../context/machineStateContext";
import "../../../scss/banner.scss";
import bannerStatus from "./bannerStatus";
import {
  faCheck,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
function Banner({ text, status }) {
  let classes = "banner ";
  let icon = {};
  if (status.status === bannerStatus.ERROR) {
    classes += "danger";
    icon = faExclamationTriangle;
  } else if (status.status === bannerStatus.WAITINGINFO) {
    icon = faSpinner;
  } else if (status.status === bannerStatus.SUCCESS) {
    classes += "success";
    icon = faCheck;
  }
  return (
    <div className={classes}>
      {icon && (
        <div className="banner-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
      <div className="flex-container">
        <div className="header">{status.bannerTitle}</div>
        <div>{text}</div>
      </div>
    </div>
  );
}
Banner.propTypes = {
  text: PropTypes.string.isRequired,
  status: PropTypes.object.isRequired,
};

export default Banner;

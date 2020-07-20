import React from "react";
import PropTypes from "prop-types";
import IconBubble from "./iconBubble";
import "../../../scss/header.scss";
function Header({ header, text }) {
  return (
    <div className="flex-container-row">
      <IconBubble></IconBubble>
      <div className="flex-container">
        <div className="header">{header}</div>
        <div className="sub-header">{text}</div>
      </div>
    </div>
  );
}

Header.propTypes = {
  header: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
export default Header;

/**
 * @file
 * To display the header with icon in the different components.
 */

import React from "react";
import PropTypes from "prop-types";
import IconBubble from "./IconBubble";

/**
 * Header.
 *
 * @param header
 *   Header text.
 * @param subheader
 *   Subheader subheader.
 * @param type
 *   type header.
 * @param icon
 *   Header icon.
 * @param img
 *   Header image.
 * @return {*}
 * @constructor
 */
function Header({ header, subheader, type, icon, img }) {
  return (
    <>
      <div className="col-md-1">
        <IconBubble type={type} icon={icon} img={img} />
      </div>
      <div className="col-md-8">
        <h1 data-cy="page-header" className="header">
          {header}
        </h1>
        {subheader && (
          <div data-cy="sub-header" className="subheader">
            {subheader}
          </div>
        )}
      </div>
    </>
  );
}

Header.propTypes = {
  header: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  subheader: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  type: PropTypes.string.isRequired,
  icon: PropTypes.object,
  img: PropTypes.string,
};

export default Header;

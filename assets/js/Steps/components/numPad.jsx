import React, { useContext } from "react";
import PropTypes from "prop-types";
function NumPad({ handleNumpadPress }) {
  let buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "#", "0", "C"];
  return (
    <div className="num-pad">
      {buttons.map((button) => (
        <div key={button} className="button-numpad" onClick={() => handleNumpadPress({ button })}>
          {button}
        </div>
      ))}
    </div>
  );
}

NumPad.propTypes = {
  handleNumpadPress: PropTypes.func.isRequired,
};

export default NumPad;

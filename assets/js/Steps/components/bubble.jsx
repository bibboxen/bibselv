import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MachineStateContext from '../../context/machineStateContext';

function Bubble({ color, which, label, icon, actionHandler }) {
    const classes = `bubble ${color}`;
    const context = useContext(MachineStateContext);
    return (
        <div className={classes} onClick={() => actionHandler(which,context)}>
            <div className="inner-bubble">
                <div className="text-and-icon">
                    <div className="icon">
                        <FontAwesomeIcon icon={icon} />
                    </div>
                    {label}</div></div>
        </div>
    );
}
Bubble.propTypes = {
    color: PropTypes.string.isRequired,
    which: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    actionHandler: PropTypes.func.isRequired
};

export default Bubble;

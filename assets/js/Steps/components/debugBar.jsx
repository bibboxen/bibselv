import React, { useContext } from 'react';
import MachineStateContext from '../../context/machineStateContext';
import PropTypes from 'prop-types';
function DebugBar({actionHandler}) {
    const context = useContext(MachineStateContext);


    return <div style={{ position: 'fixed', right: '0', left: '0', bottom: '0', backgroundColor: 'white', height:"100px" }}>

        <button style={{ margin: '25px' }} onClick={() => actionHandler("logout",context)}>Log ud</button>
        <button style={{ margin: '25px' }} onClick={() => actionHandler("login",context)}>Log ind</button>
        <button style={{ margin: '25px' }} onClick={() => actionHandler("loanMaterial",context)}>Lån en bog</button>
        <button style={{ margin: '25px' }} onClick={() => actionHandler("handinMaterial",context)}>Aflever en bog</button>
    </div>;
}
DebugBar.propTypes = {
    actionHandler: PropTypes.func.isRequired
};


export default DebugBar;

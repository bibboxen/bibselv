import React, { useContext } from 'react';
import MachineStateContext from '../context/machineStateContext';
import ScanLogin from './loginComponents/scanLogin';
import TypeLogin from './loginComponents/typeLogin';
import UniLogin from './loginComponents/uniLogin';
import PropTypes from 'prop-types';
function Login({actionHandler}) {
    const context = useContext(MachineStateContext);

    function renderStep(loginConfig) {
        switch (loginConfig) {
        case 'scan':
            return <ScanLogin actionHandler={actionHandler} ></ScanLogin>;
        case 'type':
            return <TypeLogin actionHandler={actionHandler} ></TypeLogin>;
        case 'uni':
            return <UniLogin actionHandler={actionHandler} ></UniLogin>;
        default:
            return <span>Loginmetode er ikke konfigureret</span>;
        }
    }

    return <>{renderStep(context.loginConfig.get)}</>;
}

Login.propTypes = {
    actionHandler: PropTypes.func.isRequired
};


export default Login;

/**
 * @file
 *
 * Renders the right type of login, based on configuration.
 *

 */

import React from 'react';
import ScanLogin from './loginComponents/ScanLogin';
import PropTypes from 'prop-types';

/**
 * Login.
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler 
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Login({ actionHandler }) {
    // @TODO: fix this, when configuration is available
    /*
    const context = useContext(MachineStateContext);

    function renderStep(loginConfig) {
        switch (loginConfig) {
            case 'scan':
                return <ScanLogin actionHandler={actionHandler} />;
            case 'type':
                return <TypeLogin actionHandler={actionHandler} />;
            case 'uni':
                return <UniLogin actionHandler={actionHandler} />;
            default:
                return <span>Loginmetode er ikke konfigureret</span>;
        }
    }
    */
    return <ScanLogin actionHandler={actionHandler} />;
}

Login.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Login;

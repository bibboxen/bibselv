/**
 * @file
 *
 * @TODO: Describe what it is used for.
 *
 * @TODO: Missing tests.
 * @TODO: Should be upper case file name.
 */

import React from 'react';
import ScanLogin from './loginComponents/ScanLogin';
import PropTypes from 'prop-types';

/**
 * Login.
 *
 * @param actionHandler
 * @return {*}
 * @constructor
 */
function Login({ actionHandler }) {
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

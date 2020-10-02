/**
 * @file
 * Login component.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import MachineStateContext from '../context/machine-state-context';
import ScanLogin from './login-components/scan-login';
import UniLogin from './login-components/uni-login';
import ScanPasswordLogin from './login-components/scan-password-login';
import { LoginLoginNotConfigured } from './utils/FormattedMessages';

/**
 * Renders a login component based on configuration
 *
 * @param actionHandler
 *  As the state can only be changed by the statemachine, the actionHandler
 *  calls the statemachine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function Login({ actionHandler }) {
    // The context of the machine
    const context = useContext(MachineStateContext);

    /**
     * Renders a login component based on configuration
     */
    function renderStep(loginConfig) {
        loginConfig = 'login_barcode';
        switch (loginConfig.toLowerCase()) {
            case 'login_barcode':
                return (
                    <ScanLogin
                        actionHandler={actionHandler}
                    />
                );
            case 'login_barcode_password':
                return (
                    <ScanPasswordLogin
                        actionHandler={actionHandler}
                    />
                );
            case 'unilogin':
                return <UniLogin actionHandler={actionHandler} />;
            default:
                return <span>{LoginLoginNotConfigured}</span>;
        }
    }

    return renderStep(context.boxConfig.get.loginMethod);
}

Login.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Login;

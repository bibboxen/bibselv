/**
 * @file
 * Login component.
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ScanLogin from './login-components/scan-login';
import ScanPasswordLogin from './login-components/scan-password-login';
import { LoginLoginNotConfigured } from './utils/formatted-messages';
import MachineStateContext from './utils/machine-state-context';
import AzureAdLogin from './login-components/azure-ad-login';

/**
 * Renders a login component based on configuration
 *
 * @param actionHandler
 *  As the state can only be changed by the state machine, the actionHandler
 *  calls the state machine if a user requests a state change.
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
            case 'azure_ad_login':
                return (
                    <AzureAdLogin
                        actionHandler={actionHandler}
                    />
                );
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

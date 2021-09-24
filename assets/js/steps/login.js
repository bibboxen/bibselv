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
import { Spinner } from 'react-bootstrap';

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
    const loginMethod = context?.boxConfig?.get?.loginMethod ? context.boxConfig.get.loginMethod : '';

    /**
     * Renders a login component based on configuration
     */
    function renderStep(loginConfig) {
        const flow = context?.machineState?.get?.flow;
        const uniqueId = context?.boxConfig?.get?.uniqueId;

        switch (loginConfig.toLowerCase()) {
            case 'azure_ad_login':
                window.location.href = `/box/ad-login/${uniqueId}/${flow}`;
                return (<div className='loading-screen'><Spinner animation={'border'}/></div>);
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
            default:
                return <span>{LoginLoginNotConfigured}</span>;
        }
    }

    return renderStep(loginMethod);
}

Login.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default Login;

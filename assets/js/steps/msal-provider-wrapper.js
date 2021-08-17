/**
 * @file
 * MsalProvider for Boxes that login through Azure AD.
 */

import React from 'react';
import { msalConfig } from './login-components/authConfig';
import { PublicClientApplication } from '@azure/msal-browser';
import PropTypes from 'prop-types';
import Bibbox from './bibbox';
import { MsalProvider } from '@azure/msal-react';

/**
 * Msal Provider wrapper.
 *
 * @param boxConfigurationInput
 *   The configuration of the bibbox.
 * @param machineStateInput
 *   The state of the app.
 * @param actionHandler
 *   Callback on requested state change.
 * @param connectionState
 *   Connection state.
 *
 * @return {*}
 * @constructor
 */
function MsalProviderWrapper({ boxConfigurationInput, machineStateInput, actionHandler, connectionState }) {
    const msalInstance = new PublicClientApplication(msalConfig);

    return (
        <MsalProvider instance={msalInstance}>
            <Bibbox
                boxConfigurationInput={boxConfigurationInput}
                machineStateInput={machineStateInput}
                connectionState={connectionState}
                actionHandler={actionHandler}
            />
        </MsalProvider>
    );
}

MsalProviderWrapper.propTypes = {
    boxConfigurationInput: PropTypes.object.isRequired,
    machineStateInput: PropTypes.object.isRequired,
    connectionState: PropTypes.string.isRequired,
    actionHandler: PropTypes.func.isRequired
};

export default MsalProviderWrapper;

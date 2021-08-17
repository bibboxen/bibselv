/**
 * @file
 * For Boxes that login through Azure AD.
 */

import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import MachineStateContext from '../utils/machine-state-context';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react';
import { ACTION_RESET } from '../../constants';
import BarcodeHandler from '../utils/barcode-handler';
import BarcodeScanner from '../utils/barcode-scanner';
import { loginRequest } from './authConfig';

/**
 * Azure AD login component.
 *
 * Redirects to Azure Ad for login
 *
 * @param actionHandler
 *  As the state can only be changed by the state machine, the actionHandler
 *  calls the state machine if a user requests a state change.
 * @return {*}
 * @constructor
 */
function AzureAdLogin({ actionHandler }) {
    const context = useContext(MachineStateContext);
    const isAuthenticated = useIsAuthenticated();
    const { instance } = useMsal();

    /**
     * Redirect to Azure AD
     */
    useEffect(() => {
        if (!isAuthenticated) {
            let d = 1;
            instance.loginRedirect(loginRequest).catch(e => {
                console.error(e);
            });
        }
    });

    /**
     * Setup barcode scanner.
     */
    useEffect(() => {
        const barcodeScanner = new BarcodeScanner();
        const barcodeCallback = (new BarcodeHandler([
            ACTION_RESET
        ], actionHandler, function(result) {
            actionHandler('login', {
                username: result.outputCode,
                useDefaultPassword: true
            });
        })).createCallback();

        barcodeScanner.start(barcodeCallback);
        return () => { barcodeScanner.stop(); };
    }, [actionHandler]);

    return (
        <>
            <p>Hello World!</p>
            <AuthenticatedTemplate>
                <p>You are signed in - </p>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <p>You are not signed in - Please sign in.</p>
            </UnauthenticatedTemplate>
        </>
    );
}

AzureAdLogin.propTypes = {
    actionHandler: PropTypes.func.isRequired
};

export default AzureAdLogin;

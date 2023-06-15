/**
 * @file
 * For users that log in with scanner.
 */

import React, { useContext } from 'react';
import MachineStateContext from '../utils/MachineStateContext';
import { Spinner } from 'react-bootstrap';

/**
 * Azure AD login component.
 *
 * Redirects to Azure login page.
 *
 * @return {*}
 * @constructor
 */
function AzureADLogin() {
    const context = useContext(MachineStateContext);
    const flow = context?.machineState?.get?.flow;
    const uniqueId = context?.boxConfig?.get?.uniqueId;

    window.location.assign(`/box/ad-login/${uniqueId}/${flow}`);

    return (
        <div className='loading-screen'><Spinner animation={'border'}/></div>
    );
}

export default AzureADLogin;

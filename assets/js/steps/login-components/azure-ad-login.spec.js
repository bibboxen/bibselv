/**
 * @file
 * Tests of azure ad login.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import MachineStateContext from '../utils/machine-state-context';
import AzureADLogin from './azure-ad-login';

it('renders without crashing', () => {
    const machineState = {
        items: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <AzureADLogin />
        </MachineStateContext.Provider>
    );
});

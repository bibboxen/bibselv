/**
 * @file
 * Tests of ScanPasswordLogin
 */

import React from 'react';
import ScanPasswordLogin from './scan-password-login';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import MachineStateContext from '../utils/machine-state-context';
it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        }
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <ScanPasswordLogin actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );
});

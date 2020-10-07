/**
 * @file
 * Tests of scanlogin
 */

import React from 'react';
import ScanLogin from './scan-login';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import MachineStateContext from '../utils/machine-state-context';

it('renders without crashing', () => {
    const machineState = {
        items: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <ScanLogin actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );
});

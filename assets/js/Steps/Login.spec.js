/**
 * @file
 *
 * Tests of ScanPasswordLogin
 */

import React from 'react';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import Login from './Login';
import MachineStateContext from '../context/machineStateContext';

it('renders without crashing', () => {
    const machineState = {
        items: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <Login actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );
});

/**
 * @file
 *
 * Tests of CheckOutItems.
 */

import React from 'react';
import CheckOutItems from './check-out-items';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import MachineStateContext from '../context/machine-state-context';

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        items: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <CheckOutItems actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );
});

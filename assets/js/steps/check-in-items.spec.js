/**
 * @file
 * Tests of CheckInItems.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import CheckInItems from './check-in-items';
import MachineStateContext from './utils/machine-state-context';

it('renders without crashing', () => {
    const machineState = {
        items: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <CheckInItems actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );
});

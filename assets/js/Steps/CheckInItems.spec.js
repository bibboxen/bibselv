/**
 * @file
 * Tests for CheckInItems.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import CheckInItems from './CheckInItems';
import MachineStateContext from '../context/machineStateContext';

it('renders without crashing', () => {
    const machineState = {
        items: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <CheckInItems actionHandler={() => {}} machineState={machineState}
                handleReset={() => {}}/>
        </MachineStateContext.Provider>
    );
});

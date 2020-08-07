/**
 * @file
 *
 * Tests for CheckOutItems.
 */

import React from 'react';
import CheckOutItems from './CheckOutItems';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import MachineStateContext from '../context/machineStateContext';

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        items: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <CheckOutItems actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />
        </MachineStateContext.Provider>
    );
});

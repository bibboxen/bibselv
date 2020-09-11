/**
 * @file
 * Tests of Status.
 */

import React from 'react';
import Status from './Status';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import MachineStateContext from '../context/machineStateContext';

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName',
            birthdayToday: true
        },
        holdItems: [],
        overdueItems: [],
        chargedItems: [],
        fineItems: [],
        recallItems: [],
        unavailableHoldItems: []
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <Status actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />
        </MachineStateContext.Provider>
    );
});

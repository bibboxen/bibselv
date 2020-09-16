/**
 * @file
 *
 * Tests of Initial.
 */

import React from 'react';
import Initial from './initial';
import MachineStateContext from '../context/machine-state-context';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    const machineState = {
        step: {
            name: 'initial'
        }
    };

    shallow(
        <MachineStateContext.Provider value={machineState}>
            <Initial actionHandler={() => {}} />
        </MachineStateContext.Provider>
    );
});

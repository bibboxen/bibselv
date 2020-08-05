import React from 'react';
import Status from './Status';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        holdItems: [],
        overdueItems: [],
        chargedItems: [],
        fineItems: [],
        recallItems: [],
        unavailableHoldItems: []
    };
    shallow(<Status actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);
});

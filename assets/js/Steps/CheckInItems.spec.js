import React from 'react';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import CheckInItems from './CheckInItems';

it('renders without crashing', () => {
    const machineState = {
        items: []
    };
    shallow(<CheckInItems actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);
});

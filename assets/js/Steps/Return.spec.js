import React from 'react';
import { shallow } from 'enzyme';
import { expect, it } from '@jest/globals';
import Return from './Return';

it('renders without crashing', () => {
    const machineState = {
        materials: []
    };
    shallow(<Return actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);
});

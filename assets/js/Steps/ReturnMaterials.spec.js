import React from 'react';
import { shallow } from 'enzyme';
import { it } from '@jest/globals';
import ReturnMaterials from './ReturnMaterials';

it('renders without crashing', () => {
    const machineState = {
        materials: []
    };
    shallow(<ReturnMaterials actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);
});

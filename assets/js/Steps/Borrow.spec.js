import React from 'react';
import Borrow from './Borrow';
import { shallow } from 'enzyme';
import { expect, it } from '@jest/globals';

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        materials: []
    };
    shallow(<Borrow actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);
});

it('renders the name of the user', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        materials: []
    };

    const wrapper = shallow(<Borrow actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);

    expect(wrapper).toContainReact(<p>Hej TestName</p>);
});

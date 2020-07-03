import React from 'react';
import Borrow from './Borrow';
import { shallow } from 'enzyme';
import { expect, it } from '@jest/globals';

it('renders without crashing without machineState', () => {
    shallow(<Borrow />);
});

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        materials: []
    };
    shallow(<Borrow machineState={machineState} />);
});

it('renders the name of the user', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        materials: []
    };

    const wrapper = shallow(<Borrow machineState={machineState} />);

    expect(wrapper).toContainReact(<p>Hej TestName</p>);
});

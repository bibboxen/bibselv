import React from 'react';
import CheckOutItems from './CheckOutItems';
import { shallow } from 'enzyme';
import { expect, it } from '@jest/globals';

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        items: []
    };
    shallow(<CheckOutItems actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);
});

it('renders the name of the user', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        items: []
    };

    const wrapper = shallow(<CheckOutItems actionHandler={() => {}} machineState={machineState} handleReset={() => {}} />);

    expect(wrapper).toContainReact(<p>Hej TestName</p>);
});

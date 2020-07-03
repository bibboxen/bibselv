import React from 'react';
import Borrow from './Borrow';
import { shallow } from 'enzyme';
import ScanLogin from './ScanLogin';

it('renders without crashing', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        materials: []
    };
    shallow(<Borrow actionHandler={() => {}} handleReset={() => {}} machineState={machineState} />);
});

it('renders the name of the user', () => {
    const machineState = {
        user: {
            name: 'TestName'
        },
        materials: []
    };

    const wrapper = shallow(<Borrow actionHandler={() => {}} handleReset={() => {}} machineState={machineState} />);

    expect(wrapper).toContainReact(<p>Hej TestName</p>);
});


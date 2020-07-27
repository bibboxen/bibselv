import React from './node_modules/react';
import ScanLogin from './scanLogin';
import { shallow } from './node_modules/enzyme';
import { expect, it } from './node_modules/@jest/globals';

it('renders without crashing', () => {
    shallow(<ScanLogin actionHandler={() => {}} />);
});

it('contains a h1', () => {
    const wrapper = shallow(<ScanLogin actionHandler={() => {}} />);
    const welcome = <h1>ScanLogin</h1>;

    expect(wrapper).toContainReact(welcome);
});

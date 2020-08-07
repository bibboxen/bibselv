/**
 * @file
 *
 * @TODO: Describe what it is used for.
 */

import React from 'react';
import ScanLogin from './ScanLogin';
import { shallow } from 'enzyme';
import { expect, it } from '@jest/globals';
import Header from '../components/header';

it('renders without crashing', () => {
    shallow(<ScanLogin actionHandler={() => {}} handleReset={() => {}}/>);
});

it('contains a header', () => {
    const wrapper = shallow(<ScanLogin actionHandler={() => {}} handleReset={() => {}} />);
    const header = <Header header="Login" text="Scan låner stregkode"/>;

    expect(wrapper).toContainReact(header);
});

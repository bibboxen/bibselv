/**
 * @file
 *
 * Tests of ScanPasswordLogin
 */

import React from 'react';
import ScanPasswordLogin from './ScanPasswordLogin';
import { shallow, mount } from 'enzyme';
import { it } from '@jest/globals';

it('renders without crashing', () => {
    shallow(<ScanPasswordLogin actionHandler={() => {}} />);
});

it('renders initial sub header', () => {
    const wrapper = mount(<ScanPasswordLogin actionHandler={() => {}} />);
    console.log(wrapper.debug());
    expect(wrapper.find('.sub-header').text()).toEqual(
        'Scan dit bibliotekskort'
    );
});


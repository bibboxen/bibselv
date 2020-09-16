/**
 * @file
 * Tests of Button.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { it } from '@jest/globals';
import Header from './Header';

describe('Test of header component', () => {
    it('Renders without crashing', () => {
        shallow(
            <Header
                header='overskrift'
                subheader='underoverskrift'
                which=''
                icon=''
            />
        );
    });

    it('Renders header', () => {
        const wrapper = mount(
            <Header
                header='overskrift'
                subheader='underoverskrift'
                which=''
                icon=''
            />
        );
        expect(wrapper.find('.header').text()).toEqual('overskrift');
    });

    it('Renders sub header', () => {
        const wrapper = mount(
            <Header
                header='overskrift'
                subheader='underoverskrift'
                which=''
                icon=''
            />
        );
        expect(wrapper.find('.sub-header').text()).toEqual('underoverskrift');
    });
});

/**
 * @file
 * Tests of Button.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import HelpBox from './help-box';

describe('Test of helpbox', () => {
    it('Renders without crashing', () => {
        shallow(<HelpBox text='text' />);
    });

    it('Renders text', () => {
        const wrapper = mount(<HelpBox text='text' />);
        expect(wrapper.find('p').text()).toEqual('text');
    });
});

/**
 * @file
 * Tests of Button.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import HelpBox from './help-box';
import { IntlProvider } from 'react-intl';
import { translations } from '../utils/translations-for-test';

describe('Test of helpbox', () => {
    it('Renders without crashing', () => {
        shallow(<HelpBox text='text' />);
    });

    it('Renders text', () => {
        const wrapper = mount(<IntlProvider locale="en" translations={translations}><HelpBox text='text' /></IntlProvider>);
        expect(wrapper.find('p').text()).toEqual('text');
    });
});

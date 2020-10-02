/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import Input from './input';
import { IntlProvider } from 'react-intl';
import { translations } from '../utils/translationsForTest';

describe('Tests of input component', () => {
    it('renders without crashing', () => {
        shallow(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    onChange={() => {}}
                    activeBanner={false}
                    value='123'
                />
            </IntlProvider>
        );
    });

    it('renders the label', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    onChange={() => {}}
                    activeBanner={false}
                    value=''
                />
            </IntlProvider>
        );
        expect(wrapper.find('label').text()).toEqual('input-label');
    });

    it('renders the input', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    onChange={() => {}}
                    activeBanner={false}
                    value=''
                />
            </IntlProvider>
        );
        expect(wrapper.exists('input')).toEqual(true);
    });

    it('renders no .info class when activeBanner is false', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    onChange={() => {}}
                    activeBanner={false}
                    value=''
                />
            </IntlProvider>
        );
        expect(wrapper.exists('.info')).toEqual(false);
    });

    it('renders only the .info and .input and bannertext classes if which activeBanner is true', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    onChange={() => {}}
                    activeBanner={true}
                    value='bib'
                />
            </IntlProvider>
        );
        expect(wrapper.exists('.info')).toEqual(true);
        expect(wrapper.exists('.input')).toEqual(true);
        expect(wrapper.find('.info').text()).toContain('input-labelbook-is-registered');
    });

    it('renders no .info class if which is checkinitems and value is not set', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    onChange={() => {}}
                    activeBanner={false}
                    value=''
                />
            </IntlProvider>
        );
        expect(wrapper.exists('.info')).toEqual(false);
    });

    it('renders value', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    onChange={() => {}}
                    activeBanner={false}
                    value='123'
                />
            </IntlProvider>
        );
        expect(wrapper.find('input').props().value).toEqual('123');
    });
});

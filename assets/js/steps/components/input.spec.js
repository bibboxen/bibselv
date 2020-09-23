/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import Input from './input';

describe('Tests of input component', () => {
    it('renders without crashing', () => {
        shallow(
            <Input
                name='input-test'
                label='input-label'
                onChange={() => {}}
                activeBanner={false}
                value='123'
            />
        );
    });

    it('renders the label', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                onChange={() => {}}
                activeBanner={false}
                value=''
            />
        );
        expect(wrapper.find('label').text()).toEqual('input-label');
    });

    it('renders the input', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                onChange={() => {}}
                activeBanner={false}
                value=''
            />
        );
        expect(wrapper.exists('input')).toEqual(true);
    });

    it('renders no .info class when activeBanner is false', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                onChange={() => {}}
                activeBanner={false}
                value=''
            />
        );
        expect(wrapper.exists('.info')).toEqual(false);
    });

    it('renders only the .info and .input and bannertext classes if which activeBanner is true', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                onChange={() => {}}
                activeBanner={true}
                value='bib'
            />
        );
        expect(wrapper.exists('.info')).toEqual(true);
        expect(wrapper.exists('.input')).toEqual(true);
        expect(wrapper.find('.info').text()).toContain('Bogen blev registreret. Klar til næste');
    });

    it('renders no .info class if which is checkinitems and value is not set', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                onChange={() => {}}
                activeBanner={false}
                value=''
            />
        );
        expect(wrapper.exists('.info')).toEqual(false);
    });

    it('renders value', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                onChange={() => {}}
                activeBanner={false}
                value='123'
            />
        );
        expect(wrapper.find('input').props().value).toEqual('123');
    });
});

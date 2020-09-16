/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import Input from './Input';
describe('Tests of input component', () => {
    it('renders without crashing', () => {
        shallow(
            <Input
                name='input-test'
                label='input-label'
                value='123'
                which='icon-bubble-text'
            />
        );
    });

    it('renders the label', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value=''
                which='icon-bubble-text'
            />
        );
        expect(wrapper.find('label').text()).toEqual('input-label');
    });

    it('renders the input', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value=''
                which='icon-bubble-text'
            />
        );
        expect(wrapper.exists('input')).toEqual(true)
    });

    it('renders no .info class if which is checkoutitems and value is not set', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value=''
                which='checkoutitems'
            />
        );
        expect(wrapper.exists('.info')).toEqual(false);
    });

    it('renders only the .info and .input classes if which is checkoutitems and value is set', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value='bib'
                which='checkoutitems'
            />
        );
        expect(wrapper.exists('.info')).toEqual(true);
        expect(wrapper.exists('.input')).toEqual(true);
        expect(wrapper.exists('.purple')).toEqual(false);
    });

    it('renders no .info class if which is checkinitems and value is not set', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value=''
                which='checkinitems'
            />
        );
        expect(wrapper.exists('.info')).toEqual(false);
    });


    it('renders only the .info, .purple and .input classes if which is checkinitems and value is set', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value='bib'
                which='checkinitems'
            />
        );
        expect(wrapper.exists('.info')).toEqual(true);
        expect(wrapper.exists('.input')).toEqual(true);
        expect(wrapper.exists('.purple')).toEqual(true);
    });
    it('renders info banner on which and value', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value='123'
                which='test'
            />
        );
        expect(wrapper.find('.info-banner').text()).toEqual(
            'Bogen blev registreret. Klar til næste'
        );
    });

    it('renders value', () => {
        const wrapper = mount(
            <Input
                name='input-test'
                label='input-label'
                value='123'
                which='test'
            />
        );
        expect(wrapper.find('input').props().value).toEqual('123');
    });
});

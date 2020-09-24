/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import Input from './input';
import { IntlProvider } from 'react-intl';

const translations = {
    'initial-choose-a-function': 'Vælg en funktion for at starte',
    'initial-button-check-out': 'Lån',
    'initial-button-status': 'Status',
    'initial-button-check-in': 'Aflever',
    'login-not-configured': 'Loginmetode er ikke konfigureret',
    'status-header-current-loans': 'Aktuelle lån',
    'status-header-reservations': 'Reservationer',
    'status-header-ready-for-pickup': 'Klar til afhentning',
    'banner-header-book-with-fine': 'Denne bog har en bøde',
    'banner-heaeder-book-for-check-in': 'Denne bog skal afleveres',
    'help-box-header': 'Hjælp',
    'book-is-registered': 'Bogen blev registreret. Klar til næste',
    'button-navbar-check-out': 'Lån',
    'button-navbar-status': 'Status',
    'button-navbar-check-in': 'Aflever',
    'button-navbar-finish': 'Afslut'
};

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
        expect(wrapper.find('.info').text()).toContain('Bogen blev registreret. Klar til næste');
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

    it('renders only the .info, .purple and .input classes if which is checkinitems and value is set', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    value='bib'
                    activeBanner={false}
                />
            </IntlProvider>
        );
        expect(wrapper.exists('.info')).toEqual(true);
        expect(wrapper.exists('.input')).toEqual(true);
        expect(wrapper.exists('.purple')).toEqual(true);
    });
    it('renders info banner on which and value', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    value='123'
                    readOnly={true}
                    which='test'
                />
            </IntlProvider>
        );
        expect(wrapper.find('.info-banner').text()).toEqual(
            'Bogen blev registreret. Klar til næste'
        );
    });
    it('renders value', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Input
                    name='input-test'
                    label='input-label'
                    value='123'
                    readOnly={true}
                    which='test'
                />
            </IntlProvider>
        );
        expect(wrapper.find('input').props().value).toEqual('123');
    });
});

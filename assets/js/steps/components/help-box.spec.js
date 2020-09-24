/**
 * @file
 * Tests of Button.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import HelpBox from './help-box';
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

describe('Test of helpbox', () => {
    it('Renders without crashing', () => {
        shallow(<HelpBox text='text' />);
    });

    it('Renders text', () => {
        const wrapper = mount(<IntlProvider locale="en" translations={translations}><HelpBox text='text' /></IntlProvider>);
        expect(wrapper.find('p').text()).toEqual('text');
    });
});

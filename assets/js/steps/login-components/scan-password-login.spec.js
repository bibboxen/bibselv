/**
 * @file
 * Tests of ScanPasswordLogin
 */

import React from 'react';
import ScanPasswordLogin from './scan-password-login';
import { shallow, mount } from 'enzyme';
import { it } from '@jest/globals';
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

it('renders without crashing', () => {
    shallow(<ScanPasswordLogin actionHandler={() => {}} />);
});

it('renders initial sub header', () => {
    const wrapper = mount(<IntlProvider locale="en" translations={translations}><ScanPasswordLogin actionHandler={() => {}} /></IntlProvider>);
    expect(wrapper.find('.sub-header').text()).toEqual(
        'Scan dit bibliotekskort'
    );
});

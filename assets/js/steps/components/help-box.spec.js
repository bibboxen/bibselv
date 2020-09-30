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
    'initial-choose-a-function': 'Select a function to start',
    'initial-button-check-out': 'Loan',
    'initial-button-status': 'Status',
    'initial-button-check-in': 'Hand in',
    'login-not-configured': 'Login method is not configured',
    'status-header-current-loans': 'Current loans',
    'status-header-reservations': 'Reservations',
    'status-header-ready-for-pickup': 'Ready for pickup',
    'banner-header-book-with-fine': 'This book has a fine',
    'banner-heaeder-book-for-check-in': 'This book must be handed in',
    'help-box-header': 'Help',
    'book-is-registered': 'The book has been registered. Ready for the next one',
    'button-navbar-check-out': 'Loan',
    'button-navbar-status': 'Status',
    'button-navbar-check-in': 'Hand in',
    'button-navbar-finish': 'Exit'
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

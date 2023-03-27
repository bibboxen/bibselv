import React from 'react';
import Bibbox from '../../assets/js/steps/bibbox';
import { CONNECTION_ONLINE } from '../../assets/js/constants';
import messages from '../../public/lang/da-comp.json';
import { IntlProvider } from 'react-intl';
import BookStatus from '../../assets/js/steps/utils/book-status';

describe('Status', () => {
    it('Status is rendered and responds to mouse interaction', () => {
        const mock = {
            actionHandler: (arg) => {
                return arg;
            }
        };
        cy.stub(mock, 'actionHandler').as('actionHandlerStub');

        cy.mount(
            <IntlProvider locale="da" messages={messages}>
                <Bibbox
                    boxConfigurationInput={{
                        id: 25,
                        hasPrinter: false,
                        reservedMaterialInstruction:
                        'Dolor est ut ea natus iusto deserunt inventore.',
                        inactivityTimeOut: 360000,
                        soundEnabled: false,
                        school: {
                            name: 'Beder Skole'
                        },
                        loginMethod: 'azure_ad_login',
                        adLoginState: {
                            state: 'checkoutitems',
                            accountType: 'student',
                            userName: 'test1234'
                        },
                        hasTouch: false,
                        hasKeyboard: true,
                        sip2User: {
                            username: 'test_test',
                            password: '12345678',
                            agencyId: 'DK-718680',
                            location: 'Kalvehave'
                        },
                        defaultPassword: '0000',
                        debugEnabled: false,
                        defaultLanguageCode: 'da',
                        hasFrontpageCheckIn: true
                    }}
                    machineStateInput={{
                        step: 'status',
                        flow: 'status',
                        user: {
                            birthdayToday: false,
                            id: '64',
                            isAdmin: false,
                            name: 'ITK Testelev'
                        },
                        unavailableHoldItems: [{
                            bibliographicId: '2',
                            id: '1',
                            interestDate: 1635120000000,
                            title: 'En bogtitel',
                            author: 'En forfatter',
                            GMB: '[GMB]',
                            SMB: '[SMB]',
                            DK5: '[DK5]'
                        }],
                        chargedItems: [{
                            GMB: 'a',
                            SMB: 'xx',
                            author: 'Mandahl-Barth, G.',
                            id: '5313004361',
                            returnDate: 1659916800000,
                            title: 'Hvad finder jeg i sø og å'
                        }],
                        fineItems: [],
                        holdItems: [{
                            bibliographicId: 123,
                            id: 1,
                            pickupId: 1,
                            pickupDate: 1635120000000,
                            pickupLocation: 'Hovedbiblioteket',
                            title: 'En bog',
                            author: 'En forfatter',
                            GMB: '[GMB]',
                            SMB: '[SMB]',
                            DK5: '[DK5]'
                        }],
                        overdueItems: [{
                            DK5: '37.147',
                            GMB: 'a',
                            SMB: 'xx',
                            author: '',
                            dueDate: 1635120000000,
                            id: '5313004408',
                            title: 'Jeg har et museum'
                        }, {
                            DK5: '37.147',
                            GMB: 'a',
                            SMB: 'xx',
                            author: 'Forfatter',
                            dueDate: 1635120000000,
                            id: '5313004408',
                            title: 'Jeg har et museum'
                        }],
                        recallItems: []
                    }}
                    errorMessage={null}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mock.actionHandler}
                />
            </IntlProvider>
        );
        cy.get('[data-cy="navbar"]')
            .find('.text')
            .should('have.text', 'Beder SkoleITK Testelev');

        cy.get('[data-cy="navbar"]')
            .find('[data-cy="logout"]')
            .should('have.text', 'Afslut')
            .find('.button-barcode')
            .should('exist');
        cy.get('[data-cy="navbar"]')
            .find('[data-cy="check-in-items"]')
            .should('have.text', 'Aflever');
        cy.get('[data-cy="navbar"]')
            .find('[data-cy="check-out-items"]')
            .should('have.text', 'Lån');
        cy.get('[data-cy="navbar"]')
            .find('[data-cy="status"]')
            .should('have.text', 'Status');
        cy.get('[data-cy="page-header"]').should('have.text', 'Status');
        cy.get('[data-cy="sub-header"]').should(
            'have.text',
            'Dine lån og reservationer'
        );
        cy.get('.header-icon.status').should('exist');
        cy.get('[data-cy="help-box"]').should('not.exist');

        cy.get('[data-cy="overdue-books"]').should('have.css', 'background-color', 'rgb(233, 67, 67)');
        cy.get('[data-cy="overdue-books"]').find('.top').should('have.text', '2 bøger skal afleveres');
        cy.get('[data-cy="overdue-books"]').find('.item').eq(0).should('have.text', 'Jeg har et museumUden forfatter');
        cy.get('[data-cy="overdue-books"]').find('.item').eq(1).should('have.text', 'Jeg har et museumAf Forfatter');
        cy.get('[data-cy="book-banner"]').eq(0).should('have.text', 'Hvad finder jeg i sø og åAf Mandahl-Barth, G.');
        cy.get('[data-cy="book-banner"]').eq(1).should('have.text', 'En bogtitelAf En forfatter');
        cy.get('[data-cy="book-banner"]').eq(2).should('have.text', 'En bogAf En forfatter');
        cy.get('[data-cy="book-banner"]').eq(0).should('have.css', 'background-color', 'rgb(222, 222, 222)');
        cy.get('[data-cy="book-banner"]').eq(1).should('have.css', 'background-color', 'rgb(222, 222, 222)');
        cy.get('[data-cy="book-banner"]').eq(2).should('have.css', 'background-color', 'rgb(5, 245, 144)');
        cy.get('[data-cy="banner-list-header"]').eq(0).should('have.text', 'Aktuelle lån3');
        cy.get('[data-cy="banner-list-header"]').eq(1).should('have.text', 'Reservationer1');
        cy.get('[data-cy="banner-list-header"]').eq(2).should('have.text', 'Klar til afhentning1');
    });

    it('Check in items responds to barcode scanner', () => {
        const mock = {
            actionHandler: (arg) => {
                return arg;
            }
        };
        cy.stub(mock, 'actionHandler').as('actionHandlerStub');
        cy.mount(
            <IntlProvider locale="da" messages={messages}>
                <Bibbox
                    boxConfigurationInput={{
                        id: 25,
                        hasPrinter: false,
                        reservedMaterialInstruction:
                        'Dolor est ut ea natus iusto deserunt inventore.',
                        inactivityTimeOut: 360000,
                        soundEnabled: false,
                        school: {
                            name: 'Beder Skole'
                        },
                        loginMethod: 'azure_ad_login',
                        adLoginState: {
                            state: 'checkoutitems',
                            accountType: 'student',
                            userName: 'test1234'
                        },
                        hasTouch: false,
                        hasKeyboard: true,
                        sip2User: {
                            username: 'test_test',
                            password: '12345678',
                            agencyId: 'DK-718680',
                            location: 'Kalvehave'
                        },
                        defaultPassword: '0000',
                        debugEnabled: false,
                        defaultLanguageCode: 'da',
                        hasFrontpageCheckIn: true
                    }}
                    machineStateInput={{
                        step: 'status',
                        flow: 'status',
                        user: {
                            birthdayToday: false,
                            id: '64',
                            isAdmin: false,
                            name: 'ITK Testelev'
                        },
                        unavailableHoldItems: [{
                            bibliographicId: '2',
                            id: '1',
                            interestDate: 1635120000000,
                            title: 'En bogtitel',
                            author: 'En forfatter',
                            GMB: '[GMB]',
                            SMB: '[SMB]',
                            DK5: '[DK5]'
                        }],
                        chargedItems: [{
                            GMB: 'a',
                            SMB: 'xx',
                            author: 'Mandahl-Barth, G.',
                            id: '5313004361',
                            returnDate: 1659916800000,
                            title: 'Hvad finder jeg i sø og å'
                        }],
                        fineItems: [],
                        holdItems: [{
                            bibliographicId: 123,
                            id: 1,
                            pickupId: 1,
                            pickupDate: 1635120000000,
                            pickupLocation: 'Hovedbiblioteket',
                            title: 'En bog',
                            author: 'En forfatter',
                            GMB: '[GMB]',
                            SMB: '[SMB]',
                            DK5: '[DK5]'
                        }],
                        overdueItems: [{
                            DK5: '37.147',
                            GMB: 'a',
                            SMB: 'xx',
                            author: '',
                            dueDate: 1635120000000,
                            id: '5313004408',
                            title: 'Jeg har et museum'
                        }, {
                            DK5: '37.147',
                            GMB: 'a',
                            SMB: 'xx',
                            author: 'Forfatter',
                            dueDate: 1635120000000,
                            id: '5313004408',
                            title: 'Jeg har et museum'
                        }],
                        recallItems: []
                    }}
                    errorMessage={null}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mock.actionHandler}
                />
            </IntlProvider>
        );

        // Barcode input: status
        cy.get('body').trigger('keypress', { key: '!BA03020!C' });
        cy.get('@actionHandlerStub').should('not.be.called');

        // Barcode input: reset
        cy.get('body').trigger('keypress', { key: '!BA03006!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'reset');

        // Todo is this important to test - it seems that it actually triggers a print dialogue in cypress.
        // Barcode input: print
        // cy.get('body').trigger('keypress', { key: '!BA03007!C' });
        // cy.get('@actionHandlerStub').should('be.calledWith', 'print');

        // // Barcode input: checkOutItems
        cy.get('body').trigger('keypress', { key: '!BA03009!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'changeFlow', { flow: 'checkOutItems' });

        // Barcode input: checkInItems
        cy.get('body').trigger('keypress', { key: '!BA03010!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'changeFlow', { flow: 'checkInItems' });
    });
});

import React from 'react';
import Bibbox from '../../assets/js/steps/bibbox';
import { CONNECTION_ONLINE } from '../../assets/js/constants';
import messages from '../../public/lang/da-comp.json';
import { IntlProvider } from 'react-intl';
import BookStatus from '../../assets/js/steps/utils/book-status';

describe('Check out items', () => {
    it('Check out items is rendered and responds to mouse interaction', () => {
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
                        step: 'checkOutItems',
                        flow: 'checkOutItems',
                        items: [
                            {
                                timestamp: 1635120000000,
                                itemIdentifier: '1',
                                title: 'Title 1',
                                author: 'Author 1',
                                renewalOk: 'message',
                                message: 'Check out message',
                                status: 'inProgress'
                            },
                            {
                                timestamp: 1635120000000,
                                itemIdentifier: '2',
                                title: 'Title 2',
                                author: 'Author 2',
                                renewalOk: 'message',
                                message: 'Check out message',
                                status: 'error'
                            },
                            {
                                timestamp: 1635120000000,
                                itemIdentifier: '3',
                                title: 'Title 3',
                                author: 'Author 3',
                                renewalOk: 'message',
                                message: 'Check out message',
                                status: 'renewed'
                            },
                            {
                                timestamp: 1635120000000,
                                itemIdentifier: '4',
                                title: 'Title 4',
                                author: 'Author 4',
                                renewalOk: 'message',
                                message: 'Check out message',
                                status: 'checkedOut'
                            }
                        ]
                    }}
                    errorMessage={null}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mock.actionHandler}
                />
            </IntlProvider>
        );
        cy.get('[data-cy="navbar"]')
            .find('.text')
            .should('have.text', 'Beder Skole');

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
        cy.get('[data-cy="page-header"]').should('have.text', 'Lån');
        cy.get('[data-cy="sub-header"]').should(
            'have.text',
            'Scan stregkoden på bogen du vil låne'
        );
        cy.get('.header-icon.checkoutitems').should('exist');
        cy.get('[data-cy="help-box"]').should(
            'have.text',
            'HjælpBrug håndscanneren til at scanne stregkoden på bogen'
        );

        cy.get('[data-cy="banner"]').eq(0).should(
            'have.text',
            'Title 4Title 4 af Author 4'
        );
        cy.get('[data-cy="banner"]').eq(1).should(
            'have.text',
            'Title 3Title 3 af Author 3'
        );
        cy.get('[data-cy="banner"]').eq(2).should(
            'have.text',
            'Check out messageTitle 2 af Author 2'
        );
        cy.get('[data-cy="banner"]').eq(3).should(
            'have.text',
            'Henter informationer1'
        );

        // // Barcode input: checkInItems should not be called
        cy.get('body').trigger('keypress', { key: '!BA03010!C' });
        cy.get('@actionHandlerStub').should('not.be.called');
    });

    it('Check out items responds to barcode scanner', () => {
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
                        step: 'checkOutItems',
                        flow: 'checkOutItems'
                    }}
                    errorMessage={null}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mock.actionHandler}
                />
            </IntlProvider>
        );

        // Barcode input: valid barcode
        cy.get('body').trigger('keypress', { key: '!BD101234567891!C' });
        cy.get('@actionHandlerStub').should('not.be.called');

        // // Barcode input: Invalid barcode
        cy.get('body').trigger('keypress', { key: '!BK101234567891!C' });
        cy.get('@actionHandlerStub').should('not.be.called');

        // Barcode input: valid barcode
        cy.get('body').trigger('keypress', { key: '!BA1234567891!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'checkOutItem', { itemIdentifier: '!BA1234567891!C' });

        // Barcode input: reset
        cy.get('body').trigger('keypress', { key: '!BA03006!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'reset');

        // Barcode input: checkInItems
        cy.get('body').trigger('keypress', { key: '!BA03010!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'changeFlow', { flow: 'checkInItems' });

        // Barcode input: status
        cy.get('body').trigger('keypress', { key: '!BA03020!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'changeFlow', { flow: 'status' });
    });
});

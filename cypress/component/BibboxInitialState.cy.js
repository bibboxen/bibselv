import React from 'react';
import Bibbox from '../../assets/js/steps/bibbox';
import { CONNECTION_ONLINE } from '../../assets/js/constants';
import messages from '../../public/lang/da-comp.json';
import { IntlProvider } from 'react-intl';

describe('Initial', () => {
    it('Initial is rendered and responds to mouse interaction', () => {
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
                        hasPrinter: true,
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
                    machineStateInput={{ step: 'initial' }}
                    errorMessage={null}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mock.actionHandler}
                />
            </IntlProvider>
        );

        // Navbar, correct schoole name and "reset button exists"
        cy.get('[data-cy="navbar"]')
            .find('.text')
            .should('have.text', 'Beder Skole');

        cy.get('[data-cy="navbar"]')
            .find('[data-cy="logout"]')
            .should('have.text', 'Nulstil')
            .find('.button-barcode')
            .should('exist').click();

        // Frontend calls actionhandler enterflow with reset on click
        cy.get('@actionHandlerStub').should('be.calledWith', 'reset');

        // Correct header
        cy.get('[data-cy="header"]').should(
            'have.text',
            'Vælg en funktion for at starte'
        );

        // The three round buttons are rendered
        cy.get('[data-cy="bubble-buttons"]')
            .find('.bubble.checkoutitems')
            .should('have.text', 'Lån');
        cy.get('[data-cy="bubble-buttons"]')
            .find('.bubble.status')
            .should('have.text', 'Status');
        cy.get('[data-cy="bubble-buttons"]')
            .find('.bubble.checkinitems')
            .should('have.text', 'Aflever');

        // The three barcodes are rendered
        cy.get('[data-cy="barcodes"]')
            .find('.col-md-3')
            .should('have.length', 3);

        // Frontend calls actionhandler enterflow with checkInItems on click
        cy.get('[data-cy="bubble-buttons"]')
            .find('.bubble.checkinitems').click();
        cy.get('@actionHandlerStub').should('be.calledWith', 'enterFlow', { flow: 'checkInItems' });

        // Frontend calls actionhandler enterflow with status on click
        cy.get('[data-cy="bubble-buttons"]')
            .find('.bubble.status').click();
        cy.get('@actionHandlerStub').should('be.calledWith', 'enterFlow', { flow: 'status' });

        // Frontend calls actionhandler enterflow with checkOutItems on click
        cy.get('[data-cy="bubble-buttons"]')
            .find('.bubble.checkoutitems').click();

        cy.get('@actionHandlerStub').should('be.calledWith', 'enterFlow', { flow: 'checkOutItems' });
    });

    it('Initial responds to barcode scanner', () => {
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
                        hasPrinter: true,
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
                    machineStateInput={{ step: 'initial' }}
                    errorMessage={null}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mock.actionHandler}
                />
            </IntlProvider>
        );

        // Barcode input: reset
        cy.get('body').trigger('keypress', { key: '!BA03006!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'reset');

        // Barcode input: checkOutItems
        cy.get('body').trigger('keypress', { key: '!BA03009!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'enterFlow', { flow: 'checkOutItems' });

        // Barcode input: checkInItems
        cy.get('body').trigger('keypress', { key: '!BA03010!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'enterFlow', { flow: 'checkInItems' });

        // Barcode input: status
        cy.get('body').trigger('keypress', { key: '!BA03020!C' });
        cy.get('@actionHandlerStub').should('be.calledWith', 'enterFlow', { flow: 'status' });

        // Barcode input: valid barcode
        cy.get('body').trigger('keypress', { key: '!BA1234567891!C' });
        cy.get('@actionHandlerStub').should('not.be.calledWith', 'checkInItem', { itemIdentifier: '!BA1234567891!C' });
    });
});

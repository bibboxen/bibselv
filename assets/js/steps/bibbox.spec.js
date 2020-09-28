/**
 * @file
 * Tests of App.
 */

import React from 'react';
import Bibbox from './bibbox';
import { mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { translations } from './utils/translationsForTest';

describe('Initial component (Vælg en funktion...)', () => {
    it('renders the initial component when state is initial and it is logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{ step: 'initial' }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('h1').text()).toEqual('Select a function to start');
    });
});

describe('Check out items component (Udlån)', () => {
    it('renders login component when it is logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode'
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScan'
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );

        expect(wrapper.find('.header').text()).toEqual('Login');
    });

    it('renders login component when logged out, even if there is items', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode'
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScan',
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.header').text()).toEqual('Login');
    });

    it('renders check out items component when it is logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.contains(<div className='header'>Loan</div>)).toEqual(
            true
        );
    });

    it('renders item (book) with error in check out items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.banner .header').text()).toEqual('Fejl');
    });

    it('renders item (book) in progress in check out items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                status: 'inProgress',
                                itemIdentifier: 123
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );

        expect(wrapper.find('.banner .header').text()).toEqual('Henter informationer');
    });

    it('renders item (book) that is checked in check out items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter',
                                status: 'checkedIn'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.banner .header').text()).toEqual('Insekter i farver');
    });
});

describe('Check in items component (Hand in)', () => {
    it('renders check in items component when it is logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.contains(<div className='header'>Hand in</div>)).toEqual(
            true
        );
    });

    it('renders item (book) with error in check in items component when logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );

        expect(wrapper.find('.banner .header').text()).toEqual('Fejl');
    });

    it('renders item (book) in progress in check in items component when logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        items: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                status: 'inProgress',
                                itemIdentifier: 123
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );

        expect(wrapper.find('.banner .header').text()).toEqual('Henter informationer');
    });

    it('renders item (book) that is checked in check in items component when logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter',
                                status: 'checkedIn'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.banner .header').text()).toEqual('Insekter i farver');
    });

    it('renders check in items component when it is logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.contains(<div className='header'>Hand in</div>)).toEqual(
            true
        );
    });

    it('renders item (book) with error in check in items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );

        expect(wrapper.find('.banner .header').text()).toEqual('Fejl');
    });

    it('renders item (book) in progress in check in items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                status: 'inProgress',
                                itemIdentifier: 123
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );

        expect(wrapper.find('.banner .header').text()).toEqual('Henter informationer');
    });

    it('renders item (book) that is checked in check in items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter',
                                status: 'checkedIn'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.banner .header').text()).toEqual('Insekter i farver');
    });
});

describe('Status component', () => {
    it('renders the login page, when state is status and it is not logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        loginMethod: 'unilogin',
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{ flow: 'status', step: 'loginScan' }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.header').text()).toEqual('Login');
    });

    it('renders the status component when the state is status and it is logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'status',
                        flow: 'status',
                        user: {
                            name: 'ITK',
                            birthdayToday: false
                        },
                        statusRefreshing: false,
                        holdItems: [],
                        overdueItems: [],
                        chargedItems: [],
                        fineItems: [],
                        recallItems: [],
                        unavailableHoldItems: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.contains(<div className='header'>Status</div>)).toEqual(
            true
        );
    });

    it('renders the books from machine state when the state is status, it is logged in and there are books', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'status',
                        flow: 'status',
                        user: {
                            name: 'ITK',
                            birthdayToday: false
                        },
                        statusRefreshing: false,
                        holdItems: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter'
                            }
                        ],
                        overdueItems: [
                            {
                                id: '5313004555',
                                dueDate: 1598832000032,
                                title: 'Open book',
                                author: 'Simpson, Jessica'
                            }
                        ],
                        chargedItems: [
                            {
                                id: '5313004319',
                                returnDate: 1599436800000,
                                title: 'Mellem rejer og hundestejler',
                                author: 'Møller Christensen, Jørgen'
                            }
                        ],
                        fineItems: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                title: 'Den lille bog om søgning på nettet',
                                author: 'Knudsen, Werner'
                            }
                        ],
                        recallItems: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4'
                            }
                        ],
                        unavailableHoldItems: [
                            {
                                id: '5313004351',
                                recallDate: 1598832000000,
                                title:
                                    'Det eksperimenterende billedværksted: [Bind] 1: indføring i den kunstneriske proces',
                                author: 'Holm, Anna Marie',
                                DK5: '70.7'
                            }
                        ]
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(
            wrapper.contains(
                <div className='banner-header'>
                    Det eksperimenterende billedværksted: [Bind] 1: indføring i
                    den kunstneriske proces
                </div>
            )
        ).toEqual(true);
        expect(wrapper.find('.banner header').text()).toContain('Illustreret svampeflora af Lange, Morten');
        expect(
            wrapper.contains(
                <div>Den lille bog om søgning på nettet af Knudsen, Werner</div>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(
                <div className='banner-header'>Mellem rejer og hundestejler</div>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(<div className='banner-header'>Insekter i farver</div>)
        ).toEqual(true);
        expect(
            wrapper.contains(<div>Open book af Simpson, Jessica</div>)
        ).toEqual(true);
        expect(
            wrapper.contains(
                <div className='banner-header'>Bogtitel som ikke eksisterer</div>
            )
        ).toEqual(false);
    });
});

describe('Tests of navbar component', () => {
    it('renders the navbar component when state is initial', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.exists('.navbar.initial')).toEqual(true);
    });

    it('renders the name of the logged in user in the navbar', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'initial',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        }
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.text.bold').text()).toEqual('ITK');
    });

    it('renders the four buttons in the navbar', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.button-container button').length).toEqual(4);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'Loan'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'Status'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'Hand in'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'Exit'
        );
    });

    it('renders the four buttons in the navbar', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.button-container button').length).toEqual(4);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'Loan'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'Status'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'Hand in'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'Exit'
        );
    });
});

describe('Tests of configuration', () => {
    it('render the logincomponent defined in the config (login barcode password)', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode_password'
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'LoginScan',
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.sub-header').text()).toEqual(
            'Scan dit bibliotekskort'
        );
    });

    it('render the logincomponent defined in the config (unilogin)', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'unilogin'
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'LoginScan',
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.sub-header').text()).toEqual(
            'Login med Unilogin'
        );
    });

    it('render the logincomponent defined in the config (login barcode)', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode'
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'LoginScan',
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.sub-header').text()).toEqual(
            'Scan dit bibliotekskort'
        );
    });

    it('render the school name from the configuration', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode'
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScan',
                        items: []
                    }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.navbar .text-container').text()).toEqual(
            'Mårslet Skole'
        );
    });
});

describe('Tests of callback data', () => {
    it('renders callback: {enterFlow, { flow: checkOutItems }} in initial when checkoutitems-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode'
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );

        wrapper.find('.bubble').at(0).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'checkOutItems' }]
        ]);
    });

    it('renders callback: {enterFlow, { flow: status }} in initial when status-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode'
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );

        wrapper.find('.bubble').at(1).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'status' }]
        ]);
    });

    it('renders callback: {enterFlow, { flow: checkInItems }} in initial when checkInItems-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginMethod: 'login_barcode'
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );

        wrapper.find('.bubble').at(2).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'checkInItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: checkOutItems }} in initial when checkInItems-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );
        wrapper.find('.button-container button').at(0).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'checkOutItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: status }} in initial when status-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );
        wrapper.find('.button-container button').at(1).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'status' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: checkInItems }} in initial when checkInItems-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );
        wrapper.find('.button-container button').at(2).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'checkInItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: reset }} in initial when reset-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>

        );
        wrapper.find('.button-container button').at(3).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['reset']
        ]);
    });
});

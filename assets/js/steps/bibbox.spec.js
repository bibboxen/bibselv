/**
 * @file
 * Tests of App.
 */

import React from 'react';
import Bibbox from './bibbox';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';

it('renders without crashing', () => {
    shallow(
        <Bibbox
            reservedBookInput={{}}
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
    );
});

describe('Initial component (Vælg en funktion...)', () => {
    it('renders the initial component when state is initial and it is logged out', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(
            wrapper.contains(
                <h1 className='mb-5'>Vælg en funktion for at starte</h1>
            )
        ).toEqual(true);
    });
});

describe('Check out items component (Udlån)', () => {
    it('renders login component when it is logged out', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(wrapper.find('.header').text()).toEqual('Login');
    });

    it('renders login component when logged out, even if there is items', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(wrapper.find('.header').text()).toEqual('Login');
    });

    it('renders check out items component when it is logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.contains(<div className='header'>Lån</div>)).toEqual(
            true
        );
    });

    it('renders item (book) with error in check out items component when logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(wrapper.contains(<div className='banner-header'>Fejl</div>)).toEqual(
            true
        );
    });

    it('renders item (book) in progress in check out items component when logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(
            wrapper.contains(<div className='banner-header'>Henter informationer</div>)
        ).toEqual(true);
    });

    it('renders item (book) that is checked in check out items component when logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(
            wrapper.contains(<div className='banner-header'>Insekter i farver</div>)
        ).toEqual(true);
    });
});

describe('Check in items component (Aflever)', () => {
    it('renders check in items component when it is logged out', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.contains(<div className='header'>Aflever</div>)).toEqual(
            true
        );
    });

    it('renders item (book) with error in check in items component when logged out', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(wrapper.contains(<div className='banner-header'>Fejl</div>)).toEqual(
            true
        );
    });

    it('renders item (book) in progress in check in items component when logged out', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(
            wrapper.contains(<div className='banner-header'>Henter informationer</div>)
        ).toEqual(true);
    });

    it('renders item (book) that is checked in check in items component when logged out', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(
            wrapper.contains(<div className='banner-header'>Insekter i farver</div>)
        ).toEqual(true);
    });

    it('renders check in items component when it is logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.contains(<div className='header'>Aflever</div>)).toEqual(
            true
        );
    });

    it('renders item (book) with error in check in items component when logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        expect(wrapper.contains(<div className='banner-header'>Fejl</div>)).toEqual(
            true
        );
    });

    it('renders item (book) in progress in check in items component when logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
                            id: '5313004343',
                            returnDate: 1600992000000,
                            status: 'inProgress',
                            itemIdentifier: 123
                        }
                    ]
                }}
                actionHandler={() => { }}
            />
        );

        expect(
            wrapper.contains(<div className='banner-header'>Henter informationer</div>)
        ).toEqual(true);
    });

    it('renders item (book) that is checked in check in items component when logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(
            wrapper.contains(<div className='banner-header'>Insekter i farver</div>)
        ).toEqual(true);
    });
});

describe('Status component', () => {
    it('renders the login page, when state is status and it is not logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.find('.header').text()).toEqual('Login');
    });

    it('renders the status component when the state is status and it is logged in', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
                boxConfigurationInput={{
                    soundEnabled: false,
                    inactivityTimeOut: 3000,
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
        );
        expect(wrapper.contains(<div className='header'>Status</div>)).toEqual(
            true
        );
    });

    it('renders the books from machine state when the state is status, it is logged in and there are books', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
                boxConfigurationInput={{
                    soundEnabled: false,
                    inactivityTimeOut: 3000,
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
        );
        expect(
            wrapper.contains(
                <div className='banner-header'>
                    Det eksperimenterende billedværksted: [Bind] 1: indføring i
                    den kunstneriske proces
                </div>
            )
        ).toEqual(true);
        expect(
            wrapper.contains(
                <div>Illustreret svampeflora af Lange, Morten</div>
            )
        ).toEqual(true);
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
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.exists('.navbar.initial')).toEqual(true);
    });

    it('renders the name of the logged in user in the navbar', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.find('.text.bold').text()).toEqual('ITK');
    });

    it('renders the four buttons in the navbar', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.find('.button-container button').length).toEqual(4);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'Lån'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'Status'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'Aflever'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'Afslut'
        );
    });

    it('renders the four buttons in the navbar', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.find('.button-container button').length).toEqual(4);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'Lån'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'Status'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'Aflever'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'Afslut'
        );
    });
});

describe('Tests of configuration', () => {
    it('render the logincomponent defined in the config (login barcode password)', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.find('.sub-header').text()).toEqual(
            'Scan dit bibliotekskort'
        );
    });

    it('render the logincomponent defined in the config (unilogin)', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
                boxConfigurationInput={{
                    soundEnabled: false,
                    id: 1,
                    hasPrinter: true,
                    reservedMaterialInstruction: 'NotSure',
                    inactivityTimeOut: 3000,
                    school: {
                        name: 'Mårslet Skole'
                    },
                    loginMethod: 'unilogin',
                    hasTouch: true,
                    hasKeyboard: true
                }}
                machineStateInput={{
                    flow: 'checkOutItems',
                    step: 'LoginScan',
                    items: []
                }}
                actionHandler={() => { }}
            />
        );
        expect(wrapper.find('.sub-header').text()).toEqual(
            'Login med Unilogin'
        );
    });

    it('render the logincomponent defined in the config (login barcode)', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        expect(wrapper.find('.sub-header').text()).toEqual(
            'Scan dit bibliotekskort'
        );
    });

    it('render the school name from the configuration', () => {
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
                boxConfigurationInput={{
                    soundEnabled: false,
                    id: 1,
                    hasPrinter: true,
                    reservedMaterialInstruction: 'NotSure',
                    inactivityTimeOut: 3000,
                    school: {
                        name: 'Mårslet Skole'
                    },
                    loginMethod: 'login_barcode',
                    hasTouch: true,
                    hasKeyboard: true
                }}
                machineStateInput={{
                    flow: 'checkOutItems',
                    step: 'loginScan',
                    items: []
                }}
                actionHandler={() => { }}
            />
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
            <Bibbox
                reservedBookInput={{}}
                boxConfigurationInput={{
                    soundEnabled: false,
                    id: 1,
                    hasPrinter: true,
                    reservedMaterialInstruction: 'NotSure',
                    inactivityTimeOut: 3000,
                    school: {
                        name: 'Mårslet Skole'
                    },
                    loginMethod: 'login_barcode',
                    hasTouch: true,
                    hasKeyboard: true
                }}
                machineStateInput={{
                    step: 'initial'
                }}
                actionHandler={mockCallBack}
            />
        );

        wrapper.find('.bubble').at(0).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'checkOutItems' }]
        ]);
    });

    it('renders callback: {enterFlow, { flow: status }} in initial when status-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        wrapper.find('.bubble').at(1).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'status' }]
        ]);
    });

    it('renders callback: {enterFlow, { flow: checkInItems }} in initial when checkInItems-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );

        wrapper.find('.bubble').at(2).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'checkInItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: checkOutItems }} in initial when checkInItems-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        wrapper.find('.button-container button').at(0).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'checkOutItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: status }} in initial when status-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        wrapper.find('.button-container button').at(1).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'status' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: checkInItems }} in initial when checkInItems-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        wrapper.find('.button-container button').at(2).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'checkInItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: reset }} in initial when reset-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <Bibbox
                reservedBookInput={{}}
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
        );
        wrapper.find('.button-container button').at(3).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['reset']
        ]);
    });
});

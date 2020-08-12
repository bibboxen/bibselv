/**
 * @file
 * Unit test for network plugin.
 */

'use strict';

const path = require('path');
const config = require(path.join(__dirname, 'config_test.json'));
const sinon = require('sinon');

let app = null;
const setup = () => {
    if (!app) {
        // Load config file.
        const config = require(path.join(__dirname, 'config_architect.json'));

        // Configure the plugins.
        const plugins = [
            {
                packagePath: './../plugins/bus'
            },
            {
                packagePath: './../plugins/client'
            },
            {
                packagePath: './../plugins/network'
            },
            {
                packagePath: './../plugins/ctrl',
                configPath: path.join(__dirname, 'config_ctrl.json')
            },
            {
                packagePath: './../plugins/fbs'
            },
            {
                packagePath: './../plugins/state_machine'
            }
        ];

        app = setupArchitect(plugins, config);
    }

    return app;
};

it('Smoke test', done => {
    setup().then(app => {
        done();
    }).catch(done.fail);
});

it('Test that reset can be called', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.reset(client);
        client.state.step.should.equal('initial');
    }).then(done).catch(done.fail);
});

it('Test that the checkOutItems flow can be entered from initial state', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.reset(client);
        client = app.services.state_machine.action(client, 'enterFlow', {
            flow: 'checkOutItems'
        });
        client.state.step.should.equal('loginScan');
        client.state.flow.should.equal('checkOutItems');
    }).then(done).catch(done.fail);
});

it('Test that test user can log in and check out an item', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        const spy = sinon.spy(app.services.state_machine, 'handleEvent');

        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'checkOutItems'
            }
        });
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        // @TODO: Handle this better than timeout.
        setTimeout(() => {
            client = app.services.client.load('123');

            client.state.step.should.equal('checkOutItems');
            client.state.flow.should.equal('checkOutItems');

            client.state.user.name.should.equal('Testkort');
            client.internal.username.should.equal('3210000000');
            client.internal.user.personalName.should.equal('Testkort Mickey Mouse');

            app.services.state_machine.handleEvent({
                token: '123',
                name: 'Action',
                action: 'checkOutItem',
                data: {
                    itemIdentifier: '3274626533'
                }
            });

            setTimeout(() => {
                const spyCall = app.services.state_machine.handleEvent.getCall(3);
                spyCall.firstArg.action.should.equal('checkOutItem');

                client = app.services.client.load('123');

                client.state.items.length.should.equal(1);
                client.state.items[0].itemIdentifier.should.equal('3274626533');
                client.state.items[0].title.should.equal('Helbred dit liv');
                client.state.items[0].status.should.equal('checkedOut');

                // Remove spy.
                spy.restore();

                done();
            }, 400);
        }, 400);
    }).catch(done.fail);
});

it('Test that the checkInItems flow can be entered from initial state', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.reset(client);
        client = app.services.state_machine.action(client, 'enterFlow', {
            flow: 'checkInItems'
        });
        client.state.step.should.equal('checkInItems');
        client.state.flow.should.equal('checkInItems');
    }).then(done).catch(done.fail);
});

it('Test that an item can be checked in', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });

        client = app.services.state_machine.action(client, 'enterFlow', {
            flow: 'checkInItems'
        });
        client.state.step.should.equal('checkInItems');
        client.state.flow.should.equal('checkInItems');

        const spy = sinon.spy(app.services.state_machine, 'handleEvent');

        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'checkInItem',
            data: {
                itemIdentifier: '3274626533'
            }
        });

        setTimeout(() => {
            const spyCall = app.services.state_machine.handleEvent.getCall(0);
            spyCall.firstArg.action.should.equal('checkInItem');

            client = app.services.client.load('123');

            client.state.items.length.should.equal(1);
            client.state.items[0].itemIdentifier.should.equal('3274626533');
            client.state.items[0].title.should.equal('Helbred dit liv');
            client.state.items[0].status.should.equal('checkedIn');

            // Remove spy.
            spy.restore();

            done();
        }, 500);
    }).catch(done.fail);
});

it('Test that the user ends in loginScan when changing flow from checkInItems to checkOutItems', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.reset(client);
        client = app.services.state_machine.action(client, 'enterFlow', {
            flow: 'checkInItems'
        });
        client.state.step.should.equal('checkInItems');
        client.state.flow.should.equal('checkInItems');

        client = app.services.state_machine.action(client, 'changeFlow', {
            flow: 'checkOutItems'
        });
        client.state.step.should.equal('loginScan');
        client.state.flow.should.equal('checkOutItems');
    }).then(done).catch(done.fail);
});

it('Test that the user can change to checkOutItems when logged in', done => {
    let client = {
        token: '234'
    };

    setup().then(app => {
        client = app.services.state_machine.handleEvent({
            token: '234',
            name: 'Reset'
        });

        client = app.services.state_machine.handleEvent({
            token: '234',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'checkOutItems'
            }
        });

        client = app.services.state_machine.handleEvent({
            token: '234',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        // @TODO: Handle this better than timeout.
        setTimeout(() => {
            client = app.services.client.load('234');

            client.state.step.should.equal('checkOutItems');
            client.state.flow.should.equal('checkOutItems');

            client.state.user.name.should.equal('Testkort');
            client.internal.user.personalName.should.equal('Testkort Mickey Mouse');

            client = app.services.state_machine.handleEvent({
                token: '234',
                name: 'Action',
                action: 'changeFlow',
                data: {
                    flow: 'checkInItems'
                }
            });

            client.state.step.should.equal('checkInItems');
            client.state.flow.should.equal('checkInItems');

            client = app.services.state_machine.handleEvent({
                token: '234',
                name: 'Action',
                action: 'changeFlow',
                data: {
                    flow: 'checkOutItems'
                }
            });

            client.state.step.should.equal('checkOutItems');
            client.state.flow.should.equal('checkOutItems');

            done();
        }, 500);
    }).catch(done.fail);
});

it('Tests that status can be retrieved', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });

        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'status'
            }
        });

        client.state.step.should.equal('loginScan');
        client.state.flow.should.equal('status');

        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        setTimeout(() => {
            client = app.services.client.load('123');

            client.state.step.should.equal('status');
            client.state.flow.should.equal('status');

            client.state.user.name.should.equal('Testkort');
            client.state.user.birthdayToday.should.equal(false);

            client.state.holdItems.length.should.equal(3);
            client.state.overdueItems.length.should.equal(1);
            client.state.chargedItems.length.should.equal(3);
            client.state.fineItems.length.should.equal(1);
            client.state.recallItems.length.should.equal(1);
            client.state.unavailableHoldItems.length.should.equal(1);

            done();
        }, 400);
    }).catch(done.fail);
});

it('Tests that status is refreshed when visiting status again after login', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });

        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'status'
            }
        });

        client.state.step.should.equal('loginScan');
        client.state.flow.should.equal('status');

        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        setTimeout(() => {
            client = app.services.client.load('123');

            client.state.step.should.equal('status');
            client.state.flow.should.equal('status');
            client.state.statusRefreshing.should.equal(false);

            client.state.user.name.should.equal('Testkort');
            client.state.user.birthdayToday.should.equal(false);

            client.state.holdItems.length.should.equal(3);

            client = app.services.state_machine.handleEvent({
                token: '123',
                name: 'Action',
                action: 'changeFlow',
                data: {
                    flow: 'checkOutItems'
                }
            });

            client.state.step.should.equal('checkOutItems');
            client.state.flow.should.equal('checkOutItems');

            client = app.services.state_machine.handleEvent({
                token: '123',
                name: 'Action',
                action: 'changeFlow',
                data: {
                    flow: 'status'
                }
            });

            client.state.statusRefreshing.should.equal(true);

            setTimeout(() => {
                client.state.step.should.equal('status');
                client.state.flow.should.equal('status');
                client.state.statusRefreshing.should.equal(false);
                client.state.holdItems.length.should.equal(4);

                done();
            }, 600);
        }, 400);
    }).catch(done.fail);
});

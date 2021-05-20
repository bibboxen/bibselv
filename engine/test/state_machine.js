/**
 * @file
 * Unit test for state machine plugin.
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
                packagePath: './../plugins/client',
                persistent: false,
                redisConfig: {}
            },
            {
                packagePath: './../plugins/config',
                config: config.boxConfig,
                isEventExpired: 1000
            },
            {
                packagePath: './../plugins/fbs',
                fbsEndPoint: config.fbsEndPoint,
                config: config.fbsOnlineCheckConfig,
                enableOnlineChecks: false
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
        token: '123',
        config: config.fbs
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
    const client = {
        token: '123',
        config: config.fbs
    };

    setup().then(app => {
        const spy = sinon.spy(app.services.state_machine, 'handleEvent');

        // Set client configuration in state.
        app.services.client.save(client.token, client);

        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });
        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'checkOutItems'
            }
        });
        app.services.state_machine.handleEvent({
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
            app.services.client.load('123').then(function(client) {
                client.state.step.should.equal('checkOutItems');
                client.state.flow.should.equal('checkOutItems');

                client.state.user.name.should.equal('Testkort Mickey Mouse');
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

                    app.services.client.load('123').then(function(client) {
                        client.state.items.length.should.equal(1);
                        client.state.items[0].itemIdentifier.should.equal('3274626533');
                        client.state.items[0].title.should.equal('Helbred dit liv');
                        client.state.items[0].status.should.equal('checkedOut');

                        // Remove spy.
                        spy.restore();

                        done();
                    }).catch(done.fail);
                }, 400);
            }).catch(done.fail);
        }, 400);
    }).catch(done.fail);
});

it('Test that the checkInItems flow can be entered from initial state', done => {
    let client = {
        token: '123',
        config: config.fbs
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
    const client = {
        token: '123',
        config: config.fbs
    };

    setup().then(app => {
        app.services.state_machine.reset(client);
        app.services.state_machine.action(client, 'enterFlow', {
            flow: 'checkInItems'
        });
        client.state.step.should.equal('checkInItems');
        client.state.flow.should.equal('checkInItems');

        const spy = sinon.spy(app.services.state_machine, 'handleEvent');
        app.services.client.save(client.token, client);
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

            app.services.client.load('123').then(function(client) {
                client.state.items.length.should.equal(1);
                client.state.items[0].itemIdentifier.should.equal('3274626533');
                client.state.items[0].title.should.equal('Helbred dit liv');
                client.state.items[0].status.should.equal('checkedIn');

                // Remove spy.
                spy.restore();

                done();
            }).catch(done.fail);
        }, 500);
    }).catch(done.fail);
});

it('Test that the user ends in loginScan when changing flow from checkInItems to checkOutItems', done => {
    let client = {
        token: '123',
        config: config.fbs
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
    const client = {
        token: '234',
        config: config.fbs
    };

    setup().then(app => {
        app.services.client.save(client.token, client);
        app.services.state_machine.handleEvent({
            token: '234',
            name: 'Reset'
        });

        app.services.state_machine.handleEvent({
            token: '234',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'checkOutItems'
            }
        });

        app.services.state_machine.handleEvent({
            token: '234',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        // Timeout here is due to the fact the the system bus sends message to FBS that have to make changes.
        setTimeout(() => {
            app.services.client.load('234').then(function(client) {
                client.state.step.should.equal('checkOutItems');
                client.state.flow.should.equal('checkOutItems');

                client.state.user.name.should.equal('Testkort Mickey Mouse');
                client.internal.user.personalName.should.equal('Testkort Mickey Mouse');

                app.services.state_machine.handleEvent({
                    token: '234',
                    name: 'Action',
                    action: 'changeFlow',
                    data: {
                        flow: 'checkInItems'
                    }
                });

                setTimeout(() => {
                    client.state.step.should.equal('checkInItems');
                    client.state.flow.should.equal('checkInItems');

                    app.services.state_machine.handleEvent({
                        token: '234',
                        name: 'Action',
                        action: 'changeFlow',
                        data: {
                            flow: 'checkOutItems'
                        }
                    });

                    setTimeout(() => {
                        client.state.step.should.equal('checkOutItems');
                        client.state.flow.should.equal('checkOutItems');

                        done();
                    }, 500);
                }, 500);
            }).catch(done.fail);
        }, 500);
    }).catch(done.fail);
});

it('Tests that status can be retrieved', done => {
    const client = {
        token: '123',
        config: config.fbs
    };

    setup().then(app => {
        app.services.client.save(client.token, client);
        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });

        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'status'
            }
        });

        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        setTimeout(() => {
            app.services.client.load('123').then(function(client) {
                client.state.step.should.equal('status');
                client.state.flow.should.equal('status');

                client.state.user.name.should.equal('Testkort Mickey Mouse');
                client.state.user.birthdayToday.should.equal(false);

                client.state.holdItems.length.should.equal(3);
                client.state.overdueItems.length.should.equal(1);
                client.state.chargedItems.length.should.equal(3);
                client.state.fineItems.length.should.equal(1);
                client.state.recallItems.length.should.equal(1);
                client.state.unavailableHoldItems.length.should.equal(1);

                done();
            }).catch(done.fail);
        }, 400);
    }).catch(done.fail);
});

it('Tests that status is refreshed when visiting status again after login', done => {
    const client = {
        token: '123',
        config: config.fbs
    };

    setup().then(app => {
        // Set client configuration in state.
        app.services.client.save(client.token, client);
        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });

        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'status'
            }
        });

        app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        setTimeout(() => {
            app.services.client.load('123').then(function(client) {
                client.state.step.should.equal('status');
                client.state.flow.should.equal('status');
                client.state.statusRefreshing.should.equal(false);

                // Current number of items.
                client.state.holdItems.length.should.equal(3);

                app.services.state_machine.handleEvent({
                    token: '123',
                    name: 'Action',
                    action: 'changeFlow',
                    data: {
                        flow: 'checkOutItems'
                    }
                });

                app.services.state_machine.handleEvent({
                    token: '123',
                    name: 'Action',
                    action: 'checkOutItem',
                    data: {
                        flow: 'checkOutItems'
                    }
                });

                setTimeout(() => {
                    client.state.step.should.equal('checkOutItems');
                    client.state.flow.should.equal('checkOutItems');

                    app.services.state_machine.handleEvent({
                        token: '123',
                        name: 'Action',
                        action: 'changeFlow',
                        data: {
                            flow: 'status'
                        }
                    });

                    setTimeout(() => {
                        client.state.step.should.equal('status');
                        client.state.flow.should.equal('status');
                        client.state.holdItems.length.should.equal(4);

                        done();
                    }, 400);
                }, 500);
            }).catch(done.fail);
        }, 500);
    }).catch(done.fail);
});

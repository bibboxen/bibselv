/**
 * @file
 * Provide the state machine.
 */

'use strict';

const machina = require('machina');
const debug = require('debug')('bibbox:STATE_MACHINE:main');
const uniqid = require('uniqid');

/**
 * Register the plugin.
 *
 * @param {array} options
 *   Options defined in app.js.
 * @param {array} imports
 *   The other plugins available.
 * @param {function} register
 *   Callback function used to register this plugin.
 */
module.exports = function (options, imports, register) {
    const bus = imports.bus;
    const clientModule = imports.client;
    let defaultPassword = null;

    const fbsConfigEvent = uniqid('ctrl.config.fbs.');

    bus.on(fbsConfigEvent, config => {
        defaultPassword = config.defaultPassword
    });

    bus.emit('ctrl.config.fbs', {
        busEvent: fbsConfigEvent,
    });

    // See http://machina-js.org/ for information about machina fsm.

    const stateMachine = new machina.BehavioralFsm({
        namespace: 'bibbox',
        initialState: 'uninitialized',
        states: {
            uninitialized: {
                _onEnter: function (client) {
                    debug('Entered uninitialized on client: ' + client.token);
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                '*': function (client) {
                    this.deferUntilTransition(client);
                    client.state = {};
                    this.transition(client, 'initial');
                }
            },
            initial: {
                _onEnter: function (client) {
                    debug('Entered initial on client: ' + client.token);
                    client.state = {
                        step: 'initial'
                    };
                    client.internal = {};
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                _reset: function (client) {
                    this.transition(client, 'initial');
                },
                enterFlow: function (client) {
                    debug('Triggered enterFlow on client: ' + client.token, client.actionData);
                    client.state.flow = client.actionData.flow;
                    this.transition(client, 'chooseLogin');
                }
            },
            chooseLogin: {
                _onEnter: function (client) {
                    debug('Entered chooseLogin on client: ' + client.token);
                    client.state.step = 'chooseLogin';
                    this.transition(client, 'loginScan');
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                _reset: function (client) {
                    this.transition(client, 'initial');
                },
                '*': function (client) {
                    console.log('chooseLogin: *', client);
                }
            },
            loginScan: {
                _onEnter: function (client) {
                    debug('Entered loginScan on client: ' + client.token);
                    client.state.step = 'loginScan';
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                _reset: function (client) {
                    this.transition(client, 'initial');
                },
                login: function (client) {
                    debug('Triggered login on client: ' + client.token, client.actionData);
                    const loginData = client.actionData;

                    const busEvent = uniqid('fbs.patron.');
                    const errEvent = uniqid('fbs.patron.err.');

                    bus.once(busEvent, resp => {
                        debug("Login success");

                        const now = new Date();

                        const user = resp.patron;
                        const names = user.personalName.split(' ');
                        const birthday = user.PB;
                        const birthdayToday =
                            now.getDate().toString() === birthday.substr(6,7) &&
                            now.getMonth().toString() === birthday.substr(4,5);

                        const actionData = {
                            user: {
                                name: names[0],
                                birthdayToday: birthdayToday,
                            },
                            internal: {
                                username: loginData.username,
                                password: loginData.password,
                                user: user
                            }
                        };

                        handleEvent({
                            name: 'Action',
                            token: client.token,
                            action: 'loginSuccess',
                            data: actionData
                        });
                    });

                    bus.once(errEvent, (resp) => {
                        debug("Login error", resp);

                        const result = resp.result;

                        handleEvent({
                            name: 'Action',
                            token: client.token,
                            action: 'loginError',
                            data: {
                                error: result.displayMessage
                            }
                        });
                    });

                    bus.emit('fbs.patron', {
                        busEvent: busEvent,
                        errorEvent: errEvent,
                        username: loginData.username,
                        password: defaultPassword
                        //password: loginData.password
                    });
                },
                loginError: function (client) {
                    debug('Triggered loginError on client: ' + client.token, client.actionData);
                    client.state.loginError = client.actionData.error;
                },
                loginSuccess: function (client) {
                    debug('Triggered loginSuccess on client: ' + client.token, client.actionData);
                    client.state.user = client.actionData.user;
                    client.internal = client.actionData.internal;
                    this.transition(client, client.state.flow);
                }
            },
            borrow: {
                _onEnter: function (client) {
                    debug('Entered borrow on client: ' + client.token);
                    client.state.step = 'borrow';
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                _reset: function (client) {
                    this.transition(client, 'initial');
                },
                borrowMaterial: function (client) {
                    debug('Triggered borrowMaterial on client: ' + client.token, client);

                    let newMaterial = client.actionData;

                    // Ignore material if it is already borrowed or inProgress.
                    // @TODO: Handle retry case.
                    if (client.state.materials) {
                        let oldMaterials = client.state.materials.filter(material => {
                            return material.itemIdentifier === newMaterial.itemIdentifier && !['borrowed', 'inProgress'].includes(material.status)
                        });

                        if (oldMaterials.length > 0) {
                            return;
                        }
                    }

                    newMaterial.status = 'inProgress';
                    stateMachine.action(client, 'materialUpdate', newMaterial);

                    const busEvent = uniqid('fbs.checkout.');
                    const errEvent = uniqid('fbs.checkout.err.');

                    bus.once(busEvent, resp => {
                        debug("Checkout success");

                        const result = resp.result;

                        let material = {
                            itemIdentifier: result.itemIdentifier,
                            title: result.itemProperties.title,
                            author: result.itemProperties.author,
                            renewalOk: result.renewalOk ? 'Ja' : 'Nej',
                            message: result.screenMessage,
                        };

                        if (resp.ok === '1') {
                            material.status = 'borrowed';

                            handleEvent({
                                name: 'Action',
                                token: client.token,
                                action: 'materialUpdate',
                                data: material
                            });
                        }
                        else {
                            material.status = 'error';

                            handleEvent({
                                name: 'Action',
                                token: client.token,
                                action: 'materialUpdate',
                                data: material
                            });
                        }
                    });

                    bus.once(errEvent, (resp) => {
                        debug("Checkout error", resp);
                    });

                    bus.emit('fbs.checkout', {
                        busEvent: busEvent,
                        errorEvent: errEvent,
                        itemIdentifier: newMaterial.itemIdentifier,
                        username: client.internal.username,
                        password: defaultPassword,
                        // password: client.internal.password,
                    });
                },
                materialUpdate: function (client) {
                    debug('Triggered materialUpdate on client: ' + client.token, client.actionData);

                    if (!client.state.materials) {
                        client.state.materials = [];
                    }

                    const materialIndex = client.state.materials.findIndex((material) => material.itemIdentifier === client.actionData.itemIdentifier);

                    if (materialIndex === -1) {
                        client.state.materials.push(client.actionData);
                    }
                    else {
                        client.state.materials[materialIndex] = client.actionData;
                    }
                }
            }
        },

        reset: function (client) {
            debug('Reset on client: ' + client.token);
            this.handle(client, '_reset');
            return client;
        },
        action: function (client, action, data) {
            debug('Action ' + action + ' on client: ' + client.token);
            client.actionData = data;
            this.handle(client, action);
            return client;
        }
    });

    const handleEvent = function (event) {
        debug('handleEvent', event);

        let client = clientModule.load(event.token);

        switch (event.name) {
            case 'Reset':
                client = stateMachine.reset(client);
                break;
            case 'Action':
                client = stateMachine.action(client, event.action, event.data);
                break;
        }

        client.actionData = null;
        clientModule.save(event.token, client);

        // Emit new client state.
        bus.emit('state_machine.state_update.' + client.token, client.state);
    };

    // Listener for events in the state machine.
    bus.on('state_machine.event', (event) => {
        debug('Received event "state_machine.event"', event);
        handleEvent(event);
    });

    bus.on('state_machine.start', (data) => {
        debug('state_machine.start', data);

        let client = clientModule.load(data.token);
        client = stateMachine.reset(client);

        clientModule.save(data.token, client);

        bus.emit(data.busEvent, client);
    });

    // Register exposed function with architect.
    register(null, {
        state_machine: stateMachine
    });

    debug('Registered plugin');
};

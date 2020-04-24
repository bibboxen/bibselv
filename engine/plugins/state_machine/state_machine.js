/**
 * @file
 * Provide the state machine.
 */

'use strict';

const machina = require('machina');
const debug = require('debug')('bibbox:STATE_MACHINE:main');

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

    // See http://machina-js.org/ for information about machina fsm.

    const stateMachine = new machina.BehavioralFsm({
        namespace: 'bibbox',
        initialState: 'uninitialized',
        states: {
            uninitialized: {
                _onEnter: function (client) {
                    debug('Entered uninitialized on client: ' + client.id);
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
                    debug('Entered initial on client: ' + client.id);
                    client.state = {
                        step: 'initial'
                    };
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                _reset: function (client) {
                    this.transition(client, 'initial');
                },
                enterFlow: function (client) {
                    debug('Triggered enterFlow on client: ' + client.id, client.actionData);
                    client.state.flow = client.actionData.flow;
                    this.transition(client, 'chooseLogin');
                }
            },
            chooseLogin: {
                _onEnter: function (client) {
                    debug('Entered chooseLogin on client: ' + client.id);
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
                    debug('Entered loginScan on client: ' + client.id);
                    client.state.step = 'loginScan';
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                _reset: function (client) {
                    this.transition(client, 'initial');
                },
                login: function (client) {
                    const loginData = client.actionData;

                    // @TODO: Login with fbs plugin.
                    client.actionData = {
                        user: {
                            name: "Test user"
                        }
                    };
                    this.handle(client, 'loginSuccess');
                },
                loginError: function (client) {
                    debug('Triggered loginError on client: ' + client.id, client.actionData);
                    client.state.loginError = client.actionData;
                },
                loginSuccess: function (client) {
                    debug('Triggered loginSuccess on client: ' + client.id, client.actionData);
                    client.state.user = client.actionData.user;
                    this.transition(client, client.state.flow);
                }
            },
            borrow: {
                _onEnter: function (client) {
                    debug('Entered borrow on client: ' + client.id);
                    client.state.step = 'borrow';
                },
                _onExit: function (client) {
                    client.actionData = null;
                },
                _reset: function (client) {
                    this.transition(client, 'initial');
                },
                borrowMaterial: function (client) {
                    // @TODO: Send to fbs.
                    client.actionData.status = 'inProgress';
                    stateMachine.action(client, 'materialUpdate', client.actionData);

                    let material = client.actionData;
                    setTimeout(() => {
                        material.status = 'borrowed';
                        handleEvent({
                            token: client.token,
                            action: 'materialUpdate',
                            data: material
                        })
                    }, 2500);
                },
                materialUpdate: function (client) {
                    debug('Triggered materialUpdate on client: ' + client.id, client.actionData);

                    if (!client.state.materials) {
                        client.state.materials = [];
                    }

                    const materialIndex = client.state.materials.findIndex((material) => material.id === client.actionData.id);

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

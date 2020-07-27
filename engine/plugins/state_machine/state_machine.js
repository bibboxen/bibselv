/**
 * @file
 * Provide the state machine.
 */

'use strict';

const machina = require('machina');
const debug = require('debug')('bibbox:STATE_MACHINE:main');
const uniqid = require('uniqid');
const ActionHandler = require('./actionHandler.js');

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
module.exports = function(options, imports, register) {
    const bus = imports.bus;
    const clientModule = imports.client;
    let defaultPassword = null;

    const fbsConfigEvent = uniqid('ctrl.config.fbs.');

    // @TODO: What is the default password and why can it be NULL as default?
    bus.on(fbsConfigEvent, config => {
        defaultPassword = config.defaultPassword;
    });

    // Request config.
    bus.emit('ctrl.config.fbs', {
        busEvent: fbsConfigEvent
    });

    // @TODO: Maybe this comment below should be in the @file documentation block.
    // See http://machina-js.org/ for information about machina fsm.
    const stateMachine = new machina.BehavioralFsm({
        namespace: 'bibbox',
        initialState: 'uninitialized',
        states: {
            // @TODO: Maybe an comment about each state and what this state is used for?
            uninitialized: {
                _onEnter: function(client) {
                    debug('Entered uninitialized on client: ' + client.token);
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                '*': function(client) {
                    this.deferUntilTransition(client);
                    client.state = {};
                    this.transition(client, 'initial');
                }
            },
            initial: {
                _onEnter: function(client) {
                    debug('Entered initial on client: ' + client.token);
                    client.state = {
                        step: 'initial'
                    };
                    client.internal = {};
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                _reset: function(client) {
                    this.transition(client, 'initial');
                },
                enterFlow: function(client) {
                    debug('Triggered enterFlow on client: ' + client.token, client.actionData);
                    client.state.flow = client.actionData.flow;
                    this.transition(client, 'chooseLogin');
                }
            },
            chooseLogin: {
                _onEnter: function(client) {
                    debug('Entered chooseLogin on client: ' + client.token);
                    client.state.step = 'chooseLogin';
                    this.transition(client, 'loginScan');
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                _reset: function(client) {
                    this.transition(client, 'initial');
                },
                '*': function(client) {
                    console.log('chooseLogin: *', client);
                }
            },
            loginScan: {
                _onEnter: function(client) {
                    debug('Entered loginScan on client: ' + client.token);
                    client.state.step = 'loginScan';
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                _reset: function(client) {
                    this.transition(client, 'initial');
                },
                login: function(client) {
                    debug('Triggered login on client: ' + client.token, client.actionData);
                    client.actionData.password = defaultPassword;
                    actionHandler.login(client);
                },
                loginError: function(client) {
                    debug('Triggered loginError on client: ' + client.token, client.actionData);
                    client.state.loginError = client.actionData.error;
                },
                loginSuccess: function(client) {
                    debug('Triggered loginSuccess on client: ' + client.token, client.actionData);
                    client.state.user = client.actionData.user;
                    client.internal = client.actionData.internal;
                    this.transition(client, client.state.flow);
                }
            },
            borrow: {
                _onEnter: function(client) {
                    debug('Entered borrow on client: ' + client.token);
                    client.state.step = 'borrow';
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                _reset: function(client) {
                    this.transition(client, 'initial');
                },
                borrowMaterial: function(client) {
                    debug('Triggered borrowMaterial on client: ' + client.token, client);
                    actionHandler.borrowMaterial(client);
                },
                materialUpdate: function(client) {
                    debug('Triggered materialUpdate on client: ' + client.token, client.actionData);
                    actionHandler.materialUpdate(client);
                }
            }
        },

        reset: function(client) {
            debug('Reset on client: ' + client.token);
            this.handle(client, '_reset');
            return client;
        },

        action: function(client, action, data) {
            debug('Action ' + action + ' on client: ' + client.token);
            client.actionData = data;
            this.handle(client, action);
            return client;
        }
    });

    /**
     * Handle a state machine event.
     *
     * @param event
     */
    const handleEvent = function(event) {
        debug('handleEvent');
        debug(event);

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

        return client;
    };

    stateMachine.handleEvent = handleEvent;
    const actionHandler = new ActionHandler(bus, handleEvent, stateMachine);

    // Listener for events in the state machine.
    bus.on('state_machine.event', (event) => {
        debug('Received event "state_machine.event"', event);
        handleEvent(event);
    });

    // Listener for start event.
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

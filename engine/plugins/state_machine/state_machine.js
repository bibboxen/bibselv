/**
 * @file
 * Provides a state machine for each physical machine.
 *
 * See http://machina-js.org/ for information about machina fsm.
 */

'use strict';

const machina = require('machina');
const debug = require('debug')('bibbox:STATE_MACHINE:main');
const ActionHandler = require('./action_handler.js');

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

    // Setup state machine.
    const stateMachine = new machina.BehavioralFsm({
        namespace: 'bibbox',
        initialState: 'uninitialized',
        states: {
            /**
             * Uninitialized state is the first state the client enters.
             * It automatically transitions to initial state.
             */
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
            /**
             * The initial state is basic state of a client where no user is
             * logged in and no flow has been started.
             */
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
                /**
                 * The user enters a flow on a client.
                 *
                 * @param client
                 */
                enterFlow: function(client) {
                    debug('Triggered enterFlow on client: ' + client.token);
                    actionHandler.enterFlow(client, client.actionData.flow);
                }
            },
            /**
             * Choose Login state is for choosing login method.
             *
             * Since there is only one login method supported at the moment, it
             * automatically transitions to this state.
             *
             * @TODO: Handle more login methods.
             */
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
                }
            },
            /**
             * Login Scan state is for scanning the username/password.
             *
             * @TODO: Rename to a more appropriate name consistent with the frontend.
             */
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
                /**
                 * Login a user on the client.
                 *
                 * @param client
                 *   The client.
                 */
                login: function(client) {
                    debug('Triggered login on client: ' + client.token);

                    // Use default password if requested.
                    if (client.actionData.useDefaultPassword) {
                        client.actionData.password = client.config.defaultPassword;
                    }
                    actionHandler.login(client);
                },
                /**
                 * Login error for login attempt on client.
                 *
                 * @param client
                 *   The client.
                 */
                loginError: function(client) {
                    debug('Triggered loginError on client: ' + client.token);
                    client.state.loginError = client.actionData.error;
                },
                /**
                 * Login success for login attempt on client.
                 *
                 * @param client
                 *   The client.
                 */
                loginSuccess: function(client) {
                    debug('Triggered loginSuccess on client: ' + client.token);
                    client.state.user = client.actionData.user;
                    client.internal = client.actionData.internal;
                    this.transition(client, client.state.flow);
                }
            },
            /**
             * Check out items.
             */
            checkOutItems: {
                _onEnter: function(client) {
                    debug('Entered checkOut on client: ' + client.token);
                    client.state.step = 'checkOutItems';
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                _reset: function(client) {
                    this.transition(client, 'initial');
                },
                /**
                 * Check out an item on the client.
                 *
                 * @param client
                 *   The client.
                 */
                checkOutItem: function(client) {
                    debug('Triggered checkOutItem on client: ' + client.token);
                    actionHandler.checkOutItem(client);
                },
                /**
                 * Update an item for a client.
                 *
                 * @param client
                 *   The client.
                 */
                itemUpdate: function(client) {
                    debug('Triggered itemUpdate on client: ' + client.token);
                    actionHandler.itemUpdate(client);
                },
                /**
                 * Change flow for a client.
                 *
                 * @param client
                 *   The client.
                 */
                changeFlow: function(client) {
                    debug('Triggered changeFlow on client: ' + client.token);
                    actionHandler.changeFlow(client, client.actionData.flow);
                }
            },
            checkInItems: {
                _onEnter: function(client) {
                    debug('Entered checkInItems on client: ' + client.token);
                    client.state.step = 'checkInItems';
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                _reset: function(client) {
                    this.transition(client, 'initial');
                },
                /**
                 * Check in an item on the client.
                 *
                 * @param client
                 *   The client.
                 */
                checkInItem: function(client) {
                    debug('Triggered checkInItem on client: ' + client.token);
                    actionHandler.checkInItem(client);
                },
                /**
                 * Update an item on the client.
                 *
                 * @param client
                 *   The client.
                 */
                itemUpdate: function(client) {
                    debug('Triggered itemUpdate on client: ' + client.token);
                    actionHandler.itemUpdate(client);
                },
                /**
                 * Change flow for a client.
                 *
                 * @param client
                 *   The client.
                 */
                changeFlow: function(client) {
                    debug('Triggered changeFlow on client: ' + client.token);
                    actionHandler.changeFlow(client, client.actionData.flow);
                }
            },
            /**
             * Get the user's status.
             */
            status: {
                _onEnter: function(client) {
                    debug('Entered status on client: ' + client.token);
                    actionHandler.status(client);
                },
                _onExit: function(client) {
                    client.actionData = null;
                },
                _reset: function(client) {
                    this.transition(client, 'initial');
                },
                /**
                 * Change flow for a client.
                 *
                 * @param client
                 *   The client.
                 */
                changeFlow: function(client) {
                    debug('Triggered changeFlow on client: ' + client.token);
                    actionHandler.changeFlow(client, client.actionData.flow);
                },
                /**
                 * The status has been updated for the user that is logged into the client.
                 *
                 * @param client
                 *   The client.
                 */
                statusUpdated: function(client) {
                    debug('Triggered statusUpdated on client: ' + client.token);
                    client.state = Object.assign({}, client.state, client.actionData);
                }
            }
        },

        /**
         * Reset the client.
         *
         * @param client
         *   The client to reset.
         * @return {*}
         */
        reset: function(client) {
            debug('Reset on client: ' + client.token);
            this.handle(client, '_reset');
            return client;
        },

        /**
         * Perform an action on a client.
         *
         * @param client
         *   The client.
         * @param action
         *   The name of the action.
         * @param data
         *   The action data.
         *
         * @return {*}
         *   The client.
         */
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
     *   The event to handle. Should have the following structure:
     *   {
     *     token: [client token],
     *     name: [Reset|Action],
     *     action: [if name==Action, contains the name of the action],
     *     data: [if name==Action, contains the data of the action],
     *   }
     *
     * @return
     *   The client.
     */
    const handleEvent = function(event) {
        clientModule.load(event.token).then(function load(client) {
            switch (event.name) {
                case 'Reset':
                    client = stateMachine.reset(client);
                    break;
                case 'Action':
                    client = stateMachine.action(client, event.action, event.data);
                    break;
                default:
                    // Ignore other event names.
                    break;
            }

            client.actionData = null;
            clientModule.save(event.token, client);

            // Emit new client state.
            bus.emit('state_machine.state_update.' + client.token, client.state);
        });
    };

    stateMachine.handleEvent = handleEvent;
    const actionHandler = new ActionHandler(bus, handleEvent, stateMachine);

    /**
     * Listener for events in the state machine.
     */
    bus.on('state_machine.event', (event) => {
        debug('Received event "state_machine.event"');
        handleEvent(event);
    });

    /**
     * Listener for start event.
     */
    bus.on('state_machine.start', (data) => {
        debug('state_machine.start', data.token);

        clientModule.load(data.token, data.config).then(function load(client) {
            client = stateMachine.reset(client);
            clientModule.save(data.token, client);

            bus.emit(data.busEvent, client);
        });
    });

    // Register exposed function with architect.
    register(null, {
        state_machine: stateMachine
    });

    debug('Registered plugin');
};

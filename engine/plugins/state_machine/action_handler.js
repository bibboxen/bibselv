/**
 * @file
 * Action handler for state machine.
 */

const debug = require('debug')('bibbox:STATE_MACHINE:actions');
const uniqid = require('uniqid');

/**
 * ActionHandler.
 *
 * Contains actions for the state machine.
 */
class ActionHandler {
    /**
     * ActionHandler constructor.
     *
     * @param bus
     *   The event bus.
     * @param handleEvent
     *   The function used
     * @param stateMachine
     */
    constructor(bus, handleEvent, stateMachine) {
        this.bus = bus;
        this.handleEvent = handleEvent;
        this.stateMachine = stateMachine;
    }

    /**
     * Enter a flow for the client.
     *
     * @param client
     *   The client.
     * @param flow
     *   The name of the flow to start.
     */
    enterFlow(client, flow) {
        client.state.flow = client.actionData.flow;

        // Check in flow does not require that the user is logged in.
        if (flow === 'checkInItems') {
            this.stateMachine.transition(client, 'checkInItems');
        } else {
            this.stateMachine.transition(client, 'chooseLogin');
        }
    }

    /**
     * Check out item for the client.
     *
     * @param client
     *   The client.
     */
    checkOutItem(client) {
        const newItem = client.actionData;

        // Ignore item if it is already checkedOut or inProgress.
        // @TODO: Handle retry case.
        if (client.state.items) {
            const oldItems = client.state.items.filter(item => {
                return item.itemIdentifier === newItem.itemIdentifier && !['checkedOut', 'inProgress'].includes(item.status);
            });

            if (oldItems.length > 0) {
                return;
            }
        }

        newItem.status = 'inProgress';
        this.stateMachine.action(client, 'itemUpdate', newItem);

        const busEvent = uniqid('fbs.checkout.');
        const errEvent = uniqid('fbs.checkout.err.');

        /**
         * Listen for check out success event.
         */
        this.bus.once(busEvent, resp => {
            debug('Check out success');

            const result = resp.result;

            debug(resp);
            debug(result);

            const item = {
                itemIdentifier: result.itemIdentifier,
                title: result.itemProperties.title,
                author: result.itemProperties.author,
                // FBS value of Y equals that the item is renewed.
                renewalOk: result.renewalOk === 'Y',
                message: result.screenMessage
            };

            // FBS value of 1 equals success.
            if (result.ok === '1') {
                // FBS value of Y equals that the item is renewed.
                if (result.renewalOk === 'Y') {
                    item.status = 'renewed';
                } else {
                    item.status = 'checkedOut';
                }

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'itemUpdate',
                    data: item
                });
            } else {
                item.status = 'error';

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'itemUpdate',
                    data: item
                });
            }
        });

        /**
         * Listen for check out error event.
         */
        this.bus.once(errEvent, (resp) => {
            debug('Checkout error', resp);
        });

        /**
         * Emit the check out event.
         */
        this.bus.emit('fbs.checkout', {
            busEvent: busEvent,
            errorEvent: errEvent,
            itemIdentifier: newItem.itemIdentifier,
            username: client.internal.username,
            password: client.internal.password
        });
    }

    /**
     * Check in item for the client.
     *
     * @param client
     *   The client.
     */
    checkInItem(client) {
        const newItem = client.actionData;

        // Ignore item if it is already checkedIn or inProgress.
        // @TODO: Handle retry case.
        if (client.state.items) {
            const oldItems = client.state.items.filter(item => {
                return item.itemIdentifier === newItem.itemIdentifier && !['checkedIn', 'inProgress'].includes(item.status);
            });

            if (oldItems.length > 0) {
                return;
            }
        }

        newItem.status = 'inProgress';
        this.stateMachine.action(client, 'itemUpdate', newItem);

        const busEvent = uniqid('fbs.checkin.');
        const errEvent = uniqid('fbs.checkin.err.');

        /**
         * Listen for check in success event.
         */
        this.bus.once(busEvent, resp => {
            debug('Check in success');

            const result = resp.result;

            debug(resp);
            debug(result);

            const item = {
                itemIdentifier: result.itemIdentifier,
                title: result.itemProperties.title,
                author: result.itemProperties.author,
                message: result.screenMessage
            };

            // FBS value of 1 equals success.
            if (result.ok === '1') {
                item.status = 'checkedIn';

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'itemUpdate',
                    data: item
                });
            } else {
                item.status = 'error';

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'itemUpdate',
                    data: item
                });
            }
        });

        /**
         * Listen for check in error event.
         */
        this.bus.once(errEvent, (resp) => {
            debug('Checkin error', resp);
        });

        /**
         * Emit the check in event.
         */
        this.bus.emit('fbs.checkin', {
            busEvent: busEvent,
            errorEvent: errEvent,
            itemIdentifier: newItem.itemIdentifier
        });
    }

    /**
     * Login the client.
     *
     * @param client
     *   The client.
     */
    login(client) {
        const loginData = client.actionData;

        const busEvent = uniqid('fbs.patron.');
        const errEvent = uniqid('fbs.patron.err.');

        /**
         * Listen for login success event.
         */
        this.bus.once(busEvent, resp => {
            debug('Login success');
            debug(resp);

            const user = resp.patron;
            const names = user.personalName.split(' ');
            let birthdayToday = false;

            if (Object.prototype.hasOwnProperty.call(user, 'PB')) {
                const nowDate = new Date();
                const birthday = user.PB;

                birthdayToday =
                    nowDate.getDate().toString() === birthday.substr(6, 7) &&
                    nowDate.getMonth().toString() === birthday.substr(4, 5);
            }

            const actionData = {
                user: {
                    name: names[0],
                    birthdayToday: birthdayToday
                },
                internal: {
                    username: loginData.username,
                    password: loginData.password,
                    user: user
                }
            };

            this.handleEvent({
                name: 'Action',
                token: client.token,
                action: 'loginSuccess',
                data: actionData
            });
        });

        /**
         * Listen for login error event.
         */
        this.bus.once(errEvent, (resp) => {
            debug('Login error', resp);

            const result = resp.result;

            this.handleEvent({
                name: 'Action',
                token: client.token,
                action: 'loginError',
                data: {
                    error: result.displayMessage
                }
            });
        });

        /**
         * Emit login event.
         */
        this.bus.emit('fbs.patron', {
            busEvent: busEvent,
            errorEvent: errEvent,
            username: loginData.username,
            password: loginData.password
        });
    }

    /**
     * Update information for item for the client.
     *
     * @param client
     *   The client.
     */
    itemUpdate(client) {
        if (!client.state.items) {
            client.state.items = [];
        }

        const itemIndex = client.state.items.findIndex((item) => item.itemIdentifier === client.actionData.itemIdentifier);

        if (itemIndex === -1) {
            // Item was not found.
            client.state.items.push(client.actionData);
        } else {
            client.state.items[itemIndex] = client.actionData;
        }
    }
}

module.exports = ActionHandler;

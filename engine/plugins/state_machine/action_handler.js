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
        client.state.flow = flow;

        if (flow === 'checkInItems') {
            // Check in flow does not require that the user is logged in.
            this.stateMachine.transition(client, 'checkInItems');
        } else {
            this.stateMachine.transition(client, 'chooseLogin');
        }
    }

    /**
     * Change flow for a client.
     *
     * @param client
     *   The client.
     * @param flow
     *   The name of the flow to change to.
     */
    changeFlow(client, flow) {
        client.state.flow = flow;

        if (flow === 'checkInItems') {
            // Check in flow does not require that the user is logged in.
            this.stateMachine.transition(client, 'checkInItems');
        } else if (Object.prototype.hasOwnProperty.call(client.internal, 'user')) {
            // If already logged in transition directly.
            this.stateMachine.transition(client, flow);
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

    /**
     * Get status for the user of the client.
     *
     * @param client
     *   The client.
     */
    status(client) {
        client.state.step = 'status';

        const priorState = client.__machina__.bibbox.priorState;

        // Information is already present after the login in client.internal.
        client.state = Object.assign({}, client.state, {
            // Status refreshing. Determines if a a refresh of the status is under way.
            statusRefreshing: ['checkOutItems', 'checkInItems'].includes(priorState),
            // Items that are ready to be picked up.
            holdItems: client.internal.user.holdItems,
            // Items that are overdue being checked in.
            overdueItems: client.internal.user.overdueItems,
            // Items the user has checked out.
            chargedItems: client.internal.user.chargedItems,
            // Items with a fine.
            fineItems: client.internal.user.fineItems,
            // Items that have been recalled.
            recallItems: client.internal.user.recallItems,
            // Items the user has reserved, but which are not ready.
            unavailableHoldItems: client.internal.user.unavailableHoldItems
        });

        const busEvent = uniqid('fbs.patron.');
        const errEvent = uniqid('fbs.patron.err.');

        /**
         * Listen for patron success event.
         */
        this.bus.once(busEvent, resp => {
            debug('Patron retrieved successfully');
            debug(resp);

            const actionData = {
                // Items that are ready to be picked up.
                holdItems: resp.patron.holdItems,
                // Items that are overdue being checked in.
                overdueItems: resp.patron.overdueItems,
                // Items the user has checked out.
                chargedItems: resp.patron.chargedItems,
                // Items with a fine.
                fineItems: resp.patron.fineItems,
                // Items that have been recalled.
                recallItems: resp.patron.recallItems,
                // Items the user has reserved, but which are not ready.
                unavailableHoldItems: resp.patron.unavailableHoldItems
            };

            this.handleEvent({
                name: 'Action',
                token: client.token,
                action: 'statusUpdated',
                data: actionData
            });
        });

        /**
         * Listen for patron error event.
         */
        this.bus.once(errEvent, (resp) => {
            debug('Login error', resp);

            this.handleEvent({
                name: 'Reset'
            });
        });

        /**
         * Emit patron event.
         */
        this.bus.emit('fbs.patron', {
            busEvent: busEvent,
            errorEvent: errEvent,
            username: client.internal.username,
            password: client.internal.password
        });
    }
}

module.exports = ActionHandler;

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

        // Return flow does not require that the user is logged in.
        if (flow === 'returnMaterials') {
            this.stateMachine.transition(client, 'returnMaterials');
        } else {
            this.stateMachine.transition(client, 'chooseLogin');
        }
    }

    /**
     * Borrow material for the client.
     *
     * @param client
     *   The client.
     */
    borrowMaterial(client) {
        const newMaterial = client.actionData;

        // Ignore material if it is already borrowed or inProgress.
        // @TODO: Handle retry case.
        if (client.state.materials) {
            const oldMaterials = client.state.materials.filter(material => {
                return material.itemIdentifier === newMaterial.itemIdentifier && !['borrowed', 'inProgress'].includes(material.status);
            });

            if (oldMaterials.length > 0) {
                return;
            }
        }

        newMaterial.status = 'inProgress';
        this.stateMachine.action(client, 'materialUpdate', newMaterial);

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

            const material = {
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
                    material.status = 'renewed';
                } else {
                    material.status = 'borrowed';
                }

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'materialUpdate',
                    data: material
                });
            } else {
                material.status = 'error';

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'materialUpdate',
                    data: material
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
            itemIdentifier: newMaterial.itemIdentifier,
            username: client.internal.username,
            password: client.internal.password
        });
    }

    /**
     * Return material for the client.
     *
     * @param client
     *   The client.
     */
    returnMaterial(client) {
        const newMaterial = client.actionData;

        // Ignore material if it is already returned or inProgress.
        // @TODO: Handle retry case.
        if (client.state.materials) {
            const oldMaterials = client.state.materials.filter(material => {
                return material.itemIdentifier === newMaterial.itemIdentifier && !['returned', 'inProgress'].includes(material.status);
            });

            if (oldMaterials.length > 0) {
                return;
            }
        }

        newMaterial.status = 'inProgress';
        this.stateMachine.action(client, 'materialUpdate', newMaterial);

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

            const material = {
                itemIdentifier: result.itemIdentifier,
                title: result.itemProperties.title,
                author: result.itemProperties.author,
                message: result.screenMessage
            };

            // FBS value of 1 equals success.
            if (result.ok === '1') {
                material.status = 'returned';

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'materialUpdate',
                    data: material
                });
            } else {
                material.status = 'error';

                this.handleEvent({
                    name: 'Action',
                    token: client.token,
                    action: 'materialUpdate',
                    data: material
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
            itemIdentifier: newMaterial.itemIdentifier
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
     * Update information for material for the client.
     *
     * @param client
     *   The client.
     */
    materialUpdate(client) {
        if (!client.state.materials) {
            client.state.materials = [];
        }

        const materialIndex = client.state.materials.findIndex((material) => material.itemIdentifier === client.actionData.itemIdentifier);

        if (materialIndex === -1) {
            // Item was not found.
            client.state.materials.push(client.actionData);
        } else {
            client.state.materials[materialIndex] = client.actionData;
        }
    }
}

module.exports = ActionHandler;

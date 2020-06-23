const debug = require('debug')('bibbox:STATE_MACHINE:actions');
const uniqid = require('uniqid');

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

        this.bus.once(busEvent, resp => {
            debug('Checkout success');

            const result = resp.result;

            debug(resp);
            debug(result);

            const material = {
                itemIdentifier: result.itemIdentifier,
                title: result.itemProperties.title,
                author: result.itemProperties.author,
                renewalOk: result.renewalOk ? 'Ja' : 'Nej',
                message: result.screenMessage
            };

            if (result.ok === '1') {
                if (result.renewalOk) {
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

        this.bus.once(errEvent, (resp) => {
            debug('Checkout error', resp);
        });

        this.bus.emit('fbs.checkout', {
            busEvent: busEvent,
            errorEvent: errEvent,
            itemIdentifier: newMaterial.itemIdentifier,
            username: client.internal.username,
            password: client.internal.password
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

        this.bus.once(busEvent, resp => {
            debug('Login success');

            const now = new Date();

            const user = resp.patron;
            const names = user.personalName.split(' ');
            const birthday = user.PB;
            const birthdayToday =
                now.getDate().toString() === birthday.substr(6, 7) &&
                now.getMonth().toString() === birthday.substr(4, 5);

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
            client.state.materials.push(client.actionData);
        } else {
            client.state.materials[materialIndex] = client.actionData;
        }
    }
}

module.exports = ActionHandler;

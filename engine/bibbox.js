const machina = require('machina');

// See http://machina-js.org/ for information about machina fsm.

const bibbox = new machina.BehavioralFsm({
    namespace: 'bibbox',
    initialState: 'uninitialized',
    states: {
        uninitialized: {
            _onEnter: function (client) {
                console.log('entered uninitialized');
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
                console.log('entered initial');
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
                console.log('triggered enterFlow', client, client.actionData);
                client.state.flow = client.actionData.flow;
                this.transition(client, 'chooseLogin');
            }
        },
        chooseLogin: {
            _onEnter: function (client) {
                console.log('entered chooseLogin');
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
                console.log('entered loginScan');
                client.state.step = 'loginScan';
            },
            _onExit: function (client) {
                client.actionData = null;
            },
            _reset: function (client) {
                this.transition(client, 'initial');
            },
            loginError: function (client) {
                console.log('triggered loginError', client, client.actionData);
                client.state.loginError = client.actionData;
            },
            loginSuccess: function (client) {
                console.log('triggered loginSuccess', client, client.actionData);
                client.state.user = client.actionData.user;
                this.transition(client, client.state.flow);
            }
        },
        borrow: {
            _onEnter: function (client) {
                console.log('entered borrow');
                client.state.step = 'borrow';
            },
            _onExit: function (client) {
                client.actionData = null;
            },
            _reset: function (client) {
                this.transition(client, 'initial');
            },
            materialUpdate: function (client) {
                console.log('triggered materialUpdate', client.actionData);

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
        console.log('Reset (bibbox): ' + action, client);
        this.handle(client, '_reset');
        return client;
    },
    action: function (client, action, data) {
        console.log('Action (bibbox): ' + action, client);
        client.actionData = data;
        this.handle(client, action);
        return client;
    }
});

// Exports.
exports.bibbox = bibbox;

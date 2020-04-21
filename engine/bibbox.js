const machina = require('machina');

// See http://machina-js.org/ for information about machina fsm.

const bibbox = new machina.BehavioralFsm({
    initialize: function (options) {},
    namespace: 'bibbox',
    initialState: 'uninitialized',
    states: {
        uninitialized: {
            '*': function (client) {
                this.deferUntilTransition(client);
                this.transition(client, 'initial');
            }
        },
        initial: {
            _onEnter: function (client) {
                client.state = {
                    step: 'initial'
                };
            },
            _onExit: function (client) {
            },
            _reset: function (client) {
                this.transition(client, 'initial');
            },
            chooseLogin: function (client, data) {
                console.log('initial -> chooseLogin', client, data);
                this.transition(client, 'chooseLogin');
            }
        },
        chooseLogin: {
            _onEnter: function (client) {
                console.log('entered chooseLogin');
                client.state.step = 'chooseLogin';

                // @TODO: Handle other login options.

                this.transition(client, 'loginScan');
            },
            _onExit: function (client) {
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
                client.state.step = 'loginScan'
            },
            _onExit: function (client) {
            },
            _reset: function (client) {
                this.transition(client, 'initial');
            },
            '*': function (client) {
                console.log('login: *', client);
            }
        }
    },

    reset: function (client) {
        this.handle(client, '_reset');
    },
    action: function (client, action, data) {
        console.log(client, action, data);
        this.handle(client, action);
    }
});

// Exports.
exports.bibbox = bibbox;

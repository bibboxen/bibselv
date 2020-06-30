/**
 * @file
 * Unit test for network plugin.
 */

'use strict';

const path = require('path');
const config = require(path.join(__dirname, 'config_test.json'));

let app = null;
const setup = () => {
    if (!app) {
        // Load config file.
        const config = require(path.join(__dirname, 'config_architect.json'));

        // Configure the plugins.
        const plugins = [
            {
                packagePath: './../plugins/bus'
            },
            {
                packagePath: './../plugins/client'
            },
            {
                packagePath: './../plugins/network'
            },
            {
                packagePath: './../plugins/ctrl',
                configPath: path.join(__dirname, 'config_ctrl.json')
            },
            {
                packagePath: './../plugins/fbs'
            },
            {
                packagePath: './../plugins/state_machine'
            }
        ];

        app = setupArchitect(plugins, config);
    }

    return app;
};

it('Smoke test', done => {
    setup().then(app => {
        done();
    });
});

it('Test that reset can be called', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.reset(client);
        client.state.step.should.equal('initial');
    }).then(done);
});

it('Test that the borrow flow can be entered from initial state', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.reset(client);
        client = app.services.state_machine.action(client, 'enterFlow', {
            flow: 'borrow'
        });
        client.state.step.should.equal('loginScan');
        client.state.flow.should.equal('borrow');
    }).then(done);
});

it('Test that test user can log in', done => {
    let client = {
        token: '123'
    };

    setup().then(app => {
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Reset'
        });
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'enterFlow',
            data: {
                flow: 'borrow'
            }
        });
        client = app.services.state_machine.handleEvent({
            token: '123',
            name: 'Action',
            action: 'login',
            data: {
                username: config.username,
                password: config.pin
            }
        });

        // @TODO: Handle this better than timeout.
        setTimeout(() => {
            client = app.services.client.load('123');

            client.state.step.should.equal('borrow');
            client.state.flow.should.equal('borrow');

            client.state.user.name.should.equal('Testkort');
            client.internal.username.should.equal('3210000000');
            client.internal.user.personalName.should.equal('Testkort Mickey Mouse');

            done();
        }, 400);
    });
});


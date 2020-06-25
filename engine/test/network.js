/**
 * @file
 * Unit test for network plugin.
 */

'use strict';

const assert = require('assert');
const path = require('path');

let app = null;
const setup = function setup () {
    if (!app) {
        // Load config file.
        const config = require(path.join(__dirname, 'config_architect.json'));

        // Configure the plugins.
        const plugins = [
            {
                packagePath: './../plugins/bus'
            },
            {
                packagePath: './../plugins/network'
            }
        ];

        app = setupArchitect(plugins, config);
    }

    return app;
};

it('Google online test', function (done) {
    setup().then(function (app) {
        app.services.network.isOnline('https://google.dk')
            .then(
                function () {
                    assert(true);
                },
                function () {
                    assert(false);
                }
            ).then(done, done);
    }, done);
});

it('Test non-existing site', function (done) {
    setup().then(function (app) {
        app.services.network.isOnline('https://fbsfisker.dk')
            .then(
                function () {
                    assert(false);
                },
                function () {
                    assert(true);
                })
            .then(done, done);
    }, done);
});

it('Teardown', function (done) {
    setup().then(function (app) {
        app.destroy();
    }).then(done);
});

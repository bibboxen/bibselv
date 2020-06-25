/**
 * @file
 * Mocha tests.
 *
 * Mocks see http://sinonjs.org/
 */

/* global before, after */

'use strict';

const record = require('./record');
const supertest = require('supertest');
const path = require('path');
require('should');

global.server = supertest.agent('http://localhost:3010');

/**
 * Helper to setup to minimal app with plugins.
 *
 * @param plugins
 *   Plugins to load.
 * @param config
 *   Configuration to use
 *
 * @return {*|promise}
 *    Promise that's resolved when the app is loaded.
 */
global.setupArchitect = function setupArchitect(plugins, config) {
    const Q = require('q');
    const deferred = Q.defer();

    const architect = require('architect');

    // User the configuration to start the application.
    config = architect.resolveConfig(plugins, __dirname);
    architect.createApp(config, function(err, app) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(app);
        }
    });

    return deferred.promise;
};

/**
 * Check if a given event message has expired.
 *
 * @param {int} timestamp
 *   Unit timestamp to compare.
 * @param {function} debug
 *   Debug function used to display debug messages.
 * @param {string} eventName
 *   The name of the event (used for debugging).
 *
 * @returns {boolean}
 *   If expire true else false.
 */
global.isEventExpired = function isEventExpired(timestamp, debug, eventName) {
    const current = new Date().getTime();
    eventName = eventName || 'Unknown';

    const config = require(path.join(__dirname, 'config_architect.json'));

    if (Number(timestamp) + config.eventTimeout < current) {
        debug('EVENT ' + eventName + ' is expired (' + ((Number(timestamp) + config.eventTimeout) - current) + ').');
        return true;
    }

    debug('EVENT ' + eventName + ' message not expired (' + ((Number(timestamp) + config.eventTimeout) - current) + ').');
    return false;
};

/**
 * Wrapper to load test files.
 *
 * @param name
 *   The name of the test group.
 * @param file
 *   The file to require.
 * @param recordName
 */
function importTest(name, file, recordName) {
    describe(name, function() {
        const recorder = record(recordName);

        if (recordName !== undefined) {
            before(recorder.before);
        }

        require(file);

        if (recordName !== undefined) {
            after(recorder.after);
        }
    });
}

// Load test cases.
importTest('Bus', './bus.js');
importTest('Network', './network.js');
importTest('FBS', './fbs.js', 'fbs');

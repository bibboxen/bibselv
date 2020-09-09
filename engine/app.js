#!/usr/bin/env node

/**
 * @file
 * This is the main application that uses architect to build the application
 * base on plugins.
 */
'use strict';

const path = require('path');
const architect = require('architect');
const debug = require('debug')('bibbox:ENGINE');

// Load config file.
const config = require(path.join(__dirname, 'config.json'));

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
const isEventExpired = (timestamp, debug, eventName) => {
    const current = new Date().getTime();
    eventName = eventName || 'Unknown';

    if (Number(timestamp) + config.eventTimeout < current) {
        debug('EVENT ' + eventName + ' is expired (' + ((Number(timestamp) + config.eventTimeout) - current) + ').');
        return true;
    }

    debug('EVENT ' + eventName + ' message not expired (' + ((Number(timestamp) + config.eventTimeout) - current) + ').');
    return false;
};

// Configure the plugins.
const plugins = [
    {
        packagePath: './plugins/bus',
        isEventExpired: isEventExpired
    },
    {
        packagePath: './plugins/network',
        isEventExpired: isEventExpired
    },
    {
        packagePath: './plugins/config',
        config: config.boxConfig,
        isEventExpired: isEventExpired
    },
    {
        packagePath: './plugins/fbs',
        isEventExpired: isEventExpired
    },
    {
        packagePath: './plugins/client',
        isEventExpired: isEventExpired
    },
    {
        packagePath: './plugins/state_machine',
        isEventExpired: isEventExpired
    },
    {
        packagePath: './plugins/server',
        port: 3000,
        path: path.join(__dirname, 'public'),
        tokenEndPoint: config.tokenEndPoint,
        isEventExpired: isEventExpired
    }
];

// User the configuration to start the application.
const appConfig = architect.resolveConfig(plugins, __dirname);

architect.createApp(appConfig, (err, app) => {
    if (err) {
        console.error(err.stack);
    } else {
        debug('Architect plugins successfully bootstrapped.');
    }
});

process.on('uncaughtException', error => {
    console.error(error.stack);
});

// Ensure proper process exit when killed in term.
process.once('SIGINT', () => { process.exit(); });
process.once('SIGTERM', () => { process.exit(); });

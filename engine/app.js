#!/usr/bin/env node

/**
 * @file
 * This is the main application that uses architect to build the application
 * base on plugins.
 */
'use strict';

const path = require('path');
const architect = require('architect');
const debug = require('debug')('bibbox:APP');

// @TODO: Should this be configurable?
const eventTimeout = 1000;

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
const isEventExpired = function isEventExpired(timestamp, debug, eventName) {
  const current = new Date().getTime();
  eventName = eventName || 'Unknown';

  if (Number(timestamp) + eventTimeout < current) {
    debug('EVENT ' + eventName + ' is expired (' + ((Number(timestamp) + eventTimeout) - current) + ').');
    return true;
  }

  debug('EVENT ' + eventName + ' message not expired (' + ((Number(timestamp) + eventTimeout) - current) + ').');
  return false;
};

// Configure the plugins.
const plugins = [
  {
    packagePath: './plugins/bus',
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
    port: 8010,
    path: path.join(__dirname, 'public'),
    isEventExpired: isEventExpired
  }
];

// User the configuration to start the application.
var appConfig = architect.resolveConfig(plugins, __dirname);
architect.createApp(appConfig, function (err, app) {
  if (err) {
    console.error(err.stack);
  }
  else {
    debug('Architect plugins successfully bootstrapped.');
  }
});

process.on('uncaughtException', function (error) {
  console.error(error.stack);
});

// Ensure proper process exit when killed in term.
process.once('SIGINT', function () { process.exit(); });
process.once('SIGTERM', function () { process.exit(); });

// If process is forked from bootstrap send keep-alive events back.
if (process.send) {
  setInterval(function () {
    process.send({
      ping: new Date().getTime()
    });
  }, 10000);

  // Inform bootstrap that it's ready.
  process.send({
    ready: true
  });
}

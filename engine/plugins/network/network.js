/**
 * @file
 * Checks if the application has online connection.
 */

'use strict';

const url = require('url');
const Q = require('q');
const fork = require('child_process').fork;
const debug = require('debug')('bibbox:network');
const path = require('path');

/**
 * The network object.
 *
 * @param {object} bus
 *   The event bus.
 *
 * @constructor
 */
const Network = function Network(bus) {
    this.bus = bus;
};

/**
 * Check if a given URI address is online.
 *
 * @param {string} uri
 *   The URI to check.
 *
 * @returns {Function|promise|*|d}
 *   Resolves if the URI is online else rejected.
 */
Network.prototype.isOnline = function isOnline(uri) {
    const deferred = Q.defer();

    try {
        const address = new url.URL(uri);
        const port = address.protocol === 'https:' ? 443 : 80;
        const tester = fork(path.join(__dirname, 'network_tester.js'), [address.host, port, 1000]);

        tester.once('message', function(data) {
            if (data.error) {
                debug('Tester error: ' + data.message);
                deferred.reject(data.message);
            } else {
                debug('Tester connected successful (pid: ' + tester.pid + ')');
                deferred.resolve();
            }
        });

        // Debug helper code.
        tester.once('close', function(code) {
            debug('Tester (pid: ' + tester.pid + ') closed with code: ' + code);
        });

        debug('Tester started with pid: ', tester.pid);
    } catch (err) {
        deferred.reject(err);
    }

    return deferred.promise;
};

/**
 * Register the plugin with architect.
 *
 * @param {array} options
 *   Options defined in app.js.
 * @param {array} imports
 *   The other plugins available.
 * @param {function} register
 *   Callback function used to register this plugin.
 */
module.exports = function(options, imports, register) {
    var bus = imports.bus;
    var network = new Network(bus);

    /**
   * Check if a given network address is online.
   */
    bus.on('network.online', function online(data) {
        network.isOnline(data.url).then(
            function() {
                bus.emit(data.busEvent, true);
            },
            function(err) {
                bus.emit('logger.err', { type: 'network', message: err });
                // Retry to catch network flapping before giving up.
                setTimeout(function() {
                    network.isOnline(data.url).then(
                        function() {
                            bus.emit(data.busEvent, true);
                        },
                        function(err) {
                            bus.emit('logger.err', { type: 'network', message: err });
                            bus.emit(data.busEvent, false);
                        }
                    );
                }, 250);
            }
        );
    });

    register(null, {
        network: network
    });

    debug('Registered plugin');
};

/**
 * @file
 * Contains service to load/save a client.
 */

'use strict';

const debug = require('debug')('bibbox:CLIENT:main');
const redis = require('redis');
const Q = require('q');

/**
 * The Client object.
 *
 * @param redisConfig
 *   Redis configuration.
 * @param persistent
 *   If true redis will be used. Otherwise in-memory store will be used (mostly useful for testing)..
 *
 * @constructor
 */
const Client = function Client(redisConfig, persistent = false) {
    this.persistent = persistent;
    this.clients = [];

    if (this.persistent) {
        // Extend configuration object with a connection plan.
        redisConfig.retry_strategy = function(options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                return new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                return undefined;
            }
            // Reconnect after.
            return Math.min(options.attempt * 100, 3000);
        };

        this.storage = redis.createClient(redisConfig);
    }
};

/**
 * Load client.
 *
 * @param token
 *   The token for the client.
 * @param config
 *   Configuration for FBS.
 * @param state
 *   The current state.
 *
 * @return {*}
 *   The client for the token.
 */
Client.prototype.load = function load(token, config = {}, state = {}) {
    const deferred = Q.defer();
    let client = false;

    if (this.persistent) {
        this.storage.get(token, function get(err, data) {
            if (err) {
                debug('Loaded error, client created: ' + token);
                deferred.resolve({
                    token: token,
                    config: config,
                    state: state
                });
            } else {
                client = JSON.parse(data);
                debug('Loaded client: ' + token);
                deferred.resolve(client);
            }
        });
    } else {
        if (Object.prototype.hasOwnProperty.call(this.clients, token)) {
            debug('Loaded client: ' + token);
            deferred.resolve(this.clients[token]);
        } else {
            debug('Client created: ' + token);
            deferred.resolve({
                token: token,
                config: config,
                state: state
            });
        }
    }

    return deferred.promise;
};

/**
 * Save client.
 *
 * @param token
 *   The token for the client.
 * @param client
 *   The client.
 */
Client.prototype.save = function save(token, client) {
    debug('Saving client: ' + token);
    if (this.persistent) {
        this.storage.set(token, JSON.stringify(client));
    } else {
        this.clients[token] = client;
    }
};

/**
 * Remove client.
 *
 * @param token
 *   Token to identify client
 */
Client.prototype.remove = function remove(token) {
    debug('Remove client: ' + token);
    if (this.persistent) {
        this.storage.del(token);
    } else {
        delete this.clients[token];
    }
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
    const persistent = Object.prototype.hasOwnProperty.call(options, 'persistent') ? options.persistent : false;
    const client = new Client(options.config, persistent);

    register(null, {
        client: client
    });

    debug('Registered plugin');
};

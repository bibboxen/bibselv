/**
 * @file
 * Contains service to load/save a client.
 */

'use strict';

const debug = require('debug')('bibbox:CLIENT:main');
const clients = {};

/**
 * The Client object.
 *
 * @constructor
 */
const Client = function Client() {};

/**
 * Load client.
 *
 * @param token
 *   The token for the client.
 * @return {*}
 *   The client for the token.
 */
Client.prototype.load = (token) => {
    if (!Object.prototype.hasOwnProperty.call(clients, token)) {
        clients[token] = {
            token: token,
            state: {}
        };
    }

    debug('Loading client: ' + token, clients[token]);
    return clients[token];
};

/**
 * Save client.
 *
 * @param token
 *   The token for the client.
 * @param client
 *   The client.
 *
 * @return {*}
 *   The client.
 */
Client.prototype.save = (token, client) => {
    debug('Saving client: ' + token, client);
    clients[token] = client;

    return clients[token];
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
    const client = new Client();

    register(null, {
        client: client
    });

    debug('Registered plugin');
};

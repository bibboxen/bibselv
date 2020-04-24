/**
 * @file
 * Contains service to load/save a client.
 */

'use strict';

const debug = require('debug')('bibbox:CLIENT:main');

let clients = {};

/**
 * The Client object.
 *
 * @constructor
 */
const Client = function Client () {
    // @TODO: Load clients from redis.
};

Client.prototype.load = (token) => {
    if (!clients.hasOwnProperty(token)) {
        this.save(token, {
            token: token,
            state: {}
        });
    }

    debug('Loading client: ' + token, clients[token]);
    return clients[token];
};

Client.prototype.save = (token, client) => {
    debug('Saving client: ' + token, client);
    clients[token] = client;
    // @TODO: Save client to redis.
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
module.exports = function (options, imports, register) {
    const client = new Client();

    register(null, {
        client: client
    });

    debug('Registered plugin');
};

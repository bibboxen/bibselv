/**
 * @file
 * Provides box configuration.
 */
'use strict';

const fetch = require('node-fetch');

/**
 * Config object.
 *
 * @param bus
 *   The system bus to send/receive messages.
 *
 * @constructor
 */
const Config = function Config(bus) {
    this.bus = bus;
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
    const bus = imports.bus;
    const config = new Config(bus);
    const boxConfig = options.config;

    /**
     * Listen for configuration requests.
     */
    bus.on('getBoxConfiguration', function(data) {
        fetch(boxConfig.uri + data.id).then(res => res.json()).then(json => {
            bus.emit(data.busEvent, json);
        });
    });

    register(null, {
        config: config
    });
};

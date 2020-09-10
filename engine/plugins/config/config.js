/**
 * @file
 * Provides config.
 */
'use strict';

const fetch = require('node-fetch');

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
     * Handle fbs config events.
     *
     * @TODO: IF THIS IS NOT EMITTED THE WHOLE THING DIE
     *
     */
    bus.on('ctrl.config.fbs', function(data) {
        bus.emit(data.busEvent, config);
    });

    bus.on('getBoxConfiguration', function(data) {
        fetch(boxConfig.uri + data.id).then(res => res.json()).then(json => {
            bus.emit(data.busEvent, json);
        });
    });

    register(null, {
        config: config
    });
};

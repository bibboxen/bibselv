/**
 * @file
 * Provides config.
 */
'use strict';

const path = require('path');

const CTRL = function CTRL(bus) {
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
    const ctrl = new CTRL(bus);
    const config = require(path.join(__dirname, 'config.json'));

    /**
   * Handle fbs config events.
   */
    bus.on('ctrl.config.fbs', function(data) {
        bus.emit(data.busEvent, config);
    });

    register(null, {
        ctrl: ctrl
    });
};

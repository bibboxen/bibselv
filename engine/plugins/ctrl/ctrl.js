/**
 * @file
 * Provides config.
 */
'use strict';

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
    const configPath = options.configPath;
    const ctrl = new CTRL(bus);
    const config = require(configPath);

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

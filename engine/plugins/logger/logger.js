/**
 * @file
 * This is a wrapper class to handel the system logger.
 */

'use strict';

const Logstash = require('logstash-client');

// Static logstash client across loggers.
let logstashClient = null;

/**
 * Logger constructor.
 *
 * @param host
 *   Logstash host
 * @param port
 *   Logstash port
 *
 * @constructor
 */
const Logger = function Logger(host, port) {
    if (logstashClient === null) {
        logstashClient = new Logstash({
            type: 'tcp',
            host: host,
            port: port
        });
    }
};

/**
 * Send message to log-stash.
 *
 * @param {string} level
 *   Log level for the message.
 * @param {string} message
 *   The message to send to the logger.
 */
Logger.prototype.send = function send(level, message) {
    if (logstashClient !== null) {
        // This is for to support legacy log messages.
        let type = 'unknown';
        if (Object.prototype.hasOwnProperty.call(message, 'type')) {
            type = message.type.toLowerCase();
        }

        let msg = message;
        if (Object.prototype.hasOwnProperty.call(message, 'message')) {
            msg = message.message;
        }

        // Create best possible logging message for searching in FBS messages.
        if (type === 'fbs' && level === 'info') {
            const parts = {
                id: msg.slice(0, 2),
                raw: msg,
                xml: Object.prototype.hasOwnProperty.call(message, 'xml') ? message.xml : 'No XML data'
            };

            // Find the first field in the messages and split the message into SIP2 parts.
            const firsts = ['AO', 'AP', 'CF', 'CN', 'BW', 'BV'];
            for (const i in firsts) {
                const index = msg.indexOf(firsts[i]);
                if (index !== -1) {
                    msg.slice(index).split('|').forEach(function(val) {
                        if (val) {
                            parts[val.slice(0, 2)] = val.slice(2);
                        }
                    });
                    break;
                }
            }
            msg = parts;
        }

        logstashClient.send({
            '@timestamp': new Date(),
            message: msg,
            level: level,
            type: type,
            name: Object.prototype.hasOwnProperty.call(message, 'machine_name') ? message.machine_name : 'Unknown',
            location: Object.prototype.hasOwnProperty.call(message, 'location') ? message.location : 'location'
        });
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
    // Add event listeners to logging events on the bus. For some reason they need
    // to have a inner function to work!
    const bus = imports.bus;
    const logger = new Logger(options.host, options.port);

    bus.on('logger.err', function error(message) {
        logger.send('error', message);
    });

    bus.on('logger.warn', function waring(message) {
        logger.send('warn', message);
    });

    bus.on('logger.info', function info(message) {
        logger.send('info', message);
    });

    bus.on('logger.debug', function debug(message) {
        logger.send('debug', message);
    });

    register(null, {});
};

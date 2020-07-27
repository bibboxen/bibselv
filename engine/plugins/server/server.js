#!/usr/bin/env node
'use strict';

/**
 * @file
 * Provide socket connection to clients.
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const debug = require('debug')('bibbox:SERVER:main');
const uniqid = require('uniqid');

/**
 * Register the plugin.
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
    const port = options.port || 3000;
    const host = options.host || '0.0.0.0';

    const router = express.Router();
    const app = express();

    // @TODO: ??? response "Ok"?
    router.get('/', (req, res) => {
        res.send({ response: 'Ok' }).status(200);
    });
    router.post('/', (req, res) => {
        res.send({ response: 'Ok' }).status(200);
    });
    app.use(router);

    const server = http.createServer(app);
    const io = socketIo(server);

    io.on('connection', socket => {
        debug('Client connected with socket id: ' + socket.id);

        // @TODO: Why prefix the uniq id?
        const busEvent = uniqid('state_machine.up.');
        let clientEvent = null;

        bus.once(busEvent, (client) => {
            debug(busEvent, client);

            clientEvent = 'state_machine.state_update.' + client.token;
            console.log('CLIENT_EVENT', clientEvent);

            // Register event listener.
            bus.on(clientEvent, (newState) => {
                debug(clientEvent, newState);

                // Emit new state to client.
                socket.emit('UpdateState', newState);
            });

            // Emit new state to client.
            socket.emit('UpdateState', client.state);
        });

        socket.on('ClientReady', (data) => {
            // @TODO: Make sure only one socket is open pr. client.
            // @TODO: Validate token.

            // Emit event to state machine.
            bus.emit('state_machine.start', {
                token: data.token,
                busEvent: busEvent
            });
        });

        // @TODO: Missing documentation?
        socket.on('ClientEvent', (data) => {
            debug('ClientEvent', data);

            bus.emit('state_machine.event', data);
        });

        // @TODO: Missing documentation?
        socket.on('disconnect', () => {
            debug('Client disconnected');
            bus.offAny(clientEvent);
        });
    });

    // Start the server.
    server.listen(port, host, function() {
        bus.emit('logger.info', { type: 'Server', message: 'Listening on port ' + port });
    });

    // Register exposed function with architect.
    register(null, {
        onDestroy: function(callback) {
            bus.emit('logger.info', { type: 'Server', message: 'Stopped' });
            server.close(callback);
        },
        app: app,
        server: server
    });

    debug('Registered plugin');
};

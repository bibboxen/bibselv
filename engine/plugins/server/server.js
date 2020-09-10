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
const fetch = require('node-fetch');

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
    const cors = options.cors || '*:*'

    const router = express.Router();
    const app = express();

    app.set('port', options.port || 3000);
    router.get('/', (req, res) => {
        res.status(400).send('Engine here and ready for work. Please use web-socket for communication.');
    });
    app.use(router);

    // Create http server and attach the web-socket to the server.
    const server = http.createServer(app);
    const io = socketIo(server, {
        handlePreflightRequest: (req, res) => {
            const headers = {
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Origin': cors,
                'Access-Control-Allow-Credentials': true
            };
            res.writeHead(200, headers);
            res.end();
        }
    });

    // Handle client connections in the web-socket. After connection the client should send a valid token with every
    // call to the engine.
    io.on('connection', socket => {
        debug('Client connected with socket id: ' + socket.id);

        const clientConnectionId = uniqid();
        let validToken = false;
        let token = '';

        bus.once(clientConnectionId, (client) => {
            const clientEvent = 'state_machine.state_update.' + client.token;

            // Register event listener.
            bus.on(clientEvent, (newState) => {
                debug(clientEvent, newState);

                // Emit new state to client.
                socket.emit('UpdateState', newState);
            });

            // Emit new state to client.
            socket.emit('UpdateState', client.state);
        });

        /**
         * The first message the client should send is "ClientReady" which will validate the token and send
         * configuration to the client base on that token.
         */
        socket.on('ClientReady', (data) => {
            token = data.token;
            fetch(options.tokenEndPoint + token).then(res => res.json()).then(data => {
                // Validate the token and send error if not valid.
                if (data.hasOwnProperty('valid') && !data.valid) {
                    socket.emit('error', { message: 'Not authorized', code: 401 });
                    socket.disconnect(true);
                    return;
                }

                // Set that current token is valid.
                validToken = true;

                // Get configuration for this client box based on config id from token validation.
                const clientEvent = 'getConfiguration' + token;
                bus.on(clientEvent, (config) => {
                    socket.emit('Configuration', config);
                });
                bus.emit('getBoxConfiguration', {
                    id: data.id,
                    busEvent: clientEvent
                });

                // Emit event to state machine.
                bus.emit('state_machine.start', {
                    token: token,
                    busEvent: clientConnectionId
                });
            });
        });

        /**
         * Handling of events from the client.
         *
         * Not that every request requires the attribute "token" in the json request.
         */
        socket.on('ClientEvent', (data) => {
            if (data.hasOwnProperty('token')) {
                if (validToken && data.token === token) {
                    // Token found and matched by initial conneciton token.
                    bus.emit('state_machine.event', data);
                }
                else {
                    socket.emit('error', { message: 'Missing token in client request', code: 405 });
                }
            }
            else {
                socket.emit('error', { message: 'Missing token in client request', code: 405 });
            }
        });

        /**
         * Remove all events when client disconnects.
         */
        socket.on('disconnect', () => {
            debug('Client disconnected');
            bus.offAny(clientConnectionId);
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

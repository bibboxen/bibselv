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
const uniqId = require('uniqid');
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
    const cors = options.cors || '*:*';

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

        const clientConnectionId = uniqId();
        let isTokenValid = false;
        let token = '';

        // Default fbsConfig template.
        const fbsConfig = {
            username: '',
            password: '',
            endpoint: '',
            agency: '',
            location: '',
            onlineState: {
                threshold: 5,
                onlineTimeout: 30000,
                offlineTimeout: 30000
            },
            defaultPassword: null
        };

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
         * configuration to the client based on that token.
         */
        socket.on('ClientReady', (data) => {
            token = data.token;
            fetch(options.tokenEndPoint + token).then(res => res.json()).then(data => {
                // Validate the token and send error if not valid.
                if (Object.prototype.hasOwnProperty.call(data, 'valid') && !data.valid) {
                    socket.emit('error', { message: 'Not authorized', code: 401 });
                    socket.disconnect(true);
                    return;
                }

                // Set that current token is valid.
                isTokenValid = true;

                // Get configuration for this client box based on config id from token validation.
                const clientEvent = uniqId();
                bus.on(clientEvent, (config) => {
                    // Set FBS related configuration.
                    fbsConfig.username = config.sip2User.username;
                    fbsConfig.password = config.sip2User.password;
                    fbsConfig.agency = config.sip2User.agencyId;
                    fbsConfig.location = config.sip2User.location;
                    fbsConfig.endpoint = options.fbsEndPoint + fbsConfig.agency;
                    fbsConfig.defaultPassword = config.defaultPassword;

                    // Remove it from configuration, so FBS info is not sent to the frontend.
                    delete config.sip2User;
                    delete config.defaultPassword;

                    // Send the front end related config to the front end.
                    socket.emit('Configuration', config);

                    // Emit event to state machine.
                    bus.emit('state_machine.start', {
                        token: token,
                        config: fbsConfig,
                        busEvent: clientConnectionId
                    });
                });

                bus.emit('getBoxConfiguration', {
                    id: data.id,
                    token: token,
                    busEvent: clientEvent
                });
            });
        });

        /**
         * Handling of events from the client.
         *
         * @TODO: Fix issue on re-connect where server side token and token state is lost.
         *
         * Not that every request requires the attribute "token" in the json request.
         */
        socket.on('ClientEvent', (data) => {
            if (Object.prototype.hasOwnProperty.call(data, 'token')) {
                if (isTokenValid && data.token === token) {
                    // Token found and matched by initial connection token.
                    bus.emit('state_machine.event', data);
                } else {
                    socket.emit('error', { message: 'Missing token in client request', code: 405 });
                }
            } else {
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

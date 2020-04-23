#!/usr/bin/env node
'use strict';

/**
 * @file
 * Provide socket connection to clients.
 */

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
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
module.exports = function (options, imports, register) {
    const bus = imports.bus;
    const port = options.port || 3000;

    const router = express.Router();
    const app = express();

    router.get("/", (req, res) => {
        res.send({ response: "Ok" }).status(200);
    });
    app.use(router);

    const server = http.createServer(app);
    const io = socketIo(server);

    io.on("connection", socket => {
        debug("Client connected with socket id: " + socket.id);

        socket.on('ClientEvent', (data) => {
            debug('ClientEvent', data);

            // @TODO: Load client state from bus event.

            const busEvent = uniqid('state_machine.event.');

            // Register event listener.
            bus.once(busEvent, function (data) {
                debug(busEvent, data);

                // Emit new state to client.
                socket.emit('UpdateState', data);
            });

            // Emit event to state machine.
            bus.emit('state_machine.event', {
                event: data,
                busEvent: busEvent
            });
        });

        /*
        socket.on('StartMachine', (data) => {
            console.log('StartMachine', data.token);
            // @TODO: Make sure the client is allowed access.
            // @TODO: Load config for client.
            // @TODO: Send config to client.

            bibbox.reset(client);
            saveClient(data.token, client);
            socket.emit("UpdateState", client.state);
        });

        socket.on('Reset', (data) => {
            client = bibbox.reset(client);
            saveClient(data.token, client);
            socket.emit("UpdateState", client.state);
        });

        socket.on('Action', (data) => {
            console.log('Action', data);

            // @TODO: Replace with login call to FBS.
            if (data.action === 'login') {
                console.log('Fake login');
                client = bibbox.action(client, 'loginSuccess', {
                    user: {
                        'name': 'Logged in user'
                    }
                });

                socket.emit("UpdateState", client.state);
                return;
            }

            // @TODO: Replace with call to FBS.
            if (data.action === 'borrowMaterial') {
                console.log('Fake borrow');

                client = bibbox.action(client, 'materialUpdate', {
                    id: data.data.id,
                    status: 'inProgress'
                });
                socket.emit("UpdateState", client.state);

                setTimeout(() => {
                    client = bibbox.action(client, 'materialUpdate', {
                        id: data.data.id,
                        status: 'borrowed'
                    });
                    socket.emit("UpdateState", client.state);
                }, 1500);

                return;
            }

            bibbox.action(client, data.action, data.data);
            socket.emit("UpdateState", client.state);
        });

         */

        socket.on("disconnect", () => debug("Client disconnected"));
    });

    // Start the server.
    server.listen(port, function () {
        bus.emit('logger.info', { 'type': 'Server', 'message': 'Listening on port ' + port });
    });

    bus.on('server.request_config.error', function (err) {
        console.error('Server', err);
    });

    // Request the config.
    bus.emit('ctrl.config.config', {
        busEvent: 'server.request_config',
        errorEvent: 'server.request_config.error'
    });

    // Register exposed function with architect.
    register(null, {
        'onDestroy': function (callback) {
            bus.emit('logger.info', { 'type': 'Server', 'message': 'Stopped' });
            server.close(callback);
        },
        app: app,
        server: server
    });

    debug('Registered plugin');
};

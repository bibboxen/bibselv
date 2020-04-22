const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bibbox = require('./bibbox.js').bibbox;

const port = process.env.PORT || 3000;
const router = express.Router();
const app = express();

router.get("/", (req, res) => {
    res.send({ response: "Ok" }).status(200);
});
app.use(router);

const server = http.createServer(app);
const io = socketIo(server);

/**
 * Load the client from token and socketId.
 *
 * @param token
 *   The unique token for the given client
 * @param socketId
 *   The current socket id
 * @return object
 */
const loadClient = (token, socketId) => {
    // @TODO: Get client from redis.
    return {
        'id': 'test',
        'token': token,
        'socketId': socketId
    };
};

io.on("connection", socket => {
    let client = loadClient(123, socket.id);

    console.log("Client connected with socket id: " + socket.id);

    socket.on('StartMachine', (token) => {
        console.log('StartMachine', token);
        // @TODO: Make sure the client is allowed access.
        // @TODO: Load config for client.
        // @TODO: Send config to client.

        bibbox.reset(client);

        socket.emit("UpdateState", client.state);
    });

    socket.on('Reset', () => {
        client = bibbox.reset(client);
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

    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

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
    console.log("Client connected with socket id: " + socket.id);

    socket.on('StartMachine', (token) => {
        console.log('StartMachine', token);
        // @TODO: Make sure the client is allowed access.
        // @TODO: Load config for client.
        // @TODO: Send config to client.

        let client = loadClient(token, socket.id);
        bibbox.reset(client);

        socket.emit("UpdateState", client.state);
    });

    socket.on('Action', (data) => {
        console.log('Action', data);
        bibbox.action(data.action, data.data);
    });

    socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));

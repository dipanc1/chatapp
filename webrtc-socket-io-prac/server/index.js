const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { roomHandler } = require("./room");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected with Socket Id: ${socket.id}`);

    roomHandler(socket);
});

server.listen(8080, () => {
    console.log("SERVER IS RUNNING at port 8080");
});
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./Router/users")
const testRouter = require("./Router/testRouter")
const conversationRoute = require("./Router/conversation")
const messageRoute = require("./Router/messages")
const { mongo_url } = require("./config/mongo_auth");
const { protect } = require("./middleware/authMiddleware");
// const path = require("path");
const app = express();

app.use(
    cors({
        origin: "*",
    })
);

mongoose.connect(
    mongo_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("Connected to MongoDB");
    }, 600000
);

app.use(bodyParser.json());
app.use("/", testRouter)
app.use("/users", userRoute);
app.use("/conversation", protect, conversationRoute);
app.use("/message", protect, messageRoute);

const PORT = process.env.PORT || "8000";
const server = app.listen(PORT, () => {
    console.log(`Port running on http://localhost:${PORT} `);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected", userData);
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log(`User Joined Room: ${room}`);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('calling', (room) => socket.in(room).emit('calling'));
    socket.on('stop calling', (room) => socket.in(room).emit('stop calling'));

    socket.on('online', (room) => socket.in(room).emit('online'));
    socket.on('not online', (room) => socket.in(room).emit('not online'));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if (!chat.users) {
            console.log("No users in chat");
        }

        chat.users.forEach((user) => {
            if (user._id == newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived);
        });
    });

    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

// ---------------DEPLOYMENT--------------------

// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'))
// });
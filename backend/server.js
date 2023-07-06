const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRoute = require("./router/users");
const otpRoute = require("./router/otp");
const conversationRoute = require("./router/conversation");
const messageRoute = require("./router/messages");
const meetingRoute = require("./router/meetings");
const checkoutRoute = require("./router/checkouts");
const uploadRoute = require("./router/uploadFiles");

require("dotenv").config();

const { protect } = require("./middleware/authMiddleware");

const User = require("./models/User");

const app = express();

app.use(
    cors({
        origin: [
            process.env.CLIENT_URL, 'https://chatapp.wildcrypto.com'
        ]
    })
);

const MONGO_URL = process.env.MONGO_STAGING_URI;

mongoose.connect(
    MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},
    () => {
        console.log("Connected to MongoDB");
    }, 600000
);

app.use(bodyParser.json());
app.use("/", otpRoute)
app.use("/users", userRoute);
app.use("/conversation", conversationRoute);
app.use("/message", protect, messageRoute);
app.use("/meetings", meetingRoute);
app.use("/checkout", checkoutRoute);
app.use("/upload", uploadRoute);

const PORT = process.env.PORT || "8000";
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT} `);
});

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    // console.log("New user connected", socket.id);

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected", userData);
    });

    //user online update in database and save socket id
    socket.on("user-online", (userData) => {
        if (userData) {
            // console.log(userData)
            User.findByIdAndUpdate(userData._id, {
                $set: {
                    socketId: socket.id,
                    isOnline: true,
                },
            })
                .then((user) => {
                    // socket.broadcast.emit("user-online", user);
                    console.log("User online");
                })
                .catch(err => console.log("Online ", err))
        } else {
            console.log("Socket 83: User not found")
        }
    });

    // if socket disconnect, update database and set isOnline to false
    socket.on("disconnect", () => {
        // console.log(socket.id, "disconnected");
        User.findOne({ socketId: socket.id })
            .then((user) => {
                if (user) {
                    User.findByIdAndUpdate(user._id, {
                        $set: {
                            isOnline: false,
                            socketId: null,
                        },
                    })
                        .then(() => {
                            console.log("User offline");
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    console.log("Socket 106: User not found");
                }
            })
            .catch(err => console.log(err))
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        // console.log(`User Joined Room: ${room}`);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

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

    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

// ---------------DEPLOYMENT--------------------

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});
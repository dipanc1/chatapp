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

const PORT = "8000";
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
    // socket.on("disconnect", () => {
    //     console.log("User disconnected");
    // });
});
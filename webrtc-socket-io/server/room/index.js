const { v4: uuidV4 } = require("uuid");

const rooms = {};

const roomHandler = (socket) => {
    const createRoom = (roomid) => {
        const roomId = roomid ? roomid : uuidV4();
        rooms[roomId] = {};
        console.log(`Room Created: ${roomId}`);
        socket.emit("room-created", roomId);
    };

    const joinRoom = ({ roomId, peerId, userId }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {};
        }
        console.log(`User Joined RoomId ${roomId} & PeerId ${peerId} & UserId ${userId}`);
        rooms[roomId][peerId] = { peerId, userId };
        socket.join(roomId);
        socket.to(roomId).emit("user-joined", { peerId, userId });
        socket.emit('get-users', {
            roomId,
            participants: rooms[roomId],
        })
        console.log("Peer IDs in Room", rooms[roomId]);

        socket.on("disconnect", () => {
            // console.log(`User Disconnected with Peer ID: ${peerId}`);
            leaveRoom(roomId, peerId);
        });
    };

    const leaveRoom = (roomId, peerId) => {
        console.log(`User Left Room ${roomId} with PeerId ${peerId}`);
        socket.to(roomId).emit('user-disconnected', peerId);
    }

    const startSharing = ({ peerId, roomId }) => {
        console.log(peerId, "user-started-sharing in room id", roomId)
        socket.to(roomId).emit("user-started-sharing", peerId);
    }

    const stopSharing = (roomId) => {
        console.log(roomId, "user-stopped-sharing")
        socket.to(roomId).emit("user-stopped-sharing");
    }

    socket.on("create-room", createRoom);
    socket.on("join-room", joinRoom);
    socket.on("start-sharing", startSharing);
    socket.on("stop-sharing", stopSharing);
}

module.exports = { roomHandler };
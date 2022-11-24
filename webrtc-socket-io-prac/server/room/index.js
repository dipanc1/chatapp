const { v4: uuidV4 } = require("uuid");

const rooms = {};

const roomHandler = (socket) => {
    const createRoom = () => {
        const roomId = uuidV4();
        rooms[roomId] = [];
        console.log(`Room Created: ${roomId}`);
        socket.emit("room-created", roomId);
    };

    const joinRoom = ({ roomId, peerId }) => {
        if (rooms[roomId]) {
            console.log(`User Joined RoomId ${roomId} & PeerId ${peerId}`);
            rooms[roomId].push(peerId);
            socket.join(roomId);
            socket.to(roomId).emit("user-joined", peerId);
            socket.emit('get-users', {
                roomId,
                participants: rooms[roomId],
            })
            console.log("Peer IDs in Room", rooms[roomId]);
        }

        socket.on("disconnect", () => {
            // console.log(`User Disconnected with Peer ID: ${peerId}`);
            leaveRoom(roomId, peerId);
        });
    };

    const leaveRoom = (roomId, peerId) => {
        console.log(`User Left Room ${roomId} & PeerId ${peerId}`);
        rooms[roomId] = rooms[roomId].filter(id => id !== peerId);
        socket.to(roomId).emit('user-disconnected', peerId);
    }

    socket.on("create-room", createRoom);

    socket.on("join-room", joinRoom);
}

module.exports = { roomHandler };

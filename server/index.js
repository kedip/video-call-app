const express = require("express");
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',
  },
});

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("client/build"));

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    setTimeout(() => {
      socket.to(roomId).broadcast.emit("user-connected", userId, userName);
    }, 1000);
    
    socket.on("disconnect", () => {
      io.to(roomId).emit("user-disconnected", userId);
    });
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

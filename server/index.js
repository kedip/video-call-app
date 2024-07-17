const { Server } = require("socket.io");
const mongoose = require("mongoose");
const CallLog = require("./CallLogs.js");
const express = require("express");

const URI =
  "mongodb+srv://nishantvekariya41:FcOXWvzGSXt0VL5M@cluster0.rgf49lz.mongodb.net/";

mongoose
  .connect(URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  const app = express();

const io = new Server(8000, {
  cors: true,
});

let activeCalls = new Map();

const socketidToRoomMap = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected`, socket.id);

  socket.on("room:join", (room) => {
    const existingRoom = socketidToRoomMap.get(socket.id);
    if (existingRoom && existingRoom !== room) {
      socket.leave(existingRoom);
    }

    socketidToRoomMap.set(socket.id, room);
    socket.join(room);
    io.to(room).emit("user:joined", { id: socket.id });
    io.to(socket.id).emit("room:join", { room });
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
    activeCalls.set(socket.id, {
      startTime: new Date(),
      participants: [socket.id, to],
    });
  });

  socket.on("call:end", () => {
    const callInfo = activeCalls.get(socket.id);
    if (callInfo) {
      const callLog = new CallLog({
        callStart: callInfo.startTime,
        callEnd: new Date(),
        participants: callInfo.participants,
      });
      callLog.save();
      activeCalls.delete(socket.id);
    }
    socket.broadcast.emit("call:ended", { from: socket.id });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});


app.listen(3000, () => {
  console.log('Server is running...');
})
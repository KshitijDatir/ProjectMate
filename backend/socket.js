const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

function init(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // we will tighten later
      methods: ["GET", "POST"],
    },
  });

  // 🔐 Socket authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // attach userId to socket
      socket.userId = decoded.id;

      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  // 🔗 On connection
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Each user joins their private room
    socket.join(`user:${socket.userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

module.exports = { init, getIO };
const { Server } = require("socket.io");

function setupChat(server) {
  const allowedOrigins = (process.env.SOCKET_CORS_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const io = new Server(server, {
    cors: { origin: allowedOrigins.length ? allowedOrigins : "*" },
  });

  const onlineUsers = new Set();
  const messageHistory = [];

  io.on("connection", (socket) => {
    onlineUsers.add(socket.id);

    socket.emit("chat:history", messageHistory);

    io.emit("users:update", Array.from(onlineUsers));
    io.emit("system:notice", `${socket.id} joined the chat`);

    socket.on("message", (text, acknowledge) => {
      if (
        typeof text !== "string" ||
        !text.trim() ||
        text.trim().length > 2000
      ) {
        const error = "Message must be between 1 and 2000 characters.";
        if (typeof acknowledge === "function") {
          return acknowledge({ success: false, error });
        }
        return socket.emit("message:error", { error });
      }

      const payload = {
        id: Date.now() + Math.random().toString(36).slice(2, 6),
        senderId: socket.id,
        text: text.trim(),
        sentAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      messageHistory.push(payload);
      if (messageHistory.length > 50) messageHistory.shift();

      io.emit("message", payload);
      if (typeof acknowledge === "function") acknowledge({ success: true });
    });

    socket.on("typing:start", () => {
      socket.broadcast.emit("typing:update", socket.id);
    });

    socket.on("typing:stop", () => {
      socket.broadcast.emit("typing:update", null);
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("users:update", Array.from(onlineUsers));
      io.emit("system:notice", `${socket.id} left the chat`);
    });
  });
}

module.exports = setupChat;
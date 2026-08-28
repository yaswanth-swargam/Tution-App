import "dotenv/config";

import http from "http";
import app from "./app.js";
import pool from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";

const PORT = process.env.PORT || 3000;
const httpServer = http.createServer(app);

const io = initializeSocket(httpServer);

// userId -> Set of socketIds
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // =========================
  // USER ONLINE
  // =========================

 socket.on("user_online", (userId) => {
  const numericUserId = Number(userId);

  if (!numericUserId) return;

  socket.userId = numericUserId;

  // Join personal room for direct messages
  socket.join(`user_${numericUserId}`);

  if (!onlineUsers.has(numericUserId)) {
    onlineUsers.set(
      numericUserId,
      new Set()
    );
  }

  onlineUsers
    .get(numericUserId)
    .add(socket.id);

  io.emit(
    "online_users",
    Array.from(onlineUsers.keys())
  );
});

  // =========================
  // JOIN SECTION CHAT
  // =========================

  socket.on("join_section", (sectionId) => {
    const roomName = `section_${sectionId}`;

    socket.join(roomName);

    console.log(
      `Socket ${socket.id} joined ${roomName}`
    );
  });

  // =========================
  // DISCONNECT
  // =========================

  socket.on("disconnect", () => {
    console.log(
      "User disconnected:",
      socket.id
    );

    const userId = socket.userId;

    if (
      userId &&
      onlineUsers.has(userId)
    ) {
      // Remove this socket only
      onlineUsers
        .get(userId)
        .delete(socket.id);

      // User is offline only when
      // no tabs/devices remain
      if (
        onlineUsers
          .get(userId)
          .size === 0
      ) {
        onlineUsers.delete(userId);

        console.log(
          `User ${userId} is offline`
        );
      }

      // Broadcast updated online users
      io.emit(
        "online_users",
        Array.from(onlineUsers.keys())
      );
    }
  });
});

const server = async () => {
  try {
    const connection =
      await pool.getConnection();

    console.log(
      "Database connected"
    );

    connection.release();

    httpServer.listen(PORT, () => {
      console.log(
        "Server running at:",
        PORT
      );
    });
  } catch (error) {
    console.error(
      "Failed to connect database:",
      error.message
    );
  }
};

server();
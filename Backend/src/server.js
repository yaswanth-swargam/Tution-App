import app from "./app.js";
import pool from "./lib/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

// Create HTTP server
const httpServer = createServer(app);

// Attach Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_section", (sectionId) => {
    socket.join(`section:${sectionId}`);

    console.log(
      `Socket ${socket.id} joined section:${sectionId}`
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const server = async () => {
  try {
    const connection = await pool.getConnection();

    console.log("Database connected");

    connection.release();

    // Start HTTP + Socket.IO server
    httpServer.listen(PORT, () => {
      console.log("Server running at:", PORT);
    });
  } catch (error) {
    console.error("Failed to connect database:", error.message);
  }
};

server();
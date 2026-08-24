import http from "http";
import app from "./app.js";
import pool from "./lib/db.js";
import { initializeSocket } from "./lib/socket.js";

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = initializeSocket(httpServer);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_section", (sectionId) => {
    socket.join(`section_${sectionId}`);

    console.log(
      `Socket ${socket.id} joined section_${sectionId}`
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

    httpServer.listen(PORT, () => {
      console.log("Server running at:", PORT);
    });

  } catch (error) {
    console.error(
      "Failed to connect database:",
      error.message
    );
  }
};

server();
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import sectionRoutes from "./routes/sectionRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import directMessageRoutes from "./routes/directMessageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/direct-messages", directMessageRoutes);
app.use("/api/uploads", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend connected",
  });
});

export default app;
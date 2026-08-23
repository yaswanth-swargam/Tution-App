import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js'
const app = express();
import sectionRoutes from './routes/sectionRoutes.js'
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

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "Server is running 🚀",
//   });
// });

app.use('/api/auth',authRoutes)
app.use('/api/sections',sectionRoutes)
app.get('/',(req,res)=>{
    res.json({
        message: "Backend connected"
    })
})
export default app;


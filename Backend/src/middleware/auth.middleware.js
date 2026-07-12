import jwt from "jsonwebtoken";
import pool from "../lib/db.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [users] = await pool.query(
      `SELECT id, full_name, email, role, profile_pic, created_at, updated_at
       FROM users
       WHERE id = ?`,
      [decoded.userId] // or decoded.id depending on your JWT payload
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = users[0];

    next();
  } catch (error) {
    console.error("Auth Middleware:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default protectRoute;
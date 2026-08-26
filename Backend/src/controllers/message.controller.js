import pool from "../lib/db.js";
import {getIO} from '../lib/socket.js'


export const sendMessage = async (req, res) => {
  const { sectionId } = req.params;
  const { content } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  try {
    // Validate message content
    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    // Check whether section exists
    const [section] = await pool.query(
      "SELECT id FROM sections WHERE id = ?",
      [sectionId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // Student can only send messages to sections they belong to
    if (role === "student") {
      const [membership] = await pool.query(
        `SELECT section_id
         FROM section_members
         WHERE section_id = ? AND user_id = ?`,
        [sectionId, userId]
      );

      if (membership.length === 0) {
        return res.status(403).json({
          message: "You do not have access to send messages in this section",
        });
      }
    }

    // Save message
    const [result] = await pool.query(
      `INSERT INTO messages (section_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [sectionId, userId, content.trim()]
    );

    // Get the complete newly created message
    const [messages] = await pool.query(
      `SELECT
        m.id,
        m.section_id,
        m.sender_id,
        m.content,
        m.created_at,
        m.updated_at,
        u.full_name,
        u.profile_pic
      FROM messages m
      JOIN users u
        ON m.sender_id = u.id
      WHERE m.id = ?`,
      [result.insertId]
    );

    const newMessage = messages[0];

    // Get Socket.IO instance
    const io = getIO();

    // IMPORTANT:
    // Must match the room name used in server.js
    const roomName = `section_${sectionId}`;

    console.log(
      `🔥 Emitting new_message to ${roomName}:`,
      newMessage
    );

    // Send real-time message to everyone in this section
    io.to(roomName).emit(
      "new_message",
      newMessage
    );

    // Send API response
    return res.status(201).json(newMessage);

  } catch (error) {
    console.error(
      "Error sending message:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};



export const sectionMessages = async (req, res) => {
  const { sectionId } = req.params;
  const userId = req.user.id;
  const role = req.user.role;

  try {
    // Check if section exists
    const [section] = await pool.query(
      "SELECT * FROM sections WHERE id = ?",
      [sectionId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // Student can view messages only from their sections
    if (role === "student") {
      const [membership] = await pool.query(
        `SELECT * FROM section_members
         WHERE section_id = ? AND user_id = ?`,
        [sectionId, userId]
      );

      if (membership.length === 0) {
        return res.status(403).json({
          message: "You do not have access to this section",
        });
      }
    }

    // Fetch messages with sender details
    const [messages] = await pool.query(
      `SELECT
        m.id,
        m.section_id,
        m.sender_id,
        m.content,
        m.created_at,
        m.updated_at,
        u.full_name,
        u.profile_pic
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.section_id = ?
      ORDER BY m.created_at ASC`,
      [sectionId]
    );

    return res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching messages:", error.message);

    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};
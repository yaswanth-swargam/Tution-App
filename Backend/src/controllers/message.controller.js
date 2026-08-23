import pool from "../lib/db.js";

export const sendMessage = async (req, res) => {
  const { sectionId } = req.params;
  const { content } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  try {
    // Check message content
    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

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

    // Student can send messages only in sections they belong to
    if (role === "student") {
      const [membership] = await pool.query(
        `SELECT * FROM section_members
         WHERE section_id = ? AND user_id = ?`,
        [sectionId, userId]
      );

      if (membership.length === 0) {
        return res.status(403).json({
          message: "You do not have access to send messages in this section",
        });
      }
    }

    // Insert message
    const [result] = await pool.query(
      `INSERT INTO messages (section_id, sender_id, content)
       VALUES (?, ?, ?)`,
      [sectionId, userId, content.trim()]
    );

    // Get the newly created message with sender details
    const [message] = await pool.query(
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
      WHERE m.id = ?`,
      [result.insertId]
    );

    return res.status(201).json(message[0]);

  } catch (error) {
    console.error("Error sending message:", error.message);

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
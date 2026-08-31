import pool from "../lib/db.js";
import { getIO } from "../lib/socket.js";

// ==========================================
// SEND SECTION MESSAGE
// ==========================================

export const sendMessage = async (req, res) => {
  const { sectionId } = req.params;

  const {
    content,
    file_url,
    file_public_id,
    file_name,
    file_type,
    file_size,
  } = req.body;

  const userId = req.user.id;
  const role = req.user.role;

  try {
    // =========================
    // VALIDATE MESSAGE
    // =========================
     console.log(
    "📥 BACKEND BODY:",
    req.body
  );

    if (!content?.trim() && !file_url) {
      return res.status(400).json({
        message: "Message content or file is required",
      });
    }

    // =========================
    // CHECK SECTION EXISTS
    // =========================

    const [section] = await pool.query(
      "SELECT id FROM sections WHERE id = ?",
      [sectionId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // =========================
    // CHECK STUDENT MEMBERSHIP
    // =========================

    if (role === "student") {
      const [membership] = await pool.query(
        `
          SELECT section_id
          FROM section_members
          WHERE section_id = ?
          AND user_id = ?
        `,
        [sectionId, userId]
      );

      if (membership.length === 0) {
        return res.status(403).json({
          message:
            "You do not have access to send messages in this section",
        });
      }
    }

    // =========================
    // SAVE MESSAGE
    // =========================

    const [result] = await pool.query(
      `
        INSERT INTO messages (
          section_id,
          sender_id,
          content,
          file_url,
          file_public_id,
          file_name,
          file_type,
          file_size
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        sectionId,
        userId,
        content?.trim() || "",
        file_url || null,
        file_public_id || null,
        file_name || null,
        file_type || null,
        file_size || null,
      ]
    );

    // =========================
    // GET COMPLETE MESSAGE
    // =========================

    const [messages] = await pool.query(
      `
        SELECT
          m.id,
          m.section_id,
          m.sender_id,
          m.content,

          m.file_url,
          m.file_public_id,
          m.file_name,
          m.file_type,
          m.file_size,

          m.created_at,
          m.updated_at,

          u.full_name,
          u.profile_pic

        FROM messages m

        JOIN users u
          ON m.sender_id = u.id

        WHERE m.id = ?
      `,
      [result.insertId]
    );

    const newMessage = messages[0];

    // =========================
    // SOCKET.IO REAL-TIME EVENT
    // =========================
    

    // =========================
// SOCKET.IO REAL-TIME EVENT
// =========================

const io = getIO();

const roomName = `section_${sectionId}`;

// ==========================================
// 1. EXISTING REALTIME CHAT
// ==========================================

console.log(
  `🔥 Emitting new_message to ${roomName}:`,
  newMessage
);

io.to(roomName).emit(
  "new_message",
  newMessage
);

// ==========================================
// 2. GET USERS WHO CAN ACCESS THIS SECTION
// ==========================================

// Students belonging to this section
const [sectionStudents] = await pool.query(
  `
    SELECT user_id
    FROM section_members
    WHERE section_id = ?
  `,
  [sectionId]
);

// All administrators can access all sections
const [admins] = await pool.query(
  `
    SELECT id AS user_id
    FROM users
    WHERE role = 'admin'
  `
);

// Combine students + admins
const recipients = [
  ...sectionStudents,
  ...admins,
];

// ==========================================
// 3. SEND UNREAD EVENT
// ==========================================

for (const recipient of recipients) {
  const recipientId =
    Number(recipient.user_id);

  // Don't notify the sender
  if (recipientId === Number(userId)) {
    continue;
  }

  console.log(
    `🔴 Sending section unread event to user_${recipientId}`
  );

  io.to(`user_${recipientId}`).emit(
    "section_message_unread",
    {
      section_id: Number(sectionId),
      message_id: Number(newMessage.id),
    }
  );
}

    // =========================
    // API RESPONSE
    // =========================

    return res.status(201).json(
      newMessage
    );

  } catch (error) {

    console.error(
      "Error sending message:",
      error
    );

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};


// ==========================================
// GET SECTION MESSAGES
// ==========================================

export const sectionMessages = async (
  req,
  res
) => {
  const { sectionId } = req.params;

  const userId = req.user.id;
  const role = req.user.role;

  try {
    // =========================
    // CHECK SECTION
    // =========================

    const [section] = await pool.query(
      `
      SELECT *
      FROM sections
      WHERE id = ?
      `,
      [sectionId]
    );

    if (section.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // =========================
    // STUDENT ACCESS CHECK
    // =========================

    if (role === "student") {
      const [membership] =
        await pool.query(
          `
          SELECT *
          FROM section_members
          WHERE section_id = ?
          AND user_id = ?
          `,
          [sectionId, userId]
        );

      if (membership.length === 0) {
        return res.status(403).json({
          message:
            "You do not have access to this section",
        });
      }
    }

    // =========================
    // FETCH MESSAGES
    // =========================

    const [messages] =
      await pool.query(
        `
        SELECT
          m.id,
          m.section_id,
          m.sender_id,
          m.content,

          m.file_url,
          m.file_public_id,
          m.file_name,
          m.file_type,
          m.file_size,

          m.created_at,
          m.updated_at,

          u.full_name,
          u.profile_pic

        FROM messages m

        JOIN users u
          ON m.sender_id = u.id

        WHERE m.section_id = ?

        ORDER BY m.created_at ASC
        `,
        [sectionId]
      );

    return res.status(200).json(
      messages
    );

  } catch (error) {
    console.error(
      "Error fetching messages:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to fetch messages",
    });
  }
};
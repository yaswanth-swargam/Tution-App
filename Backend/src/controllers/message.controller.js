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
  save_to_materials,
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


    // ==========================================
// AUTO SAVE ADMIN ATTACHMENT AS MATERIAL
// ==========================================

if (
  role === "admin" &&
  file_url &&
  save_to_materials === true
) {
  try {
    await pool.query(
      `
        INSERT INTO study_materials (
          section_id,
          title,
          description,
          material_type,
          file_url,
          file_public_id,
          file_name,
          file_type,
          file_size,
          created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Number(sectionId),

        // Material title
        file_name || "Study Material",

        // Message text becomes description
        content?.trim() || null,

        // Uploaded file
        "file",

        file_url,
        file_public_id || null,
        file_name || null,
        file_type || null,
        file_size || null,

        Number(userId),
      ]
    );

    console.log(
      `📚 Study material created from message: ${file_name}`
    );

        // ==========================================
    // NOTIFY STUDENTS AND ADMIN
    // ==========================================

    const [students] = await pool.query(
      `
      SELECT DISTINCT
        u.id
      FROM users u
      INNER JOIN section_members sm
        ON u.id = sm.user_id
      WHERE sm.section_id = ?
        AND u.role = 'student'
      `,
      [sectionId]
    );

    // Get all admins
    const [admins] = await pool.query(
      `
      SELECT id
      FROM users
      WHERE role = 'admin'
      `
    );

    const recipients = [
      ...students,
      ...admins,
    ];

    if (recipients.length > 0) {
      // Get the newly created material
      const [createdMaterial] = await pool.query(
        `
        SELECT id, title
        FROM study_materials
        WHERE section_id = ?
          AND file_public_id = ?
        ORDER BY id DESC
        LIMIT 1
        `,
        [
          sectionId,
          file_public_id || null,
        ]
      );

      if (createdMaterial.length > 0) {
        const material = createdMaterial[0];

        const notificationValues = recipients.map(
          (recipient) => [
            recipient.id,
            "MATERIAL",
            "New Study Material",
            `${material.title} has been added to your section.`,
            material.id,
            "STUDY_MATERIAL",
          ]
        );

        const notificationPlaceholders = notificationValues
          .map(() => "(?, ?, ?, ?, ?, ?)")
          .join(",");

        await pool.query(
          `
          INSERT INTO notifications
          (
            user_id,
            type,
            title,
            message,
            reference_id,
            reference_type
          )
          VALUES ${notificationPlaceholders}
          `,
          notificationValues.flat()
        );

        console.log(
          `🔔 Material notification sent to ${recipients.length} users`
        );
      }
    }

  } catch (materialError) {
    // Don't break the chat message
    // if material creation fails.
    console.error(
      "⚠️ Failed to create study material:",
      materialError
    );
  }
}

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
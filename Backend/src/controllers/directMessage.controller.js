import pool from "../lib/db.js";
import { getIO } from "../lib/socket.js";

// ==========================================
// SEND DIRECT MESSAGE
// ==========================================

export const sendDirectMessage = async (
  req,
  res
) => {
  const { receiverId } = req.params;

  const { content } = req.body;

  const senderId = req.user.id;
  const senderRole = req.user.role;

  try {
    // =========================
    // VALIDATE MESSAGE
    // =========================

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    // =========================
    // PREVENT SELF MESSAGE
    // =========================

    if (
      Number(receiverId) ===
      Number(senderId)
    ) {
      return res.status(400).json({
        message:
          "You cannot send a message to yourself",
      });
    }

    // =========================
    // CHECK RECEIVER
    // =========================

    const [receiver] = await pool.query(
      `
      SELECT
        id,
        full_name,
        role
      FROM users
      WHERE id = ?
      `,
      [receiverId]
    );

    if (receiver.length === 0) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const receiverRole = receiver[0].role;

    // =========================
    // ACCESS RULES
    // =========================

    // Student cannot message another student
    if (
      senderRole === "student" &&
      receiverRole === "student"
    ) {
      return res.status(403).json({
        message:
          "Students can only send direct messages to administrators",
      });
    }

    // Admin can message:
    // - Students
    // - Other admins
    // So no restriction needed for admin

    // =========================
    // SAVE MESSAGE
    // =========================

    const [result] = await pool.query(
      `
      INSERT INTO direct_messages
      (
        sender_id,
        receiver_id,
        content
      )
      VALUES (?, ?, ?)
      `,
      [
        senderId,
        receiverId,
        content.trim(),
      ]
    );

    // =========================
    // FETCH CREATED MESSAGE
    // =========================

    const [messageRows] = await pool.query(
      `
      SELECT
        dm.id,
        dm.sender_id,
        dm.receiver_id,
        dm.content,
        dm.created_at,
        dm.updated_at,

        u.full_name,
        u.profile_pic,
        u.role

      FROM direct_messages dm

      JOIN users u
        ON dm.sender_id = u.id

      WHERE dm.id = ?
      `,
      [result.insertId]
    );

    const newMessage = messageRows[0];

    // =========================
    // REALTIME DELIVERY
    // =========================

    const io = getIO();

    // Send to sender
    io.to(`user_${senderId}`).emit(
      "new_direct_message",
      newMessage
    );

    // Send to receiver
    io.to(`user_${receiverId}`).emit(
      "new_direct_message",
      newMessage
    );

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      message:
        "Direct message sent successfully",

      data: newMessage,
    });

  } catch (error) {
    console.error(
      "Error sending direct message:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to send direct message",
    });
  }
};


// ==========================================
// GET DIRECT MESSAGES
// ==========================================

export const getDirectMessages = async (
  req,
  res
) => {
  const { userId } = req.params;

  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    // =========================
    // CHECK USER
    // =========================

    const [users] = await pool.query(
      `
      SELECT
        id,
        full_name,
        email,
        profile_pic,
        role
      FROM users
      WHERE id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otherUser = users[0];

    // =========================
    // SECURITY RULES
    // =========================

    // Students cannot access
    // conversations with other students
    if (
      currentUserRole === "student" &&
      otherUser.role === "student"
    ) {
      return res.status(403).json({
        message:
          "Students can only access conversations with administrators",
      });
    }

    // Admin can access conversations
    // with both students and admins

    // =========================
    // FETCH CONVERSATION
    // =========================

    const [messages] = await pool.query(
      `
      SELECT
        dm.id,
        dm.sender_id,
        dm.receiver_id,
        dm.content,
        dm.created_at,
        dm.updated_at,

        u.full_name,
        u.profile_pic,
        u.role

      FROM direct_messages dm

      JOIN users u
        ON dm.sender_id = u.id

      WHERE
        (
          dm.sender_id = ?
          AND dm.receiver_id = ?
        )
        OR
        (
          dm.sender_id = ?
          AND dm.receiver_id = ?
        )

      ORDER BY dm.created_at ASC
      `,
      [
        currentUserId,
        userId,
        userId,
        currentUserId,
      ]
    );

    return res.status(200).json({
      user: otherUser,
      messages,
    });

  } catch (error) {
    console.error(
      "Error fetching direct messages:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to fetch direct messages",
    });
  }
};


// ==========================================
// GET DIRECT CONVERSATIONS
// ==========================================

// export const getDirectConversations = async (
//   req,
//   res
// ) => {
//   const currentUserId = req.user.id;
//   const currentUserRole = req.user.role;

//   try {
//     let conversations = [];

//     // ======================================
//     // STUDENT
//     // Show ALL ADMINS
//     // Even if conversation hasn't started
//     // ======================================

//     if (
//       currentUserRole === "student"
//     ) {
//       const [rows] = await pool.query(
//         `
//         SELECT
//           u.id,
//           u.full_name,
//           u.email,
//           u.profile_pic,
//           u.role,

//           (
//             SELECT MAX(dm.created_at)
//             FROM direct_messages dm
//             WHERE
//               (
//                 dm.sender_id = ?
//                 AND dm.receiver_id = u.id
//               )
//               OR
//               (
//                 dm.sender_id = u.id
//                 AND dm.receiver_id = ?
//               )
//           ) AS last_message_at

//         FROM users u

//         WHERE
//           u.role = "admin"

//           AND u.id != ?

//         ORDER BY
//           last_message_at DESC,
//           u.full_name ASC
//         `,
//         [
//           currentUserId,
//           currentUserId,
//           currentUserId,
//         ]
//       );

//       conversations = rows;
//     }


//     // ======================================
//     // ADMIN
//     // Show everyone except themselves
//     // Students + Other Admins
//     // Only if conversation exists
//     // ======================================

//     else if (
//       currentUserRole === "admin"
//     ) {
//       const [rows] = await pool.query(
//         `
//         SELECT
//           u.id,
//           u.full_name,
//           u.email,
//           u.profile_pic,
//           u.role,

//           MAX(dm.created_at)
//             AS last_message_at

//         FROM direct_messages dm

//         JOIN users u
//           ON u.id = CASE
//             WHEN dm.sender_id = ?
//             THEN dm.receiver_id
//             ELSE dm.sender_id
//           END

//         WHERE
//           dm.sender_id = ?
//           OR dm.receiver_id = ?

//         GROUP BY
//           u.id,
//           u.full_name,
//           u.email,
//           u.profile_pic,
//           u.role

//         ORDER BY
//           last_message_at DESC
//         `,
//         [
//           currentUserId,
//           currentUserId,
//           currentUserId,
//         ]
//       );

//       conversations = rows;
//     }

//     return res
//       .status(200)
//       .json(conversations);

//   } catch (error) {
//     console.error(
//       "Error fetching direct conversations:",
//       error.message
//     );

//     return res.status(500).json({
//       message:
//         "Failed to fetch direct conversations",
//     });
//   }
// };



// ==========================================
// GET DIRECT CONVERSATIONS
// ==========================================

export const getDirectConversations = async (
  req,
  res
) => {
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    let conversations = [];

    // ======================================
    // STUDENT
    // Show ALL ADMINS
    // ======================================

    if (currentUserRole === "student") {
      const [rows] = await pool.query(
        `
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.profile_pic,
          u.role,

          (
            SELECT MAX(dm.created_at)
            FROM direct_messages dm
            WHERE
              (
                dm.sender_id = ?
                AND dm.receiver_id = u.id
              )
              OR
              (
                dm.sender_id = u.id
                AND dm.receiver_id = ?
              )
          ) AS last_message_at

        FROM users u

        WHERE
          u.role = "admin"
          AND u.id != ?

        ORDER BY
          last_message_at IS NULL,
          last_message_at DESC,
          u.full_name ASC
        `,
        [
          currentUserId,
          currentUserId,
          currentUserId,
        ]
      );

      conversations = rows;
    }

    // ======================================
    // ADMIN
    // Show ALL USERS
    // Students + Other Admins
    // ======================================

    else if (currentUserRole === "admin") {
      const [rows] = await pool.query(
        `
        SELECT
          u.id,
          u.full_name,
          u.email,
          u.profile_pic,
          u.role,

          (
            SELECT MAX(dm.created_at)
            FROM direct_messages dm
            WHERE
              (
                dm.sender_id = ?
                AND dm.receiver_id = u.id
              )
              OR
              (
                dm.sender_id = u.id
                AND dm.receiver_id = ?
              )
          ) AS last_message_at

        FROM users u

        WHERE
          u.id != ?

        ORDER BY
          last_message_at IS NULL,
          last_message_at DESC,
          u.full_name ASC
        `,
        [
          currentUserId,
          currentUserId,
          currentUserId,
        ]
      );

      conversations = rows;
    }

    return res.status(200).json(
      conversations
    );

  } catch (error) {
    console.error(
      "Error fetching direct conversations:",
      error.message
    );

    return res.status(500).json({
      message:
        "Failed to fetch direct conversations",
    });
  }
};
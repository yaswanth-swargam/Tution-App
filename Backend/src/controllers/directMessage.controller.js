import pool from "../lib/db.js";
import { getIO } from "../lib/socket.js";

// ==========================================
// SEND DIRECT MESSAGE
// ==========================================

export const sendDirectMessage = async (req, res) => {
  const { receiverId } = req.params;

  const {
    content,
    file_url,
    file_public_id,
    file_name,
    file_type,
    file_size,
  } = req.body;

  const senderId = req.user.id;
  const senderRole = req.user.role;

  try {
    console.log("📥 Direct message request received");
    console.log("📥 BODY:", req.body);

    // Empty string instead of null because
    // content column is NOT NULL
    const trimmedContent = content?.trim() || "";

    // ==========================================
    // VALIDATE MESSAGE
    // ==========================================

    if (!trimmedContent && !file_url) {
      return res.status(400).json({
        message: "Message content or file is required",
      });
    }

    // ==========================================
    // PREVENT SELF MESSAGE
    // ==========================================

    if (Number(receiverId) === Number(senderId)) {
      return res.status(400).json({
        message: "You cannot send a message to yourself",
      });
    }

    // ==========================================
    // CHECK RECEIVER
    // ==========================================

    console.log("1️⃣ Checking receiver");

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

    console.log("2️⃣ Receiver found:", receiver[0].full_name);

    // ==========================================
    // ACCESS RULES
    // ==========================================

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

    // ==========================================
    // SAVE MESSAGE
    // ==========================================

    console.log("3️⃣ Saving direct message");

    const [result] = await pool.query(
      `
      INSERT INTO direct_messages (
        sender_id,
        receiver_id,
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
        senderId,
        receiverId,
        trimmedContent,
        file_url || null,
        file_public_id || null,
        file_name || null,
        file_type || null,
        file_size || null,
      ]
    );

    console.log(
      "4️⃣ Message inserted:",
      result.insertId
    );

    // ==========================================
    // FETCH CREATED MESSAGE
    // ==========================================

    console.log("5️⃣ Fetching created message");

    const [messageRows] = await pool.query(
      `
      SELECT
        dm.id,
        dm.sender_id,
        dm.receiver_id,
        dm.content,

        dm.file_url,
        dm.file_public_id,
        dm.file_name,
        dm.file_type,
        dm.file_size,

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

    console.log(
      "6️⃣ Message fetched:",
      newMessage
    );

    // ==========================================
    // SEND HTTP RESPONSE FIRST
    // ==========================================

    console.log("7️⃣ Sending HTTP response");

    res.status(201).json({
      message: "Direct message sent successfully",
      data: newMessage,
    });

    // ==========================================
    // REALTIME SOCKET DELIVERY
    // ==========================================
    // Done AFTER response so Socket.IO problems
    // don't keep the frontend loading

    try {
      console.log("8️⃣ Getting Socket.IO");

      const io = getIO();

      console.log(
        `📡 Emitting to user_${senderId}`
      );

      io.to(`user_${senderId}`).emit(
        "new_direct_message",
        newMessage
      );

      console.log(
        `📡 Emitting to user_${receiverId}`
      );

      io.to(`user_${receiverId}`).emit(
        "new_direct_message",
        newMessage
      );



      // ==========================================
// REALTIME UNREAD NOTIFICATION
// ==========================================

io.to(`user_${receiverId}`).emit(
  "direct_message_unread",
  {
    user_id: Number(senderId),
    message_id: Number(newMessage.id),
  }
);

console.log(
  `🔴 Direct unread event sent to user_${receiverId}`
);

      console.log(
        "9️⃣ Direct message emitted successfully"
      );

    } catch (socketError) {
      // Message is already saved and response
      // is already sent, so don't fail the request

      console.error(
        "⚠️ Socket emission failed:",
        socketError.message
      );
    }

  } catch (error) {
    console.error(
      "❌ Error sending direct message:",
      error
    );

    return res.status(500).json({
      message: "Failed to send direct message",
    });
  }
};


// ==========================================
// GET DIRECT MESSAGES
// ==========================================

export const getDirectMessages = async (req, res) => {
  const { userId } = req.params;

  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    // ==========================================
    // CHECK USER
    // ==========================================

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

    // ==========================================
    // SECURITY RULES
    // ==========================================

    if (
      currentUserRole === "student" &&
      otherUser.role === "student"
    ) {
      return res.status(403).json({
        message:
          "Students can only access conversations with administrators",
      });
    }

    // ==========================================
    // FETCH CONVERSATION
    // ==========================================

    const [messages] = await pool.query(
      `
      SELECT
        dm.id,
        dm.sender_id,
        dm.receiver_id,
        dm.content,

        dm.file_url,
        dm.file_public_id,
        dm.file_name,
        dm.file_type,
        dm.file_size,

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
      "❌ Error fetching direct messages:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to fetch direct messages",
    });
  }
};


// ==========================================
// GET DIRECT CONVERSATIONS
// ==========================================

export const getDirectConversations =
  async (req, res) => {

    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    try {
      let conversations = [];

      // ==========================================
      // STUDENT
      // SHOW ALL ADMINS
      // ==========================================

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

      // ==========================================
      // ADMIN
      // SHOW ALL USERS
      // ==========================================

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
        "❌ Error fetching direct conversations:",
        error.message
      );

      return res.status(500).json({
        message:
          "Failed to fetch direct conversations",
      });
    }
  };
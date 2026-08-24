import pool from "../lib/db.js";
import { getIO } from "../lib/socket.js";
export const sendDirectMessage = async (req, res) => {
  const { receiverId } = req.params;
  const { content } = req.body;

  const senderId = req.user.id;
  const senderRole = req.user.role;

  try {
    // Validate message
    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    // Prevent sending message to yourself
    if (Number(receiverId) === senderId) {
      return res.status(400).json({
        message: "You cannot send a message to yourself",
      });
    }

    // Check whether receiver exists
    const [receiver] = await pool.query(
      `SELECT id, full_name, role
       FROM users
       WHERE id = ?`,
      [receiverId]
    );

    if (receiver.length === 0) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const receiverRole = receiver[0].role;

    // Student can only message admin
    if (
      senderRole === "student" &&
      receiverRole !== "admin"
    ) {
      return res.status(403).json({
        message:
          "Students can only send direct messages to the admin",
      });
    }

    // Admin can only message students
    if (
      senderRole === "admin" &&
      receiverRole !== "student"
    ) {
      return res.status(403).json({
        message:
          "Admin can only send direct messages to students",
      });
    }

    // Save message
    const [result] = await pool.query(
      `INSERT INTO direct_messages
       (sender_id, receiver_id, content)
       VALUES (?, ?, ?)`,
      [senderId, receiverId, content.trim()]
    );

    // Get newly created message with sender details
    const [message] = await pool.query(
  `SELECT
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
  WHERE dm.id = ?`,
  [result.insertId]
);

const newMessage = message[0];

const io = getIO();

io.emit("new_direct_message", newMessage);

return res.status(201).json({
  message: "Direct message sent successfully",
  data: newMessage,
});

  } catch (error) {
    console.error(
      "Error sending direct message:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to send direct message",
    });
  }
};




export const getDirectMessages = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    // Check whether the other user exists
    const [users] = await pool.query(
      `SELECT id, full_name, email, profile_pic, role
       FROM users
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otherUser = users[0];

    // Security rules
    // Student can only access conversation with admin
    if (
      currentUserRole === "student" &&
      otherUser.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Students can only access direct messages with the admin",
      });
    }

    // Admin can only access conversation with students
    if (
      currentUserRole === "admin" &&
      otherUser.role !== "student"
    ) {
      return res.status(403).json({
        message: "Admin can only access direct messages with students",
      });
    }

    // Fetch conversation between these two users
    const [messages] = await pool.query(
      `SELECT
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
        (dm.sender_id = ? AND dm.receiver_id = ?)
        OR
        (dm.sender_id = ? AND dm.receiver_id = ?)

      ORDER BY dm.created_at ASC`,
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
      message: "Failed to fetch direct messages",
    });
  }
};


export const getDirectConversations = async (req, res) => {
  const currentUserId = req.user.id;
  const currentUserRole = req.user.role;

  try {
    let conversations = [];

    // ADMIN → Get students who have exchanged messages with admin
    if (currentUserRole === "admin") {
      const [rows] = await pool.query(
        `
        SELECT 
          u.id,
          u.full_name,
          u.email,
          u.profile_pic,
          u.role,
          MAX(dm.created_at) AS last_message_at
          
        FROM direct_messages dm
        
        JOIN users u 
          ON u.id = CASE
            WHEN dm.sender_id = ? THEN dm.receiver_id
            ELSE dm.sender_id
          END
          
        WHERE dm.sender_id = ?
           OR dm.receiver_id = ?
           
        GROUP BY 
          u.id,
          u.full_name,
          u.email,
          u.profile_pic,
          u.role
          
        ORDER BY last_message_at DESC
        `,
        [
          currentUserId,
          currentUserId,
          currentUserId,
        ]
      );

      conversations = rows;
    }

    // STUDENT → Show admin only if a conversation exists
    else if (currentUserRole === "student") {
      const [rows] = await pool.query(
        `
        SELECT 
          u.id,
          u.full_name,
          u.email,
          u.profile_pic,
          u.role,
          MAX(dm.created_at) AS last_message_at
          
        FROM direct_messages dm
        
        JOIN users u
          ON u.id = CASE
            WHEN dm.sender_id = ? THEN dm.receiver_id
            ELSE dm.sender_id
          END
          
        WHERE 
          (dm.sender_id = ? OR dm.receiver_id = ?)
          AND u.role = "admin"
          
        GROUP BY 
          u.id,
          u.full_name,
          u.email,
          u.profile_pic,
          u.role
          
        ORDER BY last_message_at DESC
        `,
        [
          currentUserId,
          currentUserId,
          currentUserId,
        ]
      );

      conversations = rows;
    }

    return res.status(200).json(conversations);

  } catch (error) {
    console.error(
      "Error fetching direct conversations:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to fetch direct conversations",
    });
  }
};
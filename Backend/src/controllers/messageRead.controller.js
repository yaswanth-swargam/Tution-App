import pool from "../lib/db.js";

// ==========================================
// GET UNREAD SECTION MESSAGE COUNT
// ==========================================

export const getUnreadSectionMessages = async (
  req,
  res
) => {
  const userId = req.user.id;
  const { sectionId } = req.params;

  try {
    // =========================
    // CHECK SECTION
    // =========================

    const [sections] = await pool.query(
      `
      SELECT id
      FROM sections
      WHERE id = ?
      `,
      [sectionId]
    );

    if (sections.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // =========================
    // STUDENT ACCESS
    // =========================

    if (req.user.role === "student") {
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
            "You do not have access to this section",
        });
      }
    }

    // =========================
    // GET LAST READ MESSAGE
    // =========================

    const [readRows] = await pool.query(
      `
      SELECT last_read_message_id
      FROM section_message_reads
      WHERE section_id = ?
        AND user_id = ?
      `,
      [sectionId, userId]
    );

    const lastReadMessageId =
      readRows.length > 0
        ? readRows[0].last_read_message_id
        : null;

    // =========================
    // COUNT UNREAD MESSAGES
    // =========================

    let unreadCount = 0;

    if (lastReadMessageId) {
      const [rows] = await pool.query(
        `
        SELECT COUNT(*) AS unread_count
        FROM messages
        WHERE section_id = ?
          AND id > ?
          AND sender_id != ?
        `,
        [
          sectionId,
          lastReadMessageId,
          userId,
        ]
      );

      unreadCount = rows[0].unread_count;
    } else {
      // User has never opened/read this section.
      // Count all messages except their own.

      const [rows] = await pool.query(
        `
        SELECT COUNT(*) AS unread_count
        FROM messages
        WHERE section_id = ?
          AND sender_id != ?
        `,
        [sectionId, userId]
      );

      unreadCount = rows[0].unread_count;
    }

    return res.status(200).json({
      sectionId: Number(sectionId),
      unreadCount: Number(unreadCount),
      lastReadMessageId,
    });

  } catch (error) {
    console.error(
      "Error fetching unread section messages:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch unread section messages",
    });
  }
};


// ==========================================
// MARK SECTION MESSAGES AS READ
// ==========================================

export const markSectionMessagesAsRead = async (
  req,
  res
) => {
  const userId = req.user.id;
  const { sectionId } = req.params;

  try {
    // =========================
    // CHECK SECTION
    // =========================

    const [sections] = await pool.query(
      `
      SELECT id
      FROM sections
      WHERE id = ?
      `,
      [sectionId]
    );

    if (sections.length === 0) {
      return res.status(404).json({
        message: "Section not found",
      });
    }

    // =========================
    // STUDENT ACCESS
    // =========================

    if (req.user.role === "student") {
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
            "You do not have access to this section",
        });
      }
    }

    // =========================
    // GET LATEST MESSAGE
    // =========================

    const [messages] = await pool.query(
      `
      SELECT id
      FROM messages
      WHERE section_id = ?
      ORDER BY id DESC
      LIMIT 1
      `,
      [sectionId]
    );

    // No messages yet
    if (messages.length === 0) {
      await pool.query(
        `
        INSERT INTO section_message_reads
        (
          section_id,
          user_id,
          last_read_message_id
        )
        VALUES (?, ?, NULL)
        ON DUPLICATE KEY UPDATE
          last_read_message_id = NULL
        `,
        [sectionId, userId]
      );

      return res.status(200).json({
        message:
          "Section marked as read",
        lastReadMessageId: null,
      });
    }

    const latestMessageId =
      messages[0].id;

    // =========================
    // SAVE READ POSITION
    // =========================

    await pool.query(
      `
      INSERT INTO section_message_reads
      (
        section_id,
        user_id,
        last_read_message_id
      )
      VALUES (?, ?, ?)

      ON DUPLICATE KEY UPDATE
        last_read_message_id = VALUES(
          last_read_message_id
        )
      `,
      [
        sectionId,
        userId,
        latestMessageId,
      ]
    );

    return res.status(200).json({
      message:
        "Section messages marked as read",
      sectionId: Number(sectionId),
      lastReadMessageId:
        latestMessageId,
    });

  } catch (error) {
    console.error(
      "Error marking section messages as read:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to mark section messages as read",
    });
  }
};
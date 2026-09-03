import pool from "../lib/db.js";

// Get logged-in user's notifications
export const getNotifications = async (req, res) => {
  try {
    const [notifications] = await pool.query(
      `SELECT
        id,
        type,
        title,
        message,
        reference_id,
        reference_type,
        is_read,
        created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    return res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};


// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const [[result]] = await pool.query(
      `SELECT COUNT(*) AS unreadCount
       FROM notifications
       WHERE user_id = ?
       AND is_read = FALSE`,
      [req.user.id]
    );

    return res.status(200).json({
      unreadCount: result.unreadCount,
    });
  } catch (error) {
    console.error("Get unread notification count error:", error);

    return res.status(500).json({
      message: "Failed to fetch unread notification count",
    });
  }
};


// Mark one notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE id = ?
       AND user_id = ?`,
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      message: "Failed to mark notification as read",
    });
  }
};


// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications
       SET is_read = TRUE
       WHERE user_id = ?
       AND is_read = FALSE`,
      [req.user.id]
    );

    return res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      message: "Failed to mark all notifications as read",
    });
  }
};


// Admin sends notification to selected sections
export const sendNotification = async (req, res) => {
  try {
    // Only admin can send notifications
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only.",
      });
    }

    const { title, message, section_ids } = req.body;

    // Basic validation
    if (!title || !message || !section_ids) {
      return res.status(400).json({
        message: "Title, message and sections are required",
      });
    }

    if (!Array.isArray(section_ids) || section_ids.length === 0) {
      return res.status(400).json({
        message: "At least one section must be selected",
      });
    }

    // Find all students belonging to the selected sections
    const placeholders = section_ids.map(() => "?").join(",");

    const [students] = await pool.query(
      `SELECT DISTINCT u.id, u.email, u.full_name
       FROM users u
       INNER JOIN section_members sm
          ON u.id = sm.user_id
       WHERE sm.section_id IN (${placeholders})
       AND u.role = 'student'`,
      section_ids
    );

    if (students.length === 0) {
      return res.status(404).json({
        message: "No students found in the selected sections",
      });
    }

    // Create one notification for every student
    const notificationValues = students.map((student) => [
      student.id,
      "ANNOUNCEMENT",
      title,
      message,
      null,
      null,
    ]);

    const notificationPlaceholders = notificationValues
      .map(() => "(?, ?, ?, ?, ?, ?)")
      .join(",");

    await pool.query(
      `INSERT INTO notifications
       (user_id, type, title, message, reference_id, reference_type)
       VALUES ${notificationPlaceholders}`,
      notificationValues.flat()
    );

    return res.status(201).json({
      message: "Notification sent successfully",
      recipientCount: students.length,
    });
  } catch (error) {
    console.error("Send notification error:", error);

    return res.status(500).json({
      message: "Failed to send notification",
    });
  }
};
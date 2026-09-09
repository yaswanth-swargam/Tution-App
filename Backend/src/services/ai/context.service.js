import pool from "../../lib/db.js";

const APP_TIMEZONE = "Asia/Kolkata";

/*
 * Get the start of today in the application's timezone.
 *
 * We return ISO strings with the +05:30 offset so MySQL
 * can compare them correctly with created_at.
 */
const getTodayRange = () => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [year, month, day] = formatter
    .format(now)
    .split("-")
    .map(Number);

  const todayStart = new Date(
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}T00:00:00+05:30`
  );

  return todayStart;
};


/*
 * Calculate the database date range based on the user's request.
 *
 * The end is always the start of tomorrow.
 */
const getActivityDateRange = (range) => {
  const todayStart = getTodayRange();

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  switch (range) {
    case "today":
      return {
        start: todayStart,
        end: tomorrowStart,
      };

    case "yesterday": {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 1);

      return {
        start,
        end: todayStart,
      };
    }

    case "2_days": {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 1);

      return {
        start,
        end: tomorrowStart,
      };
    }

    case "3_days": {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 2);

      return {
        start,
        end: tomorrowStart,
      };
    }

    case "7_days": {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 6);

      return {
        start,
        end: tomorrowStart,
      };
    }

    case "30_days": {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - 29);

      return {
        start,
        end: tomorrowStart,
      };
    }

    default:
      return {
        start: todayStart,
        end: tomorrowStart,
      };
  }
};


/*
 * Format dates for AI context.
 *
 * The AI should see dates in the application's timezone,
 * rather than raw database timestamps.
 */
const formatDateForAI = (date) => {
  if (!date) return null;

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: APP_TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};


/*
 * Build only the data the current user is authorized to see.
 */
export const buildUserContext = async (
  user,
  intent,
  activityRange = "today"
) => {
  const userId = user.id;
  const isAdmin = user.role === "admin";

  let messages = [];
  let notifications = [];
  let studyMaterials = [];

  /*
   * ACTIVITY CONTEXT
   */
  if (intent === "activity") {
    const { start, end } = getActivityDateRange(activityRange);

    if (isAdmin) {
      const [messageRows] = await pool.query(
        `
        SELECT
          m.id,
          m.section_id,
          m.sender_id,
          m.content,
          m.created_at,
          u.full_name AS sender_name
        FROM messages m
        JOIN users u
          ON u.id = m.sender_id
        WHERE m.created_at >= ?
          AND m.created_at < ?
        ORDER BY m.created_at DESC
        LIMIT 100
        `,
        [start, end]
      );

      messages = messageRows;
    } else {
      const [messageRows] = await pool.query(
        `
        SELECT
          m.id,
          m.section_id,
          m.sender_id,
          m.content,
          m.created_at,
          u.full_name AS sender_name
        FROM messages m
        JOIN users u
          ON u.id = m.sender_id
        JOIN section_members sm
          ON sm.section_id = m.section_id
        WHERE sm.user_id = ?
          AND m.created_at >= ?
          AND m.created_at < ?
        ORDER BY m.created_at DESC
        LIMIT 100
        `,
        [userId, start, end]
      );

      messages = messageRows;
    }

    const [notificationRows] = await pool.query(
      `
      SELECT
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
        AND created_at >= ?
        AND created_at < ?
      ORDER BY created_at DESC
      LIMIT 50
      `,
      [userId, start, end]
    );

    notifications = notificationRows;

    /*
     * Convert timestamps into application timezone
     * before sending them to the LLM.
     */
    messages = messages.map((message) => ({
      ...message,
      created_at: formatDateForAI(message.created_at),
    }));

    notifications = notifications.map((notification) => ({
      ...notification,
      created_at: formatDateForAI(notification.created_at),
    }));
  }


  /*
   * MATERIAL CONTEXT
   */
  if (intent === "material") {
    let materialRows;

    if (isAdmin) {
      [materialRows] = await pool.query(`
        SELECT
          sm.id,
          sm.section_id,
          sm.title,
          sm.description,
          sm.material_type,
          sm.file_name,
          sm.file_type,
          sm.external_url,
          sm.created_at
        FROM study_materials sm
        ORDER BY sm.created_at DESC
        LIMIT 20
      `);
    } else {
      [materialRows] = await pool.query(
        `
        SELECT
          sm.id,
          sm.section_id,
          sm.title,
          sm.description,
          sm.material_type,
          sm.file_name,
          sm.file_type,
          sm.external_url,
          sm.created_at
        FROM study_materials sm
        JOIN section_members sgm
          ON sgm.section_id = sm.section_id
        WHERE sgm.user_id = ?
        ORDER BY sm.created_at DESC
        LIMIT 20
        `,
        [userId]
      );
    }

    studyMaterials = materialRows.map((material) => ({
      ...material,
      created_at: formatDateForAI(material.created_at),
    }));
  }


  return {
    user: {
      id: user.id,
      name: user.full_name,
      role: user.role,
    },

    tuitionData: {
      messages,
      notifications,
      studyMaterials,
    },
  };
};
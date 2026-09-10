import pool from "../lib/db.js";
import {processConversationMessage} from '../services/ai/ai.service.js'
/*
 * GET /api/ai/conversations
 *
 * Get the current user's recent AI conversations.
 */


const getAIErrorDetails = (error) => {
  if (
    error?.status === 429 ||
    error?.code === "rate_limit_exceeded"
  ) {
    return {
      status: 429,
      message:
        "Genie is temporarily unavailable because the AI request limit has been reached. Please try again later.",
    };
  }

  if (
    error?.name === "APIConnectionTimeoutError" ||
    error?.code === "ETIMEDOUT" ||
    error?.message?.toLowerCase().includes("timed out")
  ) {
    return {
      status: 504,
      message:
        "Genie took too long to respond. Please try again.",
    };
  }

  if (error?.name === "APIConnectionError") {
    return {
      status: 503,
      message:
        "Genie is temporarily unavailable. Please try again.",
    };
  }

  return {
    status: 500,
    message: "Failed to process AI message.",
  };
};

export const sendConversationMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const trimmedMessage = message.trim();

    // --------------------------------------------------
    // 1. Verify conversation belongs to current user
    // --------------------------------------------------

    const [conversationRows] = await pool.query(
      `
      SELECT
        id,
        title
      FROM ai_conversations
      WHERE id = ?
        AND user_id = ?
      `,
      [conversationId, userId]
    );

    if (conversationRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // --------------------------------------------------
    // 2. Save USER message
    // --------------------------------------------------

    const [userMessageResult] = await pool.query(
      `
      INSERT INTO ai_messages (
        conversation_id,
        role,
        content
      )
      VALUES (?, 'user', ?)
      `,
      [conversationId, trimmedMessage]
    );

    const userMessage = {
      id: userMessageResult.insertId,
      role: "user",
      content: trimmedMessage,
    };

    // --------------------------------------------------
    // 3. Get conversation history
    // --------------------------------------------------

    const [conversationHistory] = await pool.query(
      `
      SELECT
        id,
        role,
        content,
        created_at
      FROM ai_messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC, id ASC
      `,
      [conversationId]
    );

    // --------------------------------------------------
    // 4. Ask AI
    // --------------------------------------------------

    const result = await processConversationMessage({
      user: req.user,
      message: trimmedMessage,
      conversationHistory,
    });

    // --------------------------------------------------
    // 5. Save AI response
    // --------------------------------------------------

    const [assistantMessageResult] = await pool.query(
      `
      INSERT INTO ai_messages (
        conversation_id,
        role,
        content
      )
      VALUES (?, 'assistant', ?)
      `,
      [conversationId, result.answer]
    );

    const assistantMessage = {
      id: assistantMessageResult.insertId,
      role: "assistant",
      content: result.answer,
    };

    // --------------------------------------------------
    // 6. Update conversation title
    // --------------------------------------------------

    if (conversationRows[0].title === "New chat") {
      const title =
        trimmedMessage.length > 50
          ? `${trimmedMessage.slice(0, 50)}...`
          : trimmedMessage;

      await pool.query(
        `
        UPDATE ai_conversations
        SET title = ?
        WHERE id = ?
          AND user_id = ?
        `,
        [title, conversationId, userId]
      );
    }

    // --------------------------------------------------
    // 7. Update conversation timestamp
    // --------------------------------------------------

    await pool.query(
      `
      UPDATE ai_conversations
      SET updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND user_id = ?
      `,
      [conversationId, userId]
    );

    // --------------------------------------------------
    // 8. Return normal JSON response
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      userMessage,
      message: assistantMessage,
      intent: result.intent,
      activityRange: result.activityRange,
    });
  } catch (error) {
    console.error(
      "Send AI conversation message error:",
      error
    );

    const aiError = getAIErrorDetails(error);

    return res.status(aiError.status).json({
      success: false,
      message: aiError.message,
    });
  }
};
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const [conversations] = await pool.query(
      `
      SELECT
        id,
        title,
        created_at,
        updated_at
      FROM ai_conversations
      WHERE user_id = ?
      ORDER BY updated_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get AI conversations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load conversations",
    });
  }
};

/*
 * POST /api/ai/conversations
 *
 * Create a new conversation.
 */
export const createConversation = async (req, res) => {
  try {
    const userId = req.user.id;

    const [result] = await pool.query(
      `
      INSERT INTO ai_conversations (user_id, title)
      VALUES (?, ?)
      `,
      [userId, "New chat"]
    );

    const [rows] = await pool.query(
      `
      SELECT
        id,
        title,
        created_at,
        updated_at
      FROM ai_conversations
      WHERE id = ?
        AND user_id = ?
      `,
      [result.insertId, userId]
    );

    return res.status(201).json({
      success: true,
      conversation: rows[0],
    });
  } catch (error) {
    console.error("Create AI conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

/*
 * GET /api/ai/conversations/:id
 *
 * Get one conversation and its messages.
 */
export const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const [conversationRows] = await pool.query(
      `
      SELECT
        id,
        title,
        created_at,
        updated_at
      FROM ai_conversations
      WHERE id = ?
        AND user_id = ?
      `,
      [conversationId, userId]
    );

    if (conversationRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const [messages] = await pool.query(
      `
      SELECT
        id,
        role,
        content,
        created_at
      FROM ai_messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC, id ASC
      `,
      [conversationId]
    );

    return res.status(200).json({
      success: true,
      conversation: conversationRows[0],
      messages,
    });
  } catch (error) {
    console.error("Get AI conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load conversation",
    });
  }
};

/*
 * DELETE /api/ai/conversations/:id
 *
 * Delete a conversation owned by the current user.
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const [result] = await pool.query(
      `
      DELETE FROM ai_conversations
      WHERE id = ?
        AND user_id = ?
      `,
      [conversationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation deleted",
    });
  } catch (error) {
    console.error("Delete AI conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};


export const renameConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Conversation title is required",
      });
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Conversation title must be 100 characters or less",
      });
    }

    const [result] = await pool.query(
      `
      UPDATE ai_conversations
      SET title = ?
      WHERE id = ?
        AND user_id = ?
      `,
      [trimmedTitle, conversationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      title: trimmedTitle,
    });
  } catch (error) {
    console.error("Rename AI conversation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to rename conversation",
    });
  }
};
import { processAIChat } from "../services/ai/ai.service.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result = await processAIChat({
      user: req.user,
      message: message.trim(),
    });

    return res.status(200).json({
  success: true,
  answer: result.answer,
  intent: result.intent,
  activityRange: result.activityRange,
});
  } catch (error) {
    console.error("AI chat error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get AI response",
    });
  }
};


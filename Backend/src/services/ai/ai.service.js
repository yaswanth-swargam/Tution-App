import { generateAIResponse } from "../../lib/ai.js";
import { buildUserContext } from "./context.service.js";
import { AI_SYSTEM_PROMPT } from "./prompts.js";


/*
 * Detect the type of request.
 */
const detectIntent = (message) => {
  const text = message.toLowerCase().trim();

  const activityPatterns = [
    /what\s+(did|have|i)\s+.*miss/i,
    /what.*missed/i,
    /missed\s+(today|yesterday|this week|last week)/i,

    /(last|past)\s+(two|2|three|3|few|several|couple)\s+days?/i,
    /(last|past)\s+week/i,
    /(last|past)\s+month/i,

    /recent\s+(updates?|activity)/i,
    /latest\s+(updates?|activity)/i,

    /what\s+happened/i,

    /teacher\s+(posted|post)/i,

    /new\s+messages?/i,
    /new\s+notifications?/i,
    /\bnotifications?\b/i,
  ];

  const materialPatterns = [
    /\bstudy\s+materials?\b/i,
    /\buploaded\s+materials?\b/i,
    /\blatest\s+materials?\b/i,

    /summarize.*material/i,
    /explain.*material/i,
    /make\s+a\s+quiz.*material/i,
  ];

  if (activityPatterns.some((pattern) => pattern.test(text))) {
    return "activity";
  }

  if (materialPatterns.some((pattern) => pattern.test(text))) {
    return "material";
  }

  return "general";
};


/*
 * Detect how far back the user wants activity.
 */
const detectActivityRange = (message) => {
  const text = message
    .toLowerCase()
    .replace(/\btwod\b/g, "two")
    .replace(/\b2day\b/g, "today")
    .replace(/\byday\b/g, "yesterday");


  /*
   * 2 days
   */
  if (
    text.includes("last two days") ||
    text.includes("last 2 days") ||
    text.includes("past two days") ||
    text.includes("past 2 days") ||
    text.includes("two days") ||
    text.includes("2 days") ||
    text.includes("couple of days")
  ) {
    return "2_days";
  }


  /*
   * 3 days
   */
  if (
    text.includes("last three days") ||
    text.includes("last 3 days") ||
    text.includes("past three days") ||
    text.includes("past 3 days") ||
    text.includes("three days") ||
    text.includes("3 days")
  ) {
    return "3_days";
  }


  /*
   * Week
   */
  if (
    text.includes("this week") ||
    text.includes("last week") ||
    text.includes("past week")
  ) {
    return "7_days";
  }


  /*
   * Month
   */
  if (
    text.includes("this month") ||
    text.includes("last month") ||
    text.includes("past month")
  ) {
    return "30_days";
  }


  /*
   * Yesterday
   */
  if (text.includes("yesterday")) {
    return "yesterday";
  }


  /*
   * Today
   */
  if (text.includes("today")) {
    return "today";
  }


  /*
   * Default activity range.
   */
  return "today";
};


export const processAIChat = async ({ user, message }) => {
  const intent = detectIntent(message);

  const activityRange =
    intent === "activity"
      ? detectActivityRange(message)
      : null;


  /*
   * Default context for general questions.
   */
  let context = {
    user: {
      id: user.id,
      name: user.full_name,
      role: user.role,
    },
    tuitionData: {},
  };


  /*
   * Only access TuitionApp data when required.
   */
  if (intent === "activity" || intent === "material") {
    context = await buildUserContext(
      user,
      intent,
      activityRange
    );
  }


  /*
   * Use application timezone for the current date.
   */
  const currentDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
  }).format(new Date());


  const prompt = `
${AI_SYSTEM_PROMPT}

CURRENT DATE:
${currentDate}

APPLICATION TIMEZONE:
Asia/Kolkata

DETECTED INTENT:
${intent}

ACTIVITY RANGE:
${activityRange || "not applicable"}

CURRENT USER:
${JSON.stringify(context.user, null, 2)}

TUITIONAPP CONTEXT:
${JSON.stringify(context.tuitionData, null, 2)}

USER QUESTION:
${message}
`;


  const answer = await generateAIResponse(prompt);


  return {
    answer,
    intent,
    activityRange,
  };
};


export const processConversationMessage = async ({
  user,
  message,
  conversationHistory,
}) => {
  const intent = detectIntent(message);

  const activityRange =
    intent === "activity"
      ? detectActivityRange(message)
      : null;

  let context = {
    user: {
      id: user.id,
      name: user.full_name,
      role: user.role,
    },
    tuitionData: {},
  };

  if (intent === "activity" || intent === "material") {
    context = await buildUserContext(
      user,
      intent,
      activityRange
    );
  }

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
  }).format(new Date());

  /*
   * Keep the full conversation in the database,
   * but only send the most recent messages to the AI.
   */
  const recentHistory = conversationHistory.slice(-12);

  const conversationMessages = recentHistory.map(
    (item) => ({
      role: item.role,
      content: item.content,
    })
  );

  const prompt = `
${AI_SYSTEM_PROMPT}

CURRENT DATE:
${currentDate}

APPLICATION TIMEZONE:
Asia/Kolkata

CURRENT USER:
${JSON.stringify(context.user, null, 2)}

DETECTED INTENT:
${intent}

ACTIVITY RANGE:
${activityRange || "not applicable"}

TUITIONAPP CONTEXT:
${JSON.stringify(context.tuitionData, null, 2)}

RECENT CONVERSATION HISTORY:
${JSON.stringify(conversationMessages, null, 2)}

LATEST USER QUESTION:
${message}
`;

  const answer = await generateAIResponse(prompt);

  return {
    answer,
    intent,
    activityRange,
  };
};
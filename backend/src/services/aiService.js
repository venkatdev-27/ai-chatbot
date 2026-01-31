const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateAIResponse = async ({
  text,
}) => {
  try {
    const contents = [];

    // 🔹 Default system prompt
    const systemPromptText = "You are a friendly, intelligent AI chat assistant.\\n\\nRules:\\n- Respond naturally like a human conversation.\\n- Directly answer whatever the user asks.\\n- Keep replies short unless the user asks for details.\\n- If the user greets (hi, hello, hey), reply politely.\\n- If the user asks a question, answer it clearly.\\n- Do NOT ask for \\\"content to analyze\\\".\\n- Do NOT give generic instructions unless asked.\\n- If you don't know something, say so honestly.\\n\\nPersonality:\\n- Helpful\\n- Clear\\n- Conversational\\n- Technical when needed";

    // 🔹 Add system prompt as first message
    contents.push({
      role: "user",
      parts: [{ text: systemPromptText }],
    });

    // 🔹 Construct the User Message
    const userMessageParts = [];

    if (text && text.trim()) {
      userMessageParts.push({ text: text });
    }

    // 3. Add to contents
    if (userMessageParts.length > 0) {
      contents.push({
        role: "user",
        parts: userMessageParts,
      });
    }

    // 🚫 ABSOLUTELY NO DEFAULT "ANALYZE" PROMPT
    if (contents.length === 1) {
      return "👋 Hi! How can I help you today?";
    }

    // 🔹 Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key not configured");
      return "⚠️ AI is temporarily unavailable. Please check the API configuration.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
    });

    let aiText = "🤖 I'm here!";
    
    if (response && response.candidates && response.candidates[0] && 
        response.candidates[0].content && response.candidates[0].content.parts && 
        response.candidates[0].content.parts[0].text) {
        aiText = response.candidates[0].content.parts[0].text;
    } else if (response && response.text && typeof response.text === 'string') {
        aiText = response.text;
    }

    return aiText;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    
    // Provide more specific error messages
    if (error.message && error.message.includes("API key")) {
      return "⚠️ AI is temporarily unavailable. API key configuration issue.";
    } else if (error.message && error.message.includes("quota")) {
      return "⚠️ AI is temporarily unavailable. API quota exceeded.";
    } else if (error.message && error.message.includes("network")) {
      return "⚠️ AI is temporarily unavailable. Network connection issue.";
    }
    
    return "⚠️ AI is temporarily unavailable. Please try again later.";
  }
};

module.exports = { generateAIResponse };

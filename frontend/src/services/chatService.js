import api from "./axiosInstance";

/* ---------------- CONVERSATIONS ---------------- */

// 🔹 Get all conversations
const getConversations = async () => {
  try {
    const { data } = await api.get("/conversations");
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch conversations"
    );
  }
};

// 🔹 Create conversation
const createConversation = async (title = "New Chat") => {
  try {
    const { data } = await api.post("/conversations", { title });
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to create conversation"
    );
  }
};

// 🔹 Delete conversation
const deleteConversation = async (conversationId) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  try {
    const { data } = await api.delete(`/conversations/${conversationId}`);
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete conversation"
    );
  }
};

/* ---------------- MESSAGES ---------------- */

// 🔹 Get messages for a conversation
const getMessages = async (conversationId) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  try {
    const { data } = await api.get(
      `/conversations/${conversationId}/messages`
    );
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch messages"
    );
  }
};

// 🔹 Send message (REST fallback – optional if socket is primary)
const sendMessage = async (messageData) => {
  if (!messageData?.conversationId) {
    throw new Error("Conversation ID is required");
  }

  try {
    const { data } = await api.post("/chat/messages", messageData);
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to send message"
    );
  }
};

export default {
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
  sendMessage,
};

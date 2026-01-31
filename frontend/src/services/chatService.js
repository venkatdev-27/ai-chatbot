import api from "./axiosInstance";

// 🔹 Get User Conversations
const getConversations = async () => {
  try {
    const response = await api.get("/conversations");
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch conversations"
    );
  }
};

// 🔹 Create Conversation
const createConversation = async (title) => {
  try {
    const response = await api.post("/conversations", { title });
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to create conversation"
    );
  }
};

// 🔹 Delete Conversation (SAFE)
const deleteConversation = async (id) => {
  if (!id) {
    throw new Error("Conversation ID is missing");
  }

  try {
    const response = await api.delete(`/conversations/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to delete conversation"
    );
  }
};

// 🔹 Get Messages for Conversation
const getMessages = async (conversationId) => {
  if (!conversationId) {
    throw new Error("Conversation ID is missing");
  }

  try {
    const response = await api.get(
      `/conversations/${conversationId}/messages`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch messages"
    );
  }
};

// 🔹 Send a message
const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/chat/messages", messageData);
    return response.data;
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

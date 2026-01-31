import api from "./axiosInstance";

// 🔹 Get User Conversations
const getConversations = async () => {
    try {
        const response = await api.get("/conversations");
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to fetch conversations");
    }
};

// 🔹 Create Conversation
const createConversation = async (title) => {
    try {
        const response = await api.post("/conversations", { title });
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to create conversation");
    }
};

// 🔹 Delete Conversation
const deleteConversation = async (id) => {
    try {
        const response = await api.delete(`/conversations/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || "Failed to delete conversation");
    }
};

// 🔹 Get Messages for Conversation
const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to fetch messages"
    );
  }
};

// 🔹 Send a message (REST fallback / history)
const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/chat/messages", messageData); // NOTE: Might need update if REST used
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Failed to send message"
    );
  }
};

const chatService = {
    getConversations,
    createConversation,
    deleteConversation,
    getMessages,
    sendMessage,
};

export default chatService;



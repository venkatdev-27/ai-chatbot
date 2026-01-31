const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

/* ===============================
   🔹 Create New Conversation
================================ */
const createConversation = async (req, res) => {
  try {
    const { title } = req.body;

    const conversation = await Conversation.create({
      user: req.user._id,
      title: title?.trim() || "New Chat",
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
};

/* ===============================
   🔹 Get User Conversations
================================ */
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      user: req.user._id,
    }).sort({ lastMessageAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};

/* ===============================
   🔹 Update Conversation Title
================================ */
const updateConversation = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title: title.trim() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Update conversation error:", error);
    res.status(500).json({ message: "Failed to update conversation" });
  }
};

/* ===============================
   🔹 Delete Conversation
================================ */
const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // 🔥 Delete related messages
    await Message.deleteMany({ conversationId: req.params.id });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Delete conversation error:", error);
    res.status(500).json({ message: "Failed to delete conversation" });
  }
};

/* ===============================
   🔹 Get Messages of Conversation
================================ */
const getConversationMessages = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // ✅ Verify ownership FIRST
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({
      conversationId,
    })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

module.exports = {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  getConversationMessages,
};

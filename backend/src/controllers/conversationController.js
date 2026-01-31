const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

// 🔹 Create New Conversation
const createConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.create({
      user: req.user._id,
      title: title || "New Chat",
    });
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get User Conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ lastMessageAt: -1 }); // Newest first
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Update Conversation Title
const updateConversation = async (req, res) => {
  try {
    const { title } = req.body;
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title },
      { new: true }
    );
    if (!conversation) return res.status(404).json({ message: "Not found" });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Conversation
const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
    });
    
    if (!conversation) return res.status(404).json({ message: "Not found" });

    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId: req.params.id });

    res.json({ message: "Conversation deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get Messages for a Conversation
const getConversationMessages = async (req, res) => {
  try {
    const messages = await Message.find({ 
        conversationId: req.params.id 
        // Ensure user owns the conversation? 
        // Ideally yes, but for now we assume conversationId is valid.
        // Better: verify conversation belongs to user first.
    })
      .populate("sender", "username profilePic")
      .sort({ createdAt: 1 });
      
    // Verify ownership
    const conversation = await Conversation.findOne({
        _id: req.params.id,
        user: req.user._id
    });
    
    if (!conversation) return res.status(403).json({ message: "Access denied" });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createConversation,
  getConversations,
  updateConversation,
  deleteConversation,
  getConversationMessages
};

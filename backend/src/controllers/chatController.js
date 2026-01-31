const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

/* =========================================
   🔹 Get Messages by Conversation
   GET /api/chat/messages?conversationId=xxx
========================================= */
const getMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { conversationId } = req.query;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    // ✅ Verify conversation ownership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* =========================================
   🔹 Send Message (REST fallback)
   POST /api/chat/messages
========================================= */
const sendMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { content, type, mediaUrl, conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }

    if (!content && !mediaUrl) {
      return res
        .status(400)
        .json({ message: "Message content or media is required" });
    }

    // ✅ Verify conversation ownership
    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(403).json({ message: "Access denied" });
    }

    const message = await Message.create({
      sender: req.user._id,
      role: "user",
      content: content || "",
      type: type || "text",
      mediaUrl: mediaUrl || null,
      conversationId,
    });

    // 🔹 Update last message timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date(),
    });

    const populatedMessage = await message.populate(
      "sender",
      "username avatar"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};

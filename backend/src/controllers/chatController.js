const Message = require("../models/Message");

// @desc    Get all messages
// @route   GET /api/chat/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    // 🔹 Ensure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const messages = await Message.find()
      .populate("sender", "username profilePic email")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    // 🔹 Auth safety check
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { content, type, mediaUrl } = req.body;

    // 🔹 Validation
    if (!content && !mediaUrl) {
      return res
        .status(400)
        .json({ message: "Message content or media is required" });
    }

    // 🔹 Save user message
    const message = await Message.create({
      sender: req.user._id,
      role: "user",
      content: content || "",
      type: type || "text",
      mediaUrl: mediaUrl || null,
    });

    const fullMessage = await Message.findById(message._id).populate(
      "sender",
      "username profilePic"
    );

    res.status(201).json(fullMessage);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};

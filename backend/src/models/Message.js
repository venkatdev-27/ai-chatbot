const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // 🔹 Conversation Reference
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    // 🔹 Sender (null for AI messages)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🔹 Message role
    role: {
      type: String,
      enum: ["user", "model"], // ✅ FIXED
      default: "user",
    },

    // 🔹 Message content
    content: {
      type: String,
      trim: true,
      required: true,
    },

    // 🔹 Message type
    type: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },

    // 🔹 Media URL (optional)
    mediaUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

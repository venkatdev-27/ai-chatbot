const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // 🔹 Conversation Reference
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Who sent the message
    role: {
      type: String,
      enum: ["user", "ai"],
      default: "user",
    },

    content: {
      type: String,
      trim: true,
      default: ""
    },

    type: {
      type: String,
      enum: ["text", "image", "video"],
      default: "text",
    },

    mediaUrl: {
      type: String,
      default: null,
    },

    // 🔹 Store AI-generated reply (if any)
    aiReply: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

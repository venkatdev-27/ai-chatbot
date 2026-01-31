const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // 🔹 Owner of the conversation
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ⚡ faster queries per user
    },

    // 🔹 Chat title
    title: {
      type: String,
      trim: true,
      default: "New Chat",
    },

    // 🔹 Last activity timestamp (used for sorting chats)
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true, // ⚡ sidebar sorting
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Conversation", conversationSchema);

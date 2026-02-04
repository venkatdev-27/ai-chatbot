const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { generateAIResponse } = require("../services/aiService");

const chatSocket = (io, socket) => {

  /* 🔹 Join conversation room */
  socket.on("join", (conversationId) => {
    if (!conversationId) return;
    socket.join(conversationId);
    console.log(`🟢 Socket ${socket.id} joined ${conversationId}`);
  });

  /* 🔹 Leave conversation room */
  socket.on("leave", (conversationId) => {
    if (!conversationId) return;
    socket.leave(conversationId);
    console.log(`🔴 Socket ${socket.id} left ${conversationId}`);
  });

  /* 🔹 Send message */
  socket.on("sendMessage", async (data) => {
    const { senderId, content, type = "text", mediaUrl = null, conversationId } = data;

    if (!senderId || !conversationId || !content?.trim()) {
      console.error("❌ Invalid sendMessage payload");
      return;
    }

    try {
      /* 1️⃣ Save USER message */
      const userMessage = await Message.create({
        sender: senderId,
        role: "user",
        content,
        type,
        mediaUrl,
        conversationId,
      });

      const populatedUserMessage = await userMessage.populate(
        "sender",
        "username avatar"
      );

      /* 2️⃣ Emit user message */
      io.to(conversationId).emit("receiveMessage", populatedUserMessage);

      /* 3️⃣ Update conversation activity */
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date(),
      });

      /* 4️⃣ Emit Typing Indicator */
      socket.broadcast.to(conversationId).emit("typing", conversationId);

      /* 5️⃣ Generate AI reply */
      let aiReplyText;
      try {
        aiReplyText = await generateAIResponse({ text: content });
      } catch (aiErr) {
        console.error("🤖 AI error:", aiErr.message);
        socket.emit("errorMessage", {
          message: "AI is temporarily unavailable. Try again later.",
        });
        socket.broadcast.to(conversationId).emit("stopTyping", conversationId);
        return;
      }

      /* 6️⃣ Stop Typing Indicator */
      socket.broadcast.to(conversationId).emit("stopTyping", conversationId);

      /* 7️⃣ Save AI message */
      const aiMessage = await Message.create({
        sender: senderId, // keep same user context
        role: "ai",
        content: aiReplyText,
        conversationId,
      });

      const populatedAiMessage = await aiMessage.populate(
        "sender",
        "username avatar"
      );

      /* 8️⃣ Emit AI message */
      io.to(conversationId).emit("receiveMessage", populatedAiMessage);

    } catch (error) {
      console.error("❌ Socket sendMessage error:", error);
      socket.emit("errorMessage", {
        message: "Failed to send message",
      });
    }
  });

  /* 🔹 Typing indicator */
  socket.on("typing", (conversationId) => {
    if (conversationId) {
      socket.to(conversationId).emit("typing");
    }
  });

  socket.on("stopTyping", (conversationId) => {
    if (conversationId) {
      socket.to(conversationId).emit("stopTyping");
    }
  });
};

module.exports = chatSocket;

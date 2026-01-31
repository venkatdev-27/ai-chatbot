const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const { generateAIResponse } = require('../services/aiService');

module.exports = (io, socket) => {

  // 🔹 Join Conversation Room
  socket.on('join', (conversationId) => {
    if (conversationId) {
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    }
  });

  // 🔹 Leave Conversation Room
  socket.on('leave', (conversationId) => {
    if (conversationId) {
      socket.leave(conversationId);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    }
  });

  // 🔹 Handle Send Message
  socket.on('sendMessage', async (data) => {
    const { senderId, content, type, conversationId, mediaUrl } = data;

    if (!conversationId || !content) {
      console.error("Missing conversationId or content in sendMessage");
      return;
    }

    try {
      // 1️⃣ Save USER message
      const userMessage = await Message.create({
        sender: senderId,
        role: 'user',
        content,
        type: type || 'text',
        mediaUrl: mediaUrl || null,
        conversationId
      });

      const populatedUserMessage = await userMessage.populate(
        'sender',
        'username avatar'
      );

      // 2️⃣ Broadcast USER message
      io.to(conversationId).emit('receiveMessage', populatedUserMessage);

      // 3️⃣ Update conversation timestamp
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessageAt: new Date()
      });

      // 4️⃣ Generate AI response
      const aiResponseText = await generateAIResponse({ text: content });

      // 5️⃣ Save AI message (FIXED ROLE)
      const aiMessage = await Message.create({
        sender: senderId,     // OK for now
        role: 'model',        // ✅ FIXED
        content: aiResponseText,
        conversationId
      });

      const populatedAiMessage = await aiMessage.populate(
        'sender',
        'username avatar'
      );

      // 6️⃣ Broadcast AI message
      io.to(conversationId).emit('receiveMessage', populatedAiMessage);

    } catch (error) {
      console.error('Socket Error:', error);

      // ✅ Handle Gemini overload properly
      if (
        error.status === 429 ||
        error.status === 503 ||
        error.message?.includes('overloaded')
      ) {
        socket.emit('errorMessage', {
          message: "AI is busy right now. Please try again in a moment."
        });
      } else {
        socket.emit('errorMessage', {
          message: "Failed to generate AI response."
        });
      }
    }
  });

  // 🔹 Typing Indicators
  socket.on('typing', (conversationId) => {
    socket.to(conversationId).emit('typing');
  });

  socket.on('stopTyping', (conversationId) => {
    socket.to(conversationId).emit('stopTyping');
  });
};

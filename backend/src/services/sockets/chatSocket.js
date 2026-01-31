const Message = require('../models/Message');
const { generateAIResponse } = require('../services/aiService');

const chatSocket = (io, socket) => {
    // Join a chat room (conversation)
    socket.on('join', (conversationId) => {
        socket.join(conversationId); 
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on('leave', (conversationId) => {
        socket.leave(conversationId);
        console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    socket.on('sendMessage', async (data) => {
        const { senderId, content, type, conversationId } = data;

        if (!conversationId) {
            console.error("Missing conversationId in sendMessage");
            return;
        }

        try {
            // 1. Save User Message
            const userMessage = await Message.create({
                sender: senderId,
                content: content || "",
                type: 'text',
                conversationId: conversationId
            });
            
            const populatedUserMessage = await Message.findById(userMessage._id).populate('sender', 'username profilePic');

            // Broadcast to the specific conversation room
            io.to(conversationId).emit('receiveMessage', populatedUserMessage);
            
            // Validate Update Last Message At for Conversation
            const Conversation = require('../models/Conversation');
            await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });

            // 2. Trigger Gemini AI
            const aiReplyText = await generateAIResponse({
                text: content
            });

            // 3. Save AI Message
            const aiMessage = await Message.create({
                sender: senderId, 
                content: aiReplyText,
                type: 'text',
                role: 'ai',
                conversationId: conversationId
            });
             
             const populatedAiMessage = await Message.findById(aiMessage._id).populate('sender', 'username profilePic');

            // Emit AI response to conversation room
            io.to(conversationId).emit('receiveMessage', populatedAiMessage);
            
            // Update lastMessageAt again? Or just once is enough.

        } catch (error) {
            console.error('Socket Error:', error);
            
            // Check for rate limit
            if (error.status === 429 || error.message?.includes('429')) {
                 socket.emit('errorMessage', { message: "AI is busy (Rate Limit). Please wait a moment." });
            } else {
                 socket.emit('errorMessage', { message: "Failed to generate AI response." });
            }
        }
    });

    socket.on('typing', ({ conversationId, userId }) => {
        socket.to(conversationId).emit('typing', userId);
    });

    socket.on('stopTyping', ({ conversationId, userId }) => {
        socket.to(conversationId).emit('stopTyping', userId);
    });
};

module.exports = chatSocket;

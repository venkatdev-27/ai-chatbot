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

        if (!conversationId) {
            console.error("Missing conversationId in sendMessage");
            return;
        }

        try {
            // 1. Save User Message
            const userMessage = await Message.create({
                sender: senderId,
                content,
                type: type || 'text',
                mediaUrl: mediaUrl || null,
                conversationId: conversationId
            });

            const populatedUserMessage = await userMessage.populate('sender', 'username avatar');

            // 2. Broadcast User Message to Room
            io.to(conversationId).emit('receiveMessage', populatedUserMessage);
            
            // 3. Update Conversation Last Message
            await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });

            // 4. Generate AI Response
            // Correctly calling aiService which expects an object { text, filePath, mimeType }
            
            // Construct local file path from mediaUrl if needed (TODO: Implement media handling logic here)
            // For now, passing text content.
            
            const aiResponseText = await generateAIResponse({ text: content });

            // 5. Save AI Message
            const aiMessage = await Message.create({
                sender: senderId, // Or a dedicated AI ID? Usually AI logic handles this. 
                // Wait, Message model 'sender' is a User. 
                // Does the AI have a User ID? Or is 'sender' optional?
                // The schema says sender is Object ID ref User, required.
                // We typically use the user's ID but set role to 'model'.
                // Or we have a predefined AI user.
                // Let's assume we use the user's ID but different role for now, or the Schema allows 'role' usage.
                
                // Correction: The Message model has `role: { type: String, enum: ['user', 'model'], default: 'user' }`
                // So we can use the same `sender` (the user who owns the chat) but `role: 'model'`.
                // This indicates "The AI talking to this user".
                
                sender: senderId, 
                role: 'ai',
                content: aiResponseText,
                conversationId: conversationId
            });

             const populatedAiMessage = await aiMessage.populate('sender', 'username avatar');

            // 6. Broadcast AI Message
            io.to(conversationId).emit('receiveMessage', populatedAiMessage);

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

    // 🔹 Typing Indicators
    socket.on('typing', (conversationId) => {
        socket.to(conversationId).emit('typing');
    });

    socket.on('stopTyping', (conversationId) => {
        socket.to(conversationId).emit('stopTyping');
    });
};

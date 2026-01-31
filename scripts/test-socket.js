import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
const socket = io(SOCKET_URL);

console.log('Testing Socket Connection...');

socket.on('connect', () => {
    console.log('✅ Connected to socket server:', socket.id);
    
    const conversationId = 'test-conversation-id';
    
    // 1. Join Room
    console.log('➡ Joining room:', conversationId);
    socket.emit('join', conversationId);
    
    // 2. Mock Message Send (after short delay to ensure join)
    setTimeout(() => {
        const messageData = {
            senderId: 'test-user-id', 
            content: 'Hello AI, are you working?',
            conversationId: conversationId,
            type: 'text'
        };
        
        console.log('➡ Sending message:', messageData);
        socket.emit('sendMessage', messageData);
    }, 1000);
});

socket.on('receiveMessage', (message) => {
    console.log('📩 Received Message:', message);
    
    // Check if it's an AI response
    // Logic: Checking role or sender. In current backend: role='ai'
    if (message.role === 'ai') {
        console.log('✅ AI Response Received!');
        console.log('🎉 Test Passed!');
        socket.disconnect();
        process.exit(0);
    }
});

socket.on('disconnect', () => {
    console.log('❌ Disconnected');
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection Error:', err.message);
    process.exit(1);
});

// Timeout
setTimeout(() => {
    console.log('⏰ Timeout: AI did not respond in time.');
    // Don't fail immediately, maybe just logic delay?
    // But 10s is long enough.
    process.exit(1);
}, 10000);

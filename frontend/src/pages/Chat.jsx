import { useState, useEffect, useRef, useContext } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import ChatSidebar from "../components/chat/Sidebar";
import chatService from "../services/chatService";
import AuthContext from "../context/AuthContext";
import io from "socket.io-client";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // 🔹 Initialize Socket & Load Conversations
  useEffect(() => {
    if (!token) return;

    const newSocket = io("http://localhost:5000", {
      auth: { token },
    });

    setSocket(newSocket);

    // Load conversations
    loadConversations();

    return () => newSocket.close();
  }, [token]);

  // 🔹 Load Conversations
  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      if (data.length > 0) {
        // Select most recent conversation unless we want to start blank?
        // Let's select the first one by default for now
        setActiveConversationId(data[0]._id);
      } else {
        // No conversations, start fresh state (activeId null)
        setActiveConversationId(null);
      }
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Join Conversation Room & Load Messages
  useEffect(() => {
    if (!socket || !activeConversationId) {
      if (!activeConversationId) setMessages([]); // Clear messages if no chat selected
      return;
    }

    // Join room
    socket.emit("join", activeConversationId);

    // Load messages for this conversation
    const fetchMessages = async () => {
      try {
        const history = await chatService.getMessages(activeConversationId);
        setMessages(history);
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    fetchMessages();

    // Listen for new messages
    const handleReceiveMessage = (newMessage) => {
      // Only append if it belongs to this conversation (double check)
      if (newMessage.conversationId === activeConversationId) {
        setMessages((prev) => [...prev, newMessage]);

        // Also update sidebar sort order?
        // Re-fetch conversations to update order or manually move active to top?
        // Simple approach: reload conversations to update 'lastMessageAt'
        loadConversations();
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Typing indicators could be handled here too (scoped to room)

    return () => {
      socket.emit("leave", activeConversationId);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, activeConversationId]);

  // 🔹 Create New Chat
  const handleNewChat = async () => {
    try {
      const newConv = await chatService.createConversation("New Chat");
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv._id);
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  };

  // 🔹 Delete Conversation
  const handleDeleteConversation = async (id) => {
    try {
      await chatService.deleteConversation(id);
      const updated = conversations.filter(c => c._id !== id);
      setConversations(updated);
      if (activeConversationId === id) {
        setActiveConversationId(updated.length > 0 ? updated[0]._id : null);
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  // 🔹 Send Message
  const handleSendMessage = (text, file) => {
    if (!socket || !activeConversationId) return;

    // Optimistic UI update? Or wait for socket? Socket is fast.
    // We need to upload file first if exists
    // The previous logic for file upload needs to be integrated here or inside sendMessage?
    // chatService.sendMessage logic handles HTTP.
    // socket.emit('sendMessage') handles socket.

    // If file, upload first to get URL
    // We need to implement file upload inside this function before emitting socket event

    // For now, let's assume ChatInput passes file object.
    const send = async () => {
      let mediaUrl = null;
      let type = 'text';

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          // api.post('/upload') - we need to import api or use a service
          // Let's use fetch or axios directly or add uploadService
          // Assuming we can use internal helper or just replicate logic
          // Better: create uploadService or just use fetch here with token
          const token = localStorage.getItem("token"); // direct access or from context
          const res = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }, // Verify header format
            body: formData
          });
          const data = await res.json();
          mediaUrl = data.url;
          type = data.type; // image or video
        } catch (e) {
          console.error("Upload failed", e);
          return;
        }
      }

      socket.emit("sendMessage", {
        senderId: user._id,
        content: text,
        type,
        mediaUrl,
        conversationId: activeConversationId
      });
    };

    send();
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-dark-border flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            ☰
          </button>
          <span className="font-bold text-white">Voo AI</span>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeConversationId ? (
            <ChatWindow messages={messages} currentUser={user} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-text-secondary">
              <p className="text-xl">Select a conversation or start a new one</p>
              <button onClick={handleNewChat} className="mt-4 text-primary hover:underline">
                Start New Chat
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-dark-bg/95 backdrop-blur border-t border-dark-border">
          <ChatInput onSendMessage={handleSendMessage} disabled={!activeConversationId} />
        </div>
      </div>
    </div>
  );
};

export default Chat;

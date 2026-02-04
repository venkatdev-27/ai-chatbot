import { useState, useEffect, useRef, useContext } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import ChatSidebar from "../components/chat/Sidebar";
import chatService from "../services/chatService";
import AuthContext from "../context/AuthContext";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_URL = import.meta.env.VITE_API_URL;

const Chat = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  /* ---------------- SOCKET INIT ---------------- */
  useEffect(() => {
    if (!token || !SOCKET_URL) return;

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      console.log("✅ Socket connected:", s.id);
    });

    s.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    setSocket(s);
    loadConversations();

    return () => {
      s.removeAllListeners();
      s.disconnect();
    };
  }, [token]);

  /* ---------------- LOAD CONVERSATIONS ---------------- */
  const loadConversations = async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      setActiveConversationId(data?.[0]?._id || null);
    } catch (e) {
      console.error("Failed to load conversations", e);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- JOIN ROOM + LOAD MESSAGES ---------------- */
  useEffect(() => {
    if (!socket || !activeConversationId) {
      setMessages([]);
      return;
    }

    socket.emit("join", activeConversationId);

    chatService
      .getMessages(activeConversationId)
      .then(setMessages)
      .catch(console.error);

    const handleReceive = (msg) => {
      if (String(msg.conversationId) === String(activeConversationId)) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceive);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    return () => {
      socket.emit("leave", activeConversationId);
      socket.off("receiveMessage", handleReceive);
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket, activeConversationId]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = async (text, file) => {
    if (!socket || !activeConversationId || !text.trim()) return;

    let mediaUrl = null;
    let type = "text";

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        mediaUrl = data.url;
        type = data.type;
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
      conversationId: activeConversationId,
    });
  };

  /* ---------------- NEW CHAT ---------------- */
  const handleNewChat = async () => {
    try {
      const newConv = await chatService.createConversation("New Chat");
      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv._id);
    } catch (e) {
      console.error("Failed to create chat", e);
    }
  };

  /* ---------------- DELETE CONVERSATION ---------------- */
  const handleDeleteConversation = async (id) => {
    if (!id) return;

    try {
      await chatService.deleteConversation(id);
      const updated = conversations.filter((c) => c._id !== id);
      setConversations(updated);
      setActiveConversationId(updated[0]?._id || null);
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  /* ---------------- TYPING ---------------- */
  const handleTyping = () => {
    socket?.emit("typing", activeConversationId);
  };

  const handleStopTyping = () => {
    socket?.emit("stopTyping", activeConversationId);
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed inset-0 h-[100dvh] bg-dark-bg overflow-hidden overscroll-none flex">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col relative w-full h-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-white/10 flex items-center gap-3 bg-black/50 backdrop-blur-md z-20 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-1 hover:bg-white/10 rounded-md transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="font-bold text-white tracking-wide">Voo AI</span>
        </div>

        <div className="flex-1 overflow-hidden relative flex flex-col">
          {activeConversationId ? (
            <div className="flex-1 overflow-hidden relative">
              <ChatWindow messages={messages} currentUser={user} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-full text-text-secondary overflow-y-auto">
              <p className="text-xl mb-4 text-center px-4">Select a conversation or start a new one</p>
              <button
                onClick={handleNewChat}
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
              >
                Start New Chat
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
          {isTyping && (
            <div className="px-4 py-2 absolute bottom-0 left-0 w-full bg-gradient-to-t from-dark-bg to-transparent z-10">
              <div className="flex items-center gap-2 text-primary text-sm font-medium animate-pulse">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                AI is thinking...
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 z-20 bg-dark-bg p-2 md:p-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={!activeConversationId}
            onTyping={handleTyping}
            onStopTyping={handleStopTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;

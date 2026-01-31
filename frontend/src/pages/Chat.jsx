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
    <div className="flex h-screen bg-dark-bg overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          {activeConversationId ? (
            <ChatWindow messages={messages} currentUser={user} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Start a new chat
            </div>
          )}
          <div ref={messagesEndRef} />
          {isTyping && (
            <div className="px-4 text-sm italic text-gray-400">
              AI is typing…
            </div>
          )}
        </div>

        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={!activeConversationId}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </div>
    </div>
  );
};

export default Chat;

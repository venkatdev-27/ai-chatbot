import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages = [], currentUser }) => {
  const messagesEndRef = useRef(null);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- MESSAGE OWNERSHIP ---------------- */
  const isOwnMessage = (msg) => {
    if (!currentUser?._id) return false;

    // AI messages always on the left
    if (msg.role === "ai") return false;

    const senderId =
      typeof msg.sender === "string"
        ? msg.sender
        : msg.sender?._id;

    return String(senderId) === String(currentUser._id);
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-6 sm:px-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center text-text-secondary opacity-50">
          <div className="text-4xl mb-4">💬</div>
          <p>Start a conversation with Voo AI</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={msg._id || `${msg.role}-${index}`} // ✅ SAFE KEY
            message={msg}
            isOwn={isOwnMessage(msg)}
          />
        ))
      )}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;

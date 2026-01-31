import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages = [], currentUser }) => {
  const messagesEndRef = useRef(null);

  // 🔹 Smooth auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Helper: check message ownership safely
  const isOwnMessage = (msg) => {
    if (!currentUser?._id) return false;
    if (msg.role === "ai") return false; // 🔹 AI messages always on the left

    const senderId =
      typeof msg.sender === "string"
        ? msg.sender
        : msg.sender?._id;

    return senderId === currentUser._id;
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-6 sm:px-6 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col justify-center items-center text-text-secondary opacity-50">
          <div className="text-4xl mb-4">💬</div>
          <p>Start a conversation with Voo AI or your friends!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={isOwnMessage(msg)}
          />
        ))
      )}

      {/* 🔹 Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;

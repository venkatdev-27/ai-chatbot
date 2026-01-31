import { useState } from "react";

const MessageBubble = ({ message, isOwn }) => {
  // ✅ Correct AI detection
  const isAi = message.role === "ai" || message.role === "model";

  // ✅ Safe userna
  const senderName = isAi
    ? "Voo AI"
    : message.sender?.username || "User";

  // ✅ Safe timestamp
  const time = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

  return (
    <div className={`flex w-full mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isOwn ? "items-end" : "items-start"
          }`}
      >
        {/* 🔹 Sender name */}
        {!isOwn && (
          <span className="text-xs text-text-secondary mb-1 ml-1">
            {senderName}
          </span>
        )}

        {/* 🔹 Message bubble */}
        <div
          className={`shadow-sm overflow-hidden ${isOwn
            ? "bg-primary text-white rounded-2xl rounded-tr-none px-4 py-3"
            : isAi
              ? "bg-transparent text-white px-0 py-1" // completely plain
              : "bg-dark-input text-text-primary rounded-2xl rounded-tl-none border border-dark-border px-4 py-3"
            }`}
        >
          {/* 🔹 Text */}
          <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* 🔹 Timestamp */}
        {time && (
          <div className="text-[10px] text-text-secondary mt-1 px-1">
            {time}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

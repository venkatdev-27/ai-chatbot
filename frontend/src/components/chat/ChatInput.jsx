import { useState } from "react";

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    try {
      setSending(true);
      await onSendMessage(trimmedMessage);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      className="relative w-full max-w-4xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center gap-2 bg-dark-input border border-dark-border rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
        <input
          type="text"
          placeholder={disabled ? "Select a chat to start messaging..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          className="flex-1 bg-transparent border-none text-text-primary px-2 py-1 focus:outline-none placeholder-text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <button
          type="submit"
          disabled={disabled || sending || !message.trim()}
          className={`p-2 rounded-lg transition-all ${!(disabled || sending || !message.trim())
            ? "bg-primary text-white hover:bg-primary-hover shadow-md"
            : "bg-dark-border text-text-secondary cursor-not-allowed"
            }`}
        >
          {sending ? "..." : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;

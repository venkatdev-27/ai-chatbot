import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const ChatSidebar = ({
  conversations = [],
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#171717]
          border-r border-dark-border transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-dark-border flex justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Voo AI
            </h2>
            <button
              onClick={onClose}
              className="md:hidden text-text-secondary hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* New Chat */}
          <div className="p-4">
            <button
              onClick={() => {
                onNewChat?.();
                if (window.innerWidth < 768) onClose?.();
              }}
              className="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary-hover"
            >
              New Chat
            </button>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            <div className="px-2 py-2 text-xs text-text-secondary uppercase">
              Recent
            </div>

            {conversations.length === 0 ? (
              <p className="text-center text-text-secondary text-sm py-6">
                No chats yet
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  onClick={() => {
                    onSelectConversation?.(conv._id);
                    if (window.innerWidth < 768) onClose?.();
                  }}
                  className={`relative group p-3 rounded-lg cursor-pointer
                    ${
                      activeId === conv._id
                        ? "bg-dark-hover text-white"
                        : "text-text-secondary hover:bg-dark-input"
                    }
                  `}
                >
                  <p className="truncate text-sm font-medium">
                    {conv.title || "New Chat"}
                  </p>
                  <p className="text-[10px] opacity-60">
                    {conv.lastMessageAt
                      ? new Date(conv.lastMessageAt).toLocaleDateString()
                      : ""}
                  </p>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation?.(conv._id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2
                      text-text-secondary hover:text-danger"
                  >
                    🗑
                  </button>

                  {activeId === conv._id && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* User Footer */}




                    {/* Footer (User Profile) */}
                    <div className="p-4 border-t border-dark-border">
                        <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-dark-input/50">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex-shrink-0 flex items-center justify-center text-xs text-white font-bold">
                                    {user?.username?.[0]?.toUpperCase() || "U"}
                                </div>
                                <div className="text-sm font-medium text-text-primary truncate">
                                    {user?.username || "User"}
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="text-xs bg-dark-hover hover:bg-danger hover:text-white px-3 py-1.5 rounded-md transition-colors text-text-secondary border border-dark-border"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatSidebar;

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const ChatSidebar = ({
    conversations,
    activeId,
    onSelectConversation,
    onNewChat,
    onDeleteConversation,
    isOpen,
    onClose
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
            <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#171717] border-r border-dark-border transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-dark-border flex items-center justify-between">
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

                    {/* New Chat Button */}
                    <div className="p-4">
                        <button
                            onClick={() => {
                                onNewChat();
                                if (window.innerWidth < 768) onClose();
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl transition-all shadow-md group border border-primary/50"
                        >
                            New Chat
                        </button>
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
                        <div className="px-2 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                            Recent
                        </div>

                        {conversations.length === 0 ? (
                            <div className="text-center text-text-secondary text-sm py-8">
                                No history yet
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv._id}
                                    className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${activeId === conv._id
                                        ? "bg-dark-hover text-white shadow-sm border border-dark-border/50"
                                        : "text-text-secondary hover:bg-dark-input hover:text-text-primary"
                                        }`}
                                    onClick={() => {
                                        onSelectConversation(conv._id);
                                        if (window.innerWidth < 768) onClose();
                                    }}
                                >
                                    <span className="text-lg"></span>
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {conv.title || "New Chat"}
                                        </p>
                                        <p className="text-[10px] opacity-60">
                                            {new Date(conv.lastMessageAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteConversation(conv._id);

                                        }}
                                        className="p-1 text-text-secondary hover:text-danger rounded transition-colors"
                                        title="Delete"
                                    >
                                        <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>

                                    {/* Active Indicator */}
                                    {activeId === conv._id && (
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

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

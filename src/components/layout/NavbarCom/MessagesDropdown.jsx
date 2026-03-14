import React from "react";
import { X, MessageSquare, Send } from "lucide-react";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";

const MessagesDropdown = ({ isOpen, messages, onClose, onMarkAllRead, isTyping }) => {
  // Group messages by date
  const getGroupedMessages = () => {
    const groups = {
      Today: [],
      Yesterday: [],
      Older: []
    };

    messages.forEach(msg => {
      const date = msg.timestamp ? new Date(msg.timestamp) : new Date();
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) groups.Today.push(msg);
      else if (date.toDateString() === yesterday.toDateString()) groups.Yesterday.push(msg);
      else groups.Older.push(msg);
    });
    return groups;
  };

  const groupedMessages = getGroupedMessages();

  return (
    <div
      className={`absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50 transition-all duration-300 ease-in-out origin-top-right ${
        isOpen ? "opacity-100 translate-x-0 scale-100 pointer-events-auto" : "opacity-0 translate-x-12 scale-95 pointer-events-none"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" /> Messages
        </h3>
        <div className="flex items-center gap-3">
          <Button 
            variant="link" 
            size="sm" 
            onClick={onMarkAllRead}
            disabled={messages.every(m => !m.unread)}
          >
            Mark all read
          </Button>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <div className="max-h-[400px] overflow-y-auto">
        {messages.length === 0 && !isTyping ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            No new messages
          </div>
        ) : (
          Object.entries(groupedMessages).map(([group, groupMessages]) => (
            groupMessages.length > 0 && (
              <div key={group}>
                <div className="px-4 py-1.5 bg-gray-50/90 dark:bg-gray-800/90 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 sticky top-0 backdrop-blur-sm z-10 border-y border-gray-100 dark:border-gray-800">
                  {group}
                </div>
                {groupMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group ${msg.unread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                  >
                    <div className="flex gap-3">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img 
                          src={msg.avatar} 
                          alt={msg.sender} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                        {msg.unread && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-white dark:border-gray-900 rounded-full"></span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className={`text-sm ${msg.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                            {msg.sender}
                          </h4>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{msg.time}</span>
                        </div>
                        <p className={`text-sm truncate ${msg.unread ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ))
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 transition-colors">
            <div className="flex gap-3 items-center">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1">Someone is typing</span>
                <div className="flex gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 text-center bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800">
        <div className="relative mb-3">
          <InputField 
            placeholder="Quick reply..." 
            className="w-full pl-3 pr-10 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-400"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <button className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">
          View all messages
        </button>
      </div>
    </div>
  );
};

export default MessagesDropdown;
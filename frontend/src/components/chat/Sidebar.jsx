import {
  Plus,
  Search,
  MessageSquare,
  Settings,
  PanelLeftClose,
  Bot,
  MoreHorizontal,
  Trash2,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Sidebar({
  conversations = [],
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  collapsed,
  onToggle,
}) {
  return (
    <aside
      className={`h-screen bg-[#171717] text-white flex flex-col border-r border-white/10 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[280px]"
      }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-white text-black p-2 rounded-lg">
              <Bot size={21} />
            </div>
            <span className="font-semibold text-lg">AI Chat</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white hover:bg-white/10"
          onClick={onToggle}
          title="Toggle sidebar">
          <PanelLeftClose size={19} />
        </Button>
      </div>

      {/* New Chat */}
      <div className="px-3 mt-3">
        <Button
          onClick={onNewChat}
          className={`w-full bg-white text-black hover:bg-gray-200 ${
            collapsed ? "px-0" : "justify-start"
          }`}>
          <Plus size={18} />
          {!collapsed && <span className="ml-2">New Chat</span>}
        </Button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 mt-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 text-gray-400">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search conversations"
              className="bg-transparent outline-none text-sm w-full text-white placeholder:text-gray-500"
            />
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 mt-6">
        {!collapsed && (
          <p className="text-xs font-semibold text-gray-500 px-2 mb-3">
            YOUR CHATS
          </p>
        )}

        <div className="space-y-1">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 rounded-lg px-3 py-3 cursor-pointer transition ${
                activeChatId === chat.id
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => onSelectChat(chat.id)}>
              <MessageSquare size={17} className="shrink-0" />

              {!collapsed && (
                <>
                  <span className="text-sm truncate flex-1">{chat.title}</span>

                  <div className="opacity-0 group-hover:opacity-100 flex">
                    <button
                      title="Rename chat"
                      className="p-1 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRenameChat(chat.id);
                      }}>
                      <Pencil size={14} />
                    </button>

                    <button
                      title="Delete chat"
                      className="p-1 hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {!collapsed && conversations.length === 0 && (
          <p className="text-gray-600 text-xs px-2">
            Your conversations will appear here.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-3">
        <Separator className="bg-white/10 mb-3" />

        <Button
          variant="ghost"
          className={`w-full text-gray-400 hover:text-white hover:bg-white/10 ${
            collapsed ? "px-0" : "justify-start"
          }`}>
          <Settings size={18} />
          {!collapsed && <span className="ml-2">Settings</span>}
        </Button>

        {!collapsed && (
          <div className="flex items-center gap-3 p-2 mt-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">
              S
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">My Account</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
            <MoreHorizontal size={18} className="ml-auto text-gray-500" />
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

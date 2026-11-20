import { useEffect, useState } from "react";

import Sidebar from "./components/chat/Sidebar";
import ChatWindow from "./components/chat/ChatWindow";

const API_URL = "http://localhost:5000/api/chat";

function loadConversations() {
  try {
    const saved = localStorage.getItem("ai-chat-conversations");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function App() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Save conversations in browser storage
  useEffect(() => {
    localStorage.setItem(
      "ai-chat-conversations",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  // Get currently selected conversation
  const activeChat = conversations.find((chat) => chat.id === activeChatId);

  const messages = activeChat?.messages || [];

  // Create a new conversation
  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New chat",
      messages: [],
    };

    setConversations((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  // Send message to backend
  const handleSendMessage = async (content) => {
    if (!content.trim() || loading) return;

    const chatId = activeChatId || Date.now().toString();

    if (!activeChatId) {
      setActiveChatId(chatId);
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    };

    setConversations((prev) => {
      const existingChat = prev.find((chat) => chat.id === chatId);

      if (existingChat) {
        return prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                title:
                  chat.title === "New chat" ? content.slice(0, 35) : chat.title,
                messages: [...chat.messages, userMessage],
              }
            : chat
        );
      }

      return [
        {
          id: chatId,
          title: content.slice(0, 35),
          messages: [userMessage],
        },
        ...prev,
      ];
    });

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response.");
      }

      const assistantMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.reply,
      };

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
              }
            : chat
        )
      );
    } catch (error) {
      const errorMessage = {
        id: `${Date.now()}-error`,
        role: "assistant",
        content: `Sorry, something went wrong: ${error.message}`,
      };

      setConversations((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
              }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete conversation
  const handleDeleteChat = (chatId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    setConversations((prev) => prev.filter((chat) => chat.id !== chatId));

    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  // Rename conversation
  const handleRenameChat = (chatId) => {
    const chat = conversations.find((item) => item.id === chatId);

    if (!chat) return;

    const newTitle = window.prompt(
      "Enter a new conversation name:",
      chat.title
    );

    if (!newTitle?.trim()) return;

    setConversations((prev) =>
      prev.map((item) =>
        item.id === chatId ? { ...item, title: newTitle.trim() } : item
      )
    );
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#212121] text-white">
      {/* Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          conversations={conversations}
          activeChatId={activeChatId}
          onNewChat={handleNewChat}
          onSelectChat={setActiveChatId}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* Main Chat Window */}
      <ChatWindow
        messages={messages}
        loading={loading}
        onSend={handleSendMessage}
      />
    </div>
  );
}

export default App;

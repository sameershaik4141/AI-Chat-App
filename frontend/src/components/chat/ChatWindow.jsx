import { useEffect, useRef } from "react";
import { Bot, Sparkles } from "lucide-react";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";

function ChatWindow({ messages = [], loading, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <main className="flex flex-1 flex-col min-w-0 h-screen bg-[#212121] text-white">
      {/* Header */}
      <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bot size={21} className="text-gray-300" />
          <h2 className="font-semibold text-sm">AI Assistant</h2>
        </div>

        <div className="flex items-center gap-2 text-xs text-green-400">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Online
        </div>
      </header>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4">
          {messages.length === 0 ? (
            <div className="min-h-[65vh] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
                <Sparkles size={32} />
              </div>

              <h1 className="text-3xl font-semibold mb-3">
                How can I help you?
              </h1>

              <p className="text-gray-400 text-sm max-w-md">
                Ask me anything. I can help with programming, learning, problem
                solving and much more.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-3 py-6 max-w-4xl mx-auto">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot size={19} />
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="animate-pulse">Thinking</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:150ms]">
                  .
                </span>
                <span className="animate-bounce [animation-delay:300ms]">
                  .
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Message input */}
      <div className="shrink-0 pt-3">
        <ChatInput onSend={onSend} loading={loading} />
      </div>
    </main>
  );
}

export default ChatWindow;

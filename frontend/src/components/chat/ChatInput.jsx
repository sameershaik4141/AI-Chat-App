import { useState } from "react";
import { Send, Paperclip, Plus, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-3">
      <form
        onSubmit={handleSubmit}
        className="bg-[#303030] border border-white/10 rounded-3xl p-3 shadow-lg">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message your AI assistant..."
          disabled={loading}
          rows={1}
          className="min-h-[45px] max-h-48 resize-none border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Attachments (coming soon)"
              className="rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              disabled>
              <Paperclip size={19} />
            </Button>

            <span className="text-xs text-gray-500">AI Assistant</span>
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || loading}
            className="rounded-full bg-white text-black hover:bg-gray-200 disabled:opacity-30"
            title="Send message">
            {loading ? (
              <span className="animate-pulse">...</span>
            ) : (
              <ArrowUp size={20} />
            )}
          </Button>
        </div>
      </form>

      <p className="text-center text-xs text-gray-500 mt-3">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}

export default ChatInput;

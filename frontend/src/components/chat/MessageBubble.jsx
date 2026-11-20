import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Unable to copy message:", error);
    }
  };

  return (
    <div
      className={`flex gap-4 w-full max-w-4xl mx-auto py-6 ${
        isUser ? "justify-end" : "justify-start"
      }`}>
      {!isUser && (
        <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
          <Bot size={19} />
        </div>
      )}

      <div
        className={`group relative min-w-0 max-w-[85%] ${
          isUser ? "bg-[#303030] rounded-2xl px-5 py-3" : "text-gray-200 flex-1"
        }`}>
        <div className="prose prose-invert max-w-none text-sm leading-7 break-words">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              pre({ children }) {
                return (
                  <pre className="bg-[#111] border border-white/10 rounded-xl p-4 overflow-x-auto my-4">
                    {children}
                  </pre>
                );
              },
              code({ children, className }) {
                const isBlock = className?.startsWith("language-");

                return (
                  <code
                    className={
                      isBlock
                        ? "text-green-300 font-mono text-sm"
                        : "bg-white/10 text-blue-300 px-1.5 py-0.5 rounded font-mono"
                    }>
                    {children}
                  </code>
                );
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline">
                    {children}
                  </a>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-4">
                    <table className="border-collapse border border-white/20 w-full">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="border border-white/20 bg-white/10 px-3 py-2 text-left">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="border border-white/20 px-3 py-2">
                    {children}
                  </td>
                );
              },
            }}>
            {message.content}
          </ReactMarkdown>
        </div>

        {!isUser && (
          <button
            onClick={copyMessage}
            title="Copy response"
            className="mt-3 flex items-center gap-2 text-xs text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition">
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </div>

      {isUser && (
        <div className="w-9 h-9 shrink-0 rounded-full bg-gray-600 flex items-center justify-center text-white">
          <User size={19} />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;

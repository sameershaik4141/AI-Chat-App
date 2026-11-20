
import { useState } from "react";
import { Send, Bot, User, Plus, MessageSquare } from "lucide-react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2>AI Chat</h2>

        <button className="new-chat">
          <Plus size={18} />
          New Chat
        </button>

        <div className="sidebar-history">
          <MessageSquare size={18} />
          <span>Chat History</span>
        </div>

        <p className="sidebar-footer">Powered by FreeLLMAPI</p>
      </aside>

      <main className="chat-container">
        <header className="chat-header">
          <h3>AI Assistant</h3>
          <span className="status">● Online</span>
        </header>

        <section className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <Bot size={48} />
              <h1>How can I help you today?</h1>
              <p>Ask me anything. I'm ready to assist you.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role}`}
              >
                <div className="message-icon">
                  {msg.role === "user" ? (
                    <User size={20} />
                  ) : (
                    <Bot size={20} />
                  )}
                </div>

                <div className="message-content">
                  <strong>
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </strong>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="message assistant">
              <div className="message-icon">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <strong>AI Assistant</strong>
                <p className="typing">Thinking...</p>
              </div>
            </div>
          )}
        </section>

        <form className="input-container" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Message AI Assistant..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
          >
            <Send size={20} />
          </button>
        </form>

        <p className="disclaimer">
          AI can make mistakes. Verify important information.
        </p>
      </main>
    </div>
  );
}

export default App;

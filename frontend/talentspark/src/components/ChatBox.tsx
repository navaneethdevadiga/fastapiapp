import { useState } from "react";
import type { ChatMessage } from "../types/chat";
import { sendChatMessage } from "../Services/ChatService";
import "./ChatBox.css";

function ChatBox() {
    const [sessionId] = useState<string>(() => {
        const existing = localStorage.getItem("chat_session_id");
        if (existing) return existing;
        const generatedId = typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem("chat_session_id", generatedId);
        return generatedId;
    });

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user" as const, text: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        setError(null);

        try {
            const response = await sendChatMessage({ message: userMessage.text, session_id: sessionId });
            setMessages((prev) => [...prev, { role: "bot", text: response.reply }]);
        } catch (err: any) {
            setError(err?.response?.data?.detail || err?.message || "Unable to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-container">
            <h2>Chatbot</h2>
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <p className="chat-empty">Ask a question to start the chat.</p>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.role}`}>
                            <div className="message-role">
                                {message.role === "user" ? "You" : "Bot"}:
                            </div>
                            <div className="message-text">{message.text}</div>
                        </div>
                    ))
                )}
            </div>

            <div className="chat-input-container">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <button onClick={handleSend} disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>

            {error && <div className="chat-error">{error}</div>}
        </div>
    );
}

export default ChatBox;
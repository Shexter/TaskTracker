import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { sendMessage, chatSuggestions } from '../api/chat';
import './Chat.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = { role: 'user', content: messageText };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMessage(messageText);
            setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
        } catch (error: any) {
            setMessages((prev) => [...prev, {
                role: 'assistant',
                content: `Sorry, I couldn't process that request. Error: ${error.message}`,
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chat-page">
            <div className="page-header">
                <h1>AI Assistant</h1>
                <p>Powered by Gemini — helps you plan and optimize your schedule</p>
            </div>

            <div className="chat-container card">
                <div className="chat-messages">
                    {messages.length === 0 && (
                        <div className="chat-welcome">
                            <Sparkles size={32} className="welcome-icon" />
                            <h3>Welcome to TaskTracker AI</h3>
                            <p>Ask me about your schedule, priorities, or how to optimize your time.</p>
                            <div className="chat-suggestions">
                                {chatSuggestions.map((s, i) => (
                                    <button key={i} className="suggestion-chip" onClick={() => handleSend(s)}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-bubble ${msg.role}`}>
                            <div className="bubble-content">{msg.content}</div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chat-bubble assistant">
                            <div className="bubble-content typing">
                                <span /><span /><span />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-bar">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your schedule..."
                        disabled={isLoading}
                    />
                    <button className="btn btn-primary btn-send" onClick={() => handleSend()} disabled={!input.trim() || isLoading}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}

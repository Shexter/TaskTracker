import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { chatSuggestions, getMockChatResponse } from '../data/mockData';
import './Chat.css';

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content:
                "Hello! I'm your **TaskTracker AI Assistant** 🤖. I can help you analyze your schedule, find overdue tasks, or suggest priorities. What would you like to know?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking
        setTimeout(() => {
            const reply = getMockChatResponse(text);
            const assistantMsg: ChatMessage = {
                id: `ai-${Date.now()}`,
                role: 'assistant',
                content: reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            setIsTyping(false);
        }, 800 + Math.random() * 800);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // Simple markdown-like rendering for bold and line breaks
    const renderContent = (content: string) => {
        const parts = content.split(/(\*\*.*?\*\*|\*.*?\*|\n)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={i}>{part.slice(1, -1)}</em>;
            }
            if (part === '\n') {
                return <br key={i} />;
            }
            return <span key={i}>{part}</span>;
        });
    };

    return (
        <div className="chat-page">
            <div className="page-header">
                <h1>AI Chat</h1>
                <p>Ask your task assistant anything about your schedule</p>
            </div>

            <div className="chat-container glass-strong">
                {/* Messages */}
                <div className="chat-messages">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-message ${msg.role} animate-fade-in-up`}
                        >
                            <div className="message-avatar">
                                {msg.role === 'assistant' ? (
                                    <div className="avatar-ai">
                                        <Bot size={18} />
                                    </div>
                                ) : (
                                    <div className="avatar-user">
                                        <User size={18} />
                                    </div>
                                )}
                            </div>
                            <div className="message-content">
                                <div className="message-bubble">
                                    {renderContent(msg.content)}
                                </div>
                                <span className="message-time">
                                    {msg.timestamp.toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="chat-message assistant animate-fade-in">
                            <div className="message-avatar">
                                <div className="avatar-ai">
                                    <Bot size={18} />
                                </div>
                            </div>
                            <div className="message-content">
                                <div className="message-bubble typing-indicator">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Suggestion Chips */}
                <div className="chat-suggestions">
                    {chatSuggestions.map((suggestion, i) => (
                        <button
                            key={i}
                            className="suggestion-chip"
                            onClick={() => sendMessage(suggestion)}
                        >
                            <Sparkles size={12} />
                            {suggestion}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <form className="chat-input-bar" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask about your schedule..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="chat-send-btn btn-primary btn"
                        disabled={!input.trim()}
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}

import { apiPost } from './client';

interface ChatResponse {
    reply: string;
}

export function sendMessage(message: string): Promise<ChatResponse> {
    return apiPost<ChatResponse>('/chat', { message });
}

// These are just UX suggestion chips — no security concern
export const chatSuggestions = [
    'How busy am I this week?',
    'Show my overdue tasks',
    'What should I prioritize today?',
    'Summarize my February schedule',
];

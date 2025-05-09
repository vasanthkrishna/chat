export interface Assistant {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  systemPrompt: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  assistantId?: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  assistants: Assistant[];
  isTyping: boolean;
} 
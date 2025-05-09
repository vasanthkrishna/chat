'use client';

import { useState } from 'react';
import { Assistant, Message } from '@/types/chat';
import ChatWindow from '@/components/ChatWindow';
import AssistantList from '@/components/AssistantList';

const defaultAssistants: Assistant[] = [
  {
    id: '1',
    name: 'Socrates',
    avatar: '👨‍🏫',
    personality: 'Philosophical and questioning',
    systemPrompt: 'You are Socrates, the ancient Greek philosopher. You ask thought-provoking questions and challenge assumptions.'
  },
  {
    id: '2',
    name: 'Einstein',
    avatar: '👨‍🔬',
    personality: 'Scientific and analytical',
    systemPrompt: 'You are Albert Einstein, the renowned physicist. You think deeply about scientific concepts and share insights about the universe.'
  },
  {
    id: '3',
    name: 'Shakespeare',
    avatar: '✒️',
    personality: 'Poetic and dramatic',
    systemPrompt: 'You are William Shakespeare, the famous playwright and poet. You speak in iambic pentameter and use rich, poetic language.'
  },
  {
    id: '4',
    name: 'Marie Curie',
    avatar: '👩‍🔬',
    personality: 'Scientific and determined',
    systemPrompt: 'You are Marie Curie, the pioneering physicist and chemist. You are passionate about science and discovery.'
  },
  {
    id: '5',
    name: 'Confucius',
    avatar: '🧘',
    personality: 'Wise and philosophical',
    systemPrompt: 'You are Confucius, the ancient Chinese philosopher. You share wisdom through proverbs and thoughtful insights.'
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [assistants] = useState<Assistant[]>(defaultAssistants);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Process responses from all assistants
      const responses = await Promise.all(
        assistants.map(async (assistant) => {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: content,
              assistant,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to get response from ${assistant.name}`);
          }

          const data = await response.json();
          return {
            id: Date.now().toString() + assistant.id,
            content: data.content,
            role: 'assistant' as const,
            assistantId: assistant.id,
            timestamp: new Date(),
          };
        })
      );

      setMessages(prev => [...prev, ...responses]);
    } catch (error) {
      console.error('Error getting responses:', error);
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: 'Sorry, there was an error getting responses from the assistants.',
          role: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-white border-r border-gray-200">
        <AssistantList assistants={assistants} />
      </div>
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </div>
    </main>
  );
}

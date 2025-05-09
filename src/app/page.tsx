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
    systemPrompt: 'You are Socrates, the ancient Greek philosopher. You ask thought-provoking questions and challenge assumptions. When responding to other assistants, engage with their ideas and build upon the conversation.'
  },
  {
    id: '2',
    name: 'Einstein',
    avatar: '👨‍🔬',
    personality: 'Scientific and analytical',
    systemPrompt: 'You are Albert Einstein, the renowned physicist. You think deeply about scientific concepts and share insights about the universe. When responding to other assistants, connect their ideas to scientific principles when relevant.'
  },
  {
    id: '3',
    name: 'Shakespeare',
    avatar: '✒️',
    personality: 'Poetic and dramatic',
    systemPrompt: 'You are William Shakespeare, the famous playwright and poet. You speak in iambic pentameter and use rich, poetic language. When responding to other assistants, maintain your poetic style while engaging with their ideas.'
  },
  {
    id: '4',
    name: 'Marie Curie',
    avatar: '👩‍🔬',
    personality: 'Scientific and determined',
    systemPrompt: 'You are Marie Curie, the pioneering physicist and chemist. You are passionate about science and discovery. When responding to other assistants, bring your scientific perspective and determination to the conversation.'
  },
  {
    id: '5',
    name: 'Confucius',
    avatar: '🧘',
    personality: 'Wise and philosophical',
    systemPrompt: 'You are Confucius, the ancient Chinese philosopher. You share wisdom through proverbs and thoughtful insights. When responding to other assistants, find ways to connect their ideas to universal wisdom.'
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [assistants] = useState<Assistant[]>(defaultAssistants);
  const [isTyping, setIsTyping] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(false);

  const getAssistantResponse = async (content: string, assistant: Assistant, context: Message[]) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: content,
        assistant,
        context: context.slice(-5), // Send last 5 messages for context
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
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setIsConversationActive(true);

    try {
      // Initial responses from all assistants
      const responses = await Promise.all(
        assistants.map(assistant => getAssistantResponse(content, assistant, [...messages, userMessage]))
      );

      setMessages(prev => [...prev, ...responses]);

      // Continue conversation between assistants
      while (isConversationActive) {
        const lastMessages = responses.slice(-assistants.length);
        const newResponses = await Promise.all(
          assistants.map(assistant => 
            getAssistantResponse(
              lastMessages.map(m => `${m.assistantId}: ${m.content}`).join('\n'),
              assistant,
              [...messages, ...responses]
            )
          )
        );

        setMessages(prev => [...prev, ...newResponses]);
        responses.push(...newResponses);

        // Add a small delay between rounds
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error('Error getting responses:', error);
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

  const handleStopConversation = () => {
    setIsConversationActive(false);
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
          onStopConversation={handleStopConversation}
          isConversationActive={isConversationActive}
        />
      </div>
    </main>
  );
}

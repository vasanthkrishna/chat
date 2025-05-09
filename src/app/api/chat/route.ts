import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Assistant, Message } from '@/types/chat';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatRequest {
  message: string;
  assistant: Assistant;
  context?: Message[];
}

type ChatCompletionMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export async function POST(req: Request) {
  try {
    const { message, assistant, context = [] }: ChatRequest = await req.json();

    const messages: ChatCompletionMessage[] = [
      {
        role: "system",
        content: assistant.systemPrompt
      },
      ...context.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.role === 'assistant' 
          ? `From ${msg.assistantId}: ${msg.content}`
          : msg.content
      })),
      {
        role: "user",
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      content: completion.choices[0].message.content,
      assistantId: assistant.id,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
} 
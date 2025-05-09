'use client';

import { Assistant } from '@/types/chat';

interface AssistantListProps {
  assistants: Assistant[];
}

export default function AssistantList({ assistants }: AssistantListProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Assistants</h2>
      <div className="space-y-2">
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <div className="text-2xl">{assistant.avatar}</div>
            <div>
              <div className="font-medium">{assistant.name}</div>
              <div className="text-sm text-gray-500">{assistant.personality}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
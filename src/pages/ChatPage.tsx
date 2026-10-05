import React from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { Bot } from 'lucide-react';
import { Language } from '@shared/types';

interface ChatPageProps {
  activeFarmId: string;
  selectedLanguage: Language;
}

export const ChatPage: React.FC<ChatPageProps> = ({ activeFarmId, selectedLanguage }) => {
  return (
    <div className="space-y-6 py-6">
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Conversational AI Agronomist ("Dr. Agro")</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Multi-turn agricultural chat consultant with context retention of your active farm plot, soil NPK values, and recent pathology scans.
        </p>
      </div>

      <ChatInterface farmId={activeFarmId} selectedLanguage={selectedLanguage} />
    </div>
  );
};

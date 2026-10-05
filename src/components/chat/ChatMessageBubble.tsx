import React, { useState } from 'react';
import { Bot, User, Copy, Check, Volume2 } from 'lucide-react';
import { ChatMessage } from '@shared/types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.sender_role === 'model' || message.sender_role === 'system';

  const copyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakContent = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content.replace(/[#*`]/g, ''));
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flex gap-3 my-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center shadow-lg shrink-0">
          <Bot className="w-5 h-5" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
        isBot
          ? 'bg-[#091f16] border border-emerald-900/60 text-slate-100'
          : 'bg-emerald-600 text-white font-medium'
      }`}>
        <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-emerald-900/40 text-[10px] text-slate-400">
          <span className="font-bold text-emerald-400">{isBot ? 'Dr. Agro AI Agronomist' : 'Farmer Query'}</span>
          {isBot && (
            <div className="flex items-center gap-2">
              <button
                onClick={speakContent}
                className="hover:text-emerald-300 text-slate-400 p-1 rounded transition-colors"
                title="Listen to response"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={copyContent}
                className="hover:text-emerald-300 text-slate-400 p-1 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-wrap font-sans">
          {message.content}
        </div>
      </div>

      {!isBot && (
        <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

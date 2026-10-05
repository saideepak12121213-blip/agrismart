import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { ChatMessageBubble } from './ChatMessageBubble';
import { PromptSuggestionChips } from './PromptSuggestionChips';
import { useSendMessage, useChatHistory } from '../../api/hooks';
import { Language, ChatMessage } from '@shared/types';

interface ChatInterfaceProps {
  farmId: string;
  selectedLanguage: Language;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ farmId, selectedLanguage }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useSendMessage();
  const { data: historyData, isLoading: isHistoryLoading } = useChatHistory(activeConversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [historyData?.messages, sendMessageMutation.isPending]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate(
      {
        conversation_id: activeConversationId,
        farm_id: farmId,
        message: text,
        language: selectedLanguage,
      },
      {
        onSuccess: (data) => {
          if (!activeConversationId) {
            setActiveConversationId(data.conversation_id);
          }
          setInputMessage('');
        },
      }
    );
  };

  const messages: ChatMessage[] = historyData?.messages || [
    {
      id: 'welcome-1',
      conversation_id: 'welcome',
      sender_role: 'model',
      content: `Hello! I am **Dr. Agro**, your senior agronomic consultant. I have loaded your farm profile and soil chemistry background. How can I assist you with your crops today?`,
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="glass-panel rounded-2xl border border-emerald-900/40 flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-emerald-900/60 bg-[#071a12] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center shadow-lg">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Dr. Agro — Conversational AI Agronomist</h3>
            <p className="text-[11px] text-emerald-400 font-medium">Context-Aware • Multilingual Support ({selectedLanguage.toUpperCase()})</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#05130d] space-y-2">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} message={msg} />
        ))}

        {sendMessageMutation.isPending && (
          <div className="flex items-center gap-3 my-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-[#091f16] border border-emerald-900/60 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Dr. Agro is evaluating soil chemistry and plant pathology data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-4 py-1.5 bg-[#071a12] border-t border-emerald-900/40">
        <PromptSuggestionChips onSelectPrompt={(p) => handleSend(p)} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-[#071a12] border-t border-emerald-900/60 flex items-center gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Dr. Agro about leaf diseases, fertilizer dosage, irrigation, or soil pH..."
          className="flex-1 bg-[#05130d] border border-emerald-800/60 rounded-xl px-4 py-3 text-xs text-emerald-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputMessage.trim() || sendMessageMutation.isPending}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/40 transition-colors flex items-center gap-2"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

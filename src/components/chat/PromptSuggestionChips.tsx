import React from 'react';
import { Sparkles } from 'lucide-react';

interface PromptSuggestionChipsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const PromptSuggestionChips: React.FC<PromptSuggestionChipsProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    'How do I treat yellow leaves on tomatoes?',
    'When should I apply urea top-dressing?',
    'What is the optimal soil pH for wheat?',
    'How to prevent root rot in wet soil?',
    'Organic treatments for fungal blight',
    'Calculate fertilizer split for paddy',
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
      <span className="text-[11px] font-semibold text-emerald-400 shrink-0 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5" /> Quick Prompts:
      </span>
      {suggestions.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPrompt(prompt)}
          className="bg-[#081d14] hover:bg-emerald-900/40 border border-emerald-800/40 hover:border-emerald-500/40 text-emerald-200 text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors shrink-0 font-medium"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};

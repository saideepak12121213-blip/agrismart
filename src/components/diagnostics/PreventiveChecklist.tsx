import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square } from 'lucide-react';

interface PreventiveChecklistProps {
  measures: string[];
}

export const PreventiveChecklist: React.FC<PreventiveChecklistProps> = ({ measures = [] }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <h4 className="text-base font-bold text-white">Preventive Cultural Measures</h4>
      </div>
      <p className="text-xs text-slate-400 mb-4">
        Field sanitation and cultural practices to prevent re-infection and build long-term disease resistance:
      </p>

      <div className="space-y-2.5">
        {measures.map((measure, idx) => {
          const isDone = checkedItems[idx] || false;
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(idx)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                isDone
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 line-through opacity-80'
                  : 'bg-[#091b13] border-emerald-900/40 text-slate-200 hover:border-emerald-500/40'
              }`}
            >
              {isDone ? (
                <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-5 h-5 text-slate-500 shrink-0" />
              )}
              <span className="text-xs font-medium leading-relaxed">{measure}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

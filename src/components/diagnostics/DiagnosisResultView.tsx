import React from 'react';
import { DiseaseDiagnostic } from '@shared/types';
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Activity } from 'lucide-react';

interface DiagnosisResultViewProps {
  diagnostic: DiseaseDiagnostic;
}

export const DiagnosisResultView: React.FC<DiagnosisResultViewProps> = ({ diagnostic }) => {
  const getSeverityBadge = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'High':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'Low':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-500/30">
      {/* Header Diagnostic Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-900/60">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Gemini Vision AI Triage</span>
            <span className="text-xs text-slate-400">• Specimen: {diagnostic.crop_name}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">{diagnostic.diagnosis_name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              Pathogen: {diagnostic.pathogen_type}
            </span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getSeverityBadge(diagnostic.severity_level)}`}>
              Severity: {diagnostic.severity_level}
            </span>
          </div>
        </div>

        {/* Confidence Gauge Bar */}
        <div className="bg-[#091b13] p-4 rounded-xl border border-emerald-900/60 min-w-[200px]">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Diagnostic Confidence</span>
            <span className="font-extrabold text-emerald-400">{diagnostic.confidence_score}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
              style={{ width: `${diagnostic.confidence_score}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Symptoms Detected Breakdown */}
      <div className="mt-6">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-emerald-400" /> Key Foliar Symptoms Detected
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {diagnostic.symptoms_detected?.map((symptom, idx) => (
            <div key={idx} className="bg-[#081b13] border border-emerald-900/40 rounded-xl p-3 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-xs text-slate-200 font-medium leading-relaxed">{symptom}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

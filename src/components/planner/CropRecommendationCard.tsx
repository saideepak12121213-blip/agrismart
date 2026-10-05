import React, { useState } from 'react';
import { RecommendedCrop } from '@shared/types';
import { Compass, Clock, Droplets, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface CropRecommendationCardProps {
  crop: RecommendedCrop;
  rank: number;
}

export const CropRecommendationCard: React.FC<CropRecommendationCardProps> = ({ crop, rank }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-900/50 hover:border-emerald-500/40 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 text-white font-extrabold text-lg flex items-center justify-center shadow-lg">
            #{rank}
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">{crop.crop_name}</h3>
            <p className="text-xs text-emerald-400">
              Varieties: {crop.variety_suggestions?.join(', ') || 'Standard Certified Varieties'}
            </p>
          </div>
        </div>

        {/* Suitability Score Pill */}
        <div className="bg-[#091b13] px-4 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Suitability Score</div>
            <div className="text-lg font-extrabold text-emerald-400">{crop.suitability_score}%</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-300 my-4 leading-relaxed bg-[#081d14] p-3 rounded-xl border border-emerald-900/40">
        <span className="font-semibold text-emerald-300">Agronomic Rationale: </span>
        {crop.suitability_rationale}
      </p>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="bg-[#06160f] p-3 rounded-xl border border-emerald-900/40">
          <span className="text-slate-400 flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> Maturity
          </span>
          <span className="text-white font-bold text-sm">{crop.expected_duration_days} Days</span>
        </div>

        <div className="bg-[#06160f] p-3 rounded-xl border border-emerald-900/40">
          <span className="text-slate-400 flex items-center gap-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" /> Expected Yield
          </span>
          <span className="text-white font-bold text-sm">{crop.expected_yield_per_ha}</span>
        </div>

        <div className="bg-[#06160f] p-3 rounded-xl border border-emerald-900/40">
          <span className="text-slate-400 flex items-center gap-1 mb-1">
            <Droplets className="w-3.5 h-3.5 text-sky-400" /> Water Budget
          </span>
          <span className="text-white font-bold text-sm">{crop.water_requirement_mm} mm</span>
        </div>
      </div>

      {/* Key Risk Warnings */}
      {crop.key_risks && crop.key_risks.length > 0 && (
        <div className="mb-4">
          <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Economic & Biological Risk Factors
          </h5>
          <div className="flex flex-wrap gap-2">
            {crop.key_risks.map((risk, idx) => (
              <span key={idx} className="bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs px-2.5 py-1 rounded-lg">
                • {risk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Growth Stages Accordion */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-emerald-900/60"
      >
        <span>{expanded ? 'Hide Growth Milestones' : 'View Growth Stage Schedule & Key Actions'}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {expanded && crop.growth_stages && (
        <div className="mt-4 space-y-2.5">
          {crop.growth_stages.map((stage, idx) => (
            <div key={idx} className="bg-[#071a12] p-3 rounded-xl border border-emerald-900/40 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-xs">{stage.stage_name}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-800">
                    {stage.day_range}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{stage.key_action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

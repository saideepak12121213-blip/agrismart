import React, { useState } from 'react';
import { useRecommendCrops } from '../api/hooks';
import { CropRecommendationCard } from '../components/planner/CropRecommendationCard';
import { Compass, Sparkles, Loader2 } from 'lucide-react';

interface CropPlannerPageProps {
  activeFarmId: string;
}

export const CropPlannerPage: React.FC<CropPlannerPageProps> = ({ activeFarmId }) => {
  const [season, setSeason] = useState<'Kharif (Monsoon)' | 'Rabi (Winter)' | 'Zaid (Summer)' | 'Perennial'>('Rabi (Winter)');
  const [budget, setBudget] = useState('Standard Medium Budget');
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const recommendMutation = useRecommendCrops();

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    recommendMutation.mutate(
      {
        farm_id: activeFarmId,
        season,
        budget_constraint: budget,
      },
      {
        onSuccess: (data) => {
          setRecommendations(data.recommendations || []);
        },
      }
    );
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Seasonal Crop Rotation Advisor</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Evaluates soil chemistry (NPK, pH, EC), climate season, and water budget to output ranked crop suitability indices and growth stage schedules.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGeneratePlan} className="glass-panel rounded-2xl p-6 border border-emerald-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Cultivation Season</label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value as any)}
            className="w-full bg-[#081d14] border border-emerald-800 rounded-xl px-4 py-2.5 text-xs text-emerald-200"
          >
            <option value="Kharif (Monsoon)">Kharif (Monsoon / Rainfed)</option>
            <option value="Rabi (Winter)">Rabi (Winter / Irrigated)</option>
            <option value="Zaid (Summer)">Zaid (Summer / Short Duration)</option>
            <option value="Perennial">Perennial / Long-term Orchard</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">Economic Budget Level</label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. Medium Budget ($500/ha)"
            className="w-full bg-[#081d14] border border-emerald-800 rounded-xl px-4 py-2.5 text-xs text-emerald-200"
          />
        </div>

        <button
          type="submit"
          disabled={recommendMutation.isPending}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/40 transition-colors flex items-center justify-center gap-2"
        >
          {recommendMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Soil & Climate...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Rotation Plan</span>
            </>
          )}
        </button>
      </form>

      {/* Recommended Crops Cards */}
      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((crop, idx) => (
            <CropRecommendationCard key={idx} crop={crop} rank={idx + 1} />
          ))
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center border border-dashed border-emerald-900/60">
            <Compass className="w-12 h-12 text-emerald-500/30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Click "Generate Rotation Plan"</h3>
            <p className="text-xs text-slate-400">
              Dr. Agro will cross-reference active farm soil tests and seasonal micro-climate to rank top suitable crops.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

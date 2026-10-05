import React, { useState } from 'react';
import { useCalculateFertilizer, useFarm } from '../api/hooks';
import { FertilizerDoseTable } from '../components/fertilizer/FertilizerDoseTable';
import { SoilRadarChart } from '../components/planner/SoilRadarChart';
import { FlaskConical, Calculator, Loader2 } from 'lucide-react';

interface FertilizerPageProps {
  activeFarmId: string;
}

export const FertilizerPage: React.FC<FertilizerPageProps> = ({ activeFarmId }) => {
  const { data: farm } = useFarm(activeFarmId);
  const calculateMutation = useCalculateFertilizer();

  const [cropName, setCropName] = useState('Tomato');
  const [area, setArea] = useState(farm?.total_area_hectares || 4.5);
  const [targetN, setTargetN] = useState(250);
  const [targetP, setTargetP] = useState(80);
  const [targetK, setTargetK] = useState(240);
  const [result, setResult] = useState<any | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculateMutation.mutate(
      {
        farm_id: activeFarmId,
        crop_name: cropName,
        area_hectares: Number(area),
        target_n: Number(targetN),
        target_p: Number(targetP),
        target_k: Number(targetK),
      },
      {
        onSuccess: (data) => {
          setResult(data);
        },
      }
    );
  };

  return (
    <div className="space-y-8 py-6">
      <div>
        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Precision NPK Fertilizer Calculator</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Calculates commercial fertilizer requirement in Urea (46-0-0), DAP (18-46-0), and MOP (0-0-60) metric bags. Satisfies Phosphorus deficit first to eliminate over-application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleCalculate} className="glass-panel rounded-2xl p-6 border border-emerald-900/40 space-y-4">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" /> Target Agronomic Thresholds
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Crop</label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full bg-[#081d14] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Farm Area (Hectares)</label>
              <input
                type="number"
                step="0.1"
                required
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full bg-[#081d14] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-200"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Target N (kg/ha)</label>
                <input
                  type="number"
                  required
                  value={targetN}
                  onChange={(e) => setTargetN(Number(e.target.value))}
                  className="w-full bg-[#081d14] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-200 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-amber-400 mb-1">Target P (kg/ha)</label>
                <input
                  type="number"
                  required
                  value={targetP}
                  onChange={(e) => setTargetP(Number(e.target.value))}
                  className="w-full bg-[#081d14] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-200 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-teal-400 mb-1">Target K (kg/ha)</label>
                <input
                  type="number"
                  required
                  value={targetK}
                  onChange={(e) => setTargetK(Number(e.target.value))}
                  className="w-full bg-[#081d14] border border-emerald-800 rounded-xl px-3 py-2 text-xs text-emerald-200 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={calculateMutation.isPending}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/40 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {calculateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Stoichiometry...</span>
                </>
              ) : (
                <span>Calculate Urea, DAP & MOP Prescriptions</span>
              )}
            </button>
          </form>

          <SoilRadarChart soilTest={farm?.latest_soil_test} />
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {result ? (
            <FertilizerDoseTable prescription={result} />
          ) : (
            <div className="glass-panel rounded-2xl p-12 text-center border border-dashed border-emerald-900/60 h-full flex flex-col items-center justify-center">
              <FlaskConical className="w-14 h-14 text-emerald-500/30 mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Commercial Fertilizer Recipe</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Enter your target N-P-K recommendation and click calculate to view exact commercial bag counts and application timetables.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

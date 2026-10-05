import React, { useState } from 'react';
import { useIrrigationSchedule, useFarm } from '../api/hooks';
import { IrrigationTimeline } from '../components/irrigation/IrrigationTimeline';
import { Droplets, Calendar, ShieldAlert, Loader2 } from 'lucide-react';

interface IrrigationPageProps {
  activeFarmId: string;
}

export const IrrigationPage: React.FC<IrrigationPageProps> = ({ activeFarmId }) => {
  const [cropName, setCropName] = useState('Tomato');
  const { data: farm } = useFarm(activeFarmId);
  const { data: schedule, isLoading } = useIrrigationSchedule(activeFarmId, cropName);

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Weather-Adaptive Irrigation & Spray Planner</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            7-day reference evapotranspiration (ET₀) water requirements with chemical spray feasibility alerts (preventing spraying during high winds &gt;15km/h or rain).
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#081d14] border border-emerald-800 rounded-xl px-3 py-1.5 text-xs text-emerald-200">
          <span className="text-slate-400">Crop:</span>
          <select
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            className="bg-transparent font-bold text-emerald-300 focus:outline-none cursor-pointer"
          >
            <option value="Tomato" className="bg-[#0b1d15]">Tomato</option>
            <option value="Wheat" className="bg-[#0b1d15]">Wheat</option>
            <option value="Rice (Paddy)" className="bg-[#0b1d15]">Rice (Paddy)</option>
            <option value="Cotton" className="bg-[#0b1d15]">Cotton</option>
            <option value="Onion" className="bg-[#0b1d15]">Onion</option>
          </select>
        </div>
      </div>

      {isLoading || !schedule ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-300">Fetching 7-Day Meteorological Telemetry & ET₀...</p>
        </div>
      ) : (
        <IrrigationTimeline days={schedule.days} weeklyTotalWaterMm={schedule.weekly_water_total_mm} />
      )}
    </div>
  );
};

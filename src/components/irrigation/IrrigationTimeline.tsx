import React from 'react';
import { DailyIrrigationDay, SprayFeasibility } from '@shared/types';
import { Calendar, Droplets, Wind, Thermometer, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface IrrigationTimelineProps {
  days: DailyIrrigationDay[];
  weeklyTotalWaterMm: number;
}

export const IrrigationTimeline: React.FC<IrrigationTimelineProps> = ({ days = [], weeklyTotalWaterMm }) => {
  const getSprayFeasibilityChip = (status: SprayFeasibility) => {
    switch (status) {
      case 'OPTIMAL':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: CheckCircle2,
          label: 'OPTIMAL',
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: AlertTriangle,
          label: 'CAUTION',
        };
      case 'PROHIBITED':
      default:
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: XCircle,
          label: 'PROHIBITED',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {days.map((day, idx) => {
          const chip = getSprayFeasibilityChip(day.spray_feasibility);
          const Icon = chip.icon;
          return (
            <div
              key={idx}
              className={`glass-panel rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                idx === 0 ? 'border-emerald-500/50 bg-[#0c251b]' : 'border-emerald-900/40 bg-[#091d15]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-extrabold text-white">
                    {idx === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{day.date.substring(5)}</span>
                </div>

                {/* Weather Pill */}
                <div className="bg-[#06160f] p-2 rounded-xl border border-emerald-900/40 mb-3 text-[11px]">
                  <p className="font-bold text-slate-200 truncate">{day.weather_condition}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-0.5"><Thermometer className="w-3 h-3 text-amber-400" />{day.temp_c}°C</span>
                    <span className="flex items-center gap-0.5"><Wind className="w-3 h-3 text-emerald-400" />{day.wind_speed_kmh}k</span>
                  </div>
                </div>

                {/* Irrigation Water Needed */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Water Req:</span>
                    <span className="font-extrabold text-sky-400">{day.irrigation_amount_mm} mm</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Drip Run:</span>
                    <span className="font-bold text-emerald-300 font-mono flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> {day.duration_minutes}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Spray Feasibility Status Chip */}
              <div className={`mt-2 pt-2 border-t border-emerald-950 flex items-center justify-between px-2 py-1 rounded-lg border ${chip.bg}`}>
                <span className="text-[9px] font-extrabold tracking-wider uppercase">Spray</span>
                <div className="flex items-center gap-1">
                  <Icon className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{chip.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Day-by-day Advisory Cards */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40">
        <h4 className="text-base font-bold text-white mb-4">Detailed Daily Agricultural Telemetry</h4>
        <div className="space-y-3">
          {days.map((day, idx) => {
            const chip = getSprayFeasibilityChip(day.spray_feasibility);
            const Icon = chip.icon;
            return (
              <div key={idx} className="bg-[#091c13] border border-emerald-900/50 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 font-bold flex flex-col items-center justify-center border border-emerald-800 shrink-0">
                    <span className="text-[10px] uppercase text-slate-400">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-sm text-white">{day.date.substring(8)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{day.weather_condition} ({day.temp_c}°C)</span>
                      <span className="text-slate-400">Rain Prob: {day.rain_probability_pct}%</span>
                    </div>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">{day.spray_notes}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-slate-400 font-medium">{day.irrigation_amount_mm} mm ({day.duration_minutes} min run)</div>
                    <div className="text-[10px] text-slate-500">ET₀: {day.et0_mm} mm/day</div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold ${chip.bg}`}>
                    <Icon className="w-4 h-4" />
                    <span>{chip.label}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

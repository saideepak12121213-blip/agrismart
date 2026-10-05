import React from 'react';
import { Sun, Wind, Droplets, Thermometer, ShieldAlert, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { useIrrigationSchedule } from '../../api/hooks';

interface WeatherWidgetProps {
  farmId: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ farmId }) => {
  const { data: schedule, isLoading } = useIrrigationSchedule(farmId, 'Tomato');

  if (isLoading || !schedule || !schedule.days || schedule.days.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 animate-pulse">
        <div className="h-6 bg-emerald-900/40 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-emerald-900/30 rounded"></div>
      </div>
    );
  }

  const today = schedule.days[0];

  const getSprayFeasibilityBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return {
          bg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
          icon: CheckCircle2,
          label: 'SPRAYING OPTIMAL',
          color: 'text-emerald-400',
        };
      case 'CAUTION':
        return {
          bg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
          icon: AlertTriangle,
          label: 'SPRAY WITH CAUTION',
          color: 'text-amber-400',
        };
      case 'PROHIBITED':
      default:
        return {
          bg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
          icon: XCircle,
          label: 'SPRAYING PROHIBITED',
          color: 'text-rose-400',
        };
    }
  };

  const badge = getSprayFeasibilityBadge(today.spray_feasibility);
  const StatusIcon = badge.icon;

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Live Telemetry & Evapotranspiration (ET₀)
            </span>
            <span className="text-slate-400 text-xs">{schedule.location_name || 'Farm Zone'}</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Weather & Spray Feasibility</h2>
        </div>

        {/* Spray Feasibility Status Banner */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${badge.bg}`}>
          <StatusIcon className={`w-5 h-5 ${badge.color}`} />
          <div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Chemical Spray Window</div>
            <div className={`text-xs font-bold ${badge.color}`}>{badge.label}</div>
          </div>
        </div>
      </div>

      {/* Weather Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#091a13]/80 border border-emerald-900/40 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Temperature</p>
            <p className="text-lg font-bold text-white">{today.temp_c}°C</p>
          </div>
        </div>

        <div className="bg-[#091a13]/80 border border-emerald-900/40 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Humidity</p>
            <p className="text-lg font-bold text-white">{today.humidity_pct}%</p>
          </div>
        </div>

        <div className="bg-[#091a13]/80 border border-emerald-900/40 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Wind Speed</p>
            <p className="text-lg font-bold text-white">{today.wind_speed_kmh} <span className="text-xs font-normal">km/h</span></p>
          </div>
        </div>

        <div className="bg-[#091a13]/80 border border-emerald-900/40 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Reference ET₀</p>
            <p className="text-lg font-bold text-white">{today.et0_mm} <span className="text-xs font-normal">mm/day</span></p>
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="bg-[#081d14] border border-emerald-900/60 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-emerald-300">Agronomic Advisory: </span>
          {today.spray_notes}
        </p>
      </div>
    </div>
  );
};

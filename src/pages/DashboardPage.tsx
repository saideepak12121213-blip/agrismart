import React from 'react';
import { useFarms } from '../api/hooks';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { FarmHealthSummary } from '../components/dashboard/FarmHealthSummary';
import { RecentScansCarousel } from '../components/dashboard/RecentScansCarousel';
import { QuickActionGrid } from '../components/dashboard/QuickActionGrid';
import { LayoutDashboard, MapPin } from 'lucide-react';

interface DashboardPageProps {
  activeFarmId: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ activeFarmId }) => {
  const { data: farms = [] } = useFarms();
  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0];

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Farmer Command Center</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time farm health telemetry, visual pathology alerts, and climate advisory.
          </p>
        </div>

        {activeFarm && (
          <div className="bg-[#091f16] border border-emerald-800/60 rounded-xl px-4 py-2 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-200">{activeFarm.farm_name}</p>
              <p className="text-[10px] text-slate-400">{activeFarm.location_name} • {activeFarm.total_area_hectares} ha</p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <QuickActionGrid />

      {/* Farm Health Summary */}
      <FarmHealthSummary farm={activeFarm} totalFarmsCount={farms.length} />

      {/* Weather & Spray Feasibility Widget */}
      {activeFarm && <WeatherWidget farmId={activeFarm.id} />}

      {/* Recent Scans Carousel */}
      {activeFarm && <RecentScansCarousel farmId={activeFarm.id} />}
    </div>
  );
};

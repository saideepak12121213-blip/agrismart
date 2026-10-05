import React from 'react';
import { Farm } from '@shared/types';
import { Sprout, AlertTriangle, ShieldCheck, Activity, TestTube } from 'lucide-react';

interface FarmHealthSummaryProps {
  farm?: Farm;
  totalFarmsCount: number;
}

export const FarmHealthSummary: React.FC<FarmHealthSummaryProps> = ({ farm, totalFarmsCount }) => {
  if (!farm) {
    return null;
  }

  const soil = farm.latest_soil_test;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Hectares Card */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-emerald-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Acreage</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Sprout className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-white">
          {farm.total_area_hectares} <span className="text-sm font-normal text-emerald-400">Hectares</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {farm.soil_type} Soil • {farm.irrigation_source}
        </p>
      </div>

      {/* Soil pH & EC Status */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-emerald-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soil pH & EC</span>
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <TestTube className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-white">
          pH {soil?.ph_level || 6.8} <span className="text-xs font-normal text-teal-400">({soil?.ec_ds_m || 0.8} dS/m)</span>
        </div>
        <p className="text-[11px] text-emerald-400 mt-1 font-medium">
          {soil?.ph_level && soil.ph_level >= 6.0 && soil.ph_level <= 7.5 ? 'Optimal Nutrient Availability' : 'Soil Buffer Adjustment Needed'}
        </p>
      </div>

      {/* NPK Chemistry Index */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-emerald-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Soil Chemistry (NPK)</span>
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="text-lg font-bold text-white flex items-center gap-2">
          <span>N: {soil?.nitrogen_kg_ha || 180}</span>
          <span className="text-slate-500">|</span>
          <span>P: {soil?.phosphorus_kg_ha || 35}</span>
          <span className="text-slate-500">|</span>
          <span>K: {soil?.potassium_kg_ha || 220}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">Measured in kg/ha baseline</p>
      </div>

      {/* Disease Diagnostics Alerts */}
      <div className="glass-panel glass-panel-hover rounded-2xl p-5 border border-emerald-900/40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unresolved Alerts</span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-white flex items-center gap-2">
          {farm.recent_diagnostics_count || 0}
          <span className="text-xs font-normal text-slate-400">Active Crop Scans</span>
        </div>
        <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" /> Organic & Chemical Treatments Available
        </p>
      </div>
    </div>
  );
};

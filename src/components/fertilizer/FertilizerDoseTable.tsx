import React from 'react';
import { FertilizerPrescription, FertilizerSplit } from '@shared/types';
import { Package, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface FertilizerDoseTableProps {
  prescription: FertilizerPrescription;
}

export const FertilizerDoseTable: React.FC<FertilizerDoseTableProps> = ({ prescription }) => {
  return (
    <div className="space-y-6">
      {/* Commercial Fertilizer Bags Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* DAP Card */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-900/50 bg-gradient-to-br from-[#0b2419] to-[#071710]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">DAP (18-46-0)</span>
            <Package className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {prescription.dap_bags_50kg} <span className="text-sm font-normal text-slate-400">Bags (50kg)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {prescription.dap_kg_required} Total Metric kg
          </p>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">Satisfies Phosphorus Deficit</p>
        </div>

        {/* Urea Card */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-900/50 bg-gradient-to-br from-[#0b2419] to-[#071710]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Urea (46-0-0)</span>
            <Package className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {prescription.urea_bags_50kg} <span className="text-sm font-normal text-slate-400">Bags (50kg)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {prescription.urea_kg_required} Total Metric kg
          </p>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">Satisfies Remaining Nitrogen</p>
        </div>

        {/* MOP Card */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-900/50 bg-gradient-to-br from-[#0b2419] to-[#071710]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">MOP (0-0-60)</span>
            <Package className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {prescription.mop_bags_50kg} <span className="text-sm font-normal text-slate-400">Bags (50kg)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {prescription.mop_kg_required} Total Metric kg
          </p>
          <p className="text-[11px] text-emerald-400 mt-2 font-medium">Satisfies Potassium Deficit</p>
        </div>
      </div>

      {/* Split Application Timetable Table */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40">
        <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          Split Application Timetable (Basal vs Top-Dressing)
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Splitting nutrient applications prevents nitrogen leaching, ammonia volatilization, and root scorch.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-emerald-900/60 bg-[#071b12] text-slate-300">
                <th className="p-3 font-semibold">Growth Stage</th>
                <th className="p-3 font-semibold">Application Window</th>
                <th className="p-3 font-semibold text-right">DAP (kg)</th>
                <th className="p-3 font-semibold text-right">Urea (kg)</th>
                <th className="p-3 font-semibold text-right">MOP (kg)</th>
                <th className="p-3 font-semibold">Agronomic Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950 text-slate-200">
              {prescription.application_splits?.map((split: FertilizerSplit, idx: number) => (
                <tr key={idx} className="hover:bg-[#082016]/50 transition-colors">
                  <td className="p-3 font-bold text-emerald-300">{split.stage}</td>
                  <td className="p-3 text-slate-400 font-mono">{split.timing}</td>
                  <td className="p-3 text-right font-mono font-bold text-amber-300">
                    {split.dap_kg > 0 ? `${split.dap_kg} kg` : '-'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-300">
                    {split.urea_kg > 0 ? `${split.urea_kg} kg` : '-'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-teal-300">
                    {split.mop_kg > 0 ? `${split.mop_kg} kg` : '-'}
                  </td>
                  <td className="p-3 text-slate-300 leading-relaxed text-[11px]">{split.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {prescription.agronomy_advice && (
          <div className="mt-6 p-4 bg-[#081f15] border border-emerald-900/60 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-emerald-300">Senior Agronomist Advice: </span>
              {prescription.agronomy_advice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { OrganicTreatment, ChemicalTreatment } from '@shared/types';
import { Leaf, ShieldAlert, TestTube, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TreatmentTabsProps {
  organicTreatments: OrganicTreatment[];
  chemicalTreatments: ChemicalTreatment[];
}

export const TreatmentTabs: React.FC<TreatmentTabsProps> = ({
  organicTreatments = [],
  chemicalTreatments = [],
}) => {
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical'>('organic');

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40">
      {/* Tab Selector Buttons */}
      <div className="flex border-b border-emerald-900/60 mb-6">
        <button
          onClick={() => setActiveTab('organic')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'organic'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Leaf className="w-4 h-4 text-emerald-400" />
          Organic & Biological Remedies ({organicTreatments.length})
        </button>

        <button
          onClick={() => setActiveTab('chemical')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'chemical'
              ? 'border-amber-400 text-amber-400 bg-amber-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TestTube className="w-4 h-4 text-amber-400" />
          Synthetic Chemical Protocols ({chemicalTreatments.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'organic' ? (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Eco-friendly, non-toxic biocontrol solutions safe for organic certified plots and beneficial pollinators.</span>
          </div>

          {organicTreatments.map((item, idx) => (
            <div key={idx} className="bg-[#091b13] border border-emerald-900/60 rounded-xl p-4">
              <h5 className="font-bold text-white text-base mb-1.5 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                {item.treatment_name}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                <div className="bg-[#06140e] p-2.5 rounded-lg border border-emerald-900/40">
                  <span className="text-slate-400 font-medium block">Dosage & Application:</span>
                  <span className="text-emerald-300 font-bold">{item.dosage_and_application}</span>
                </div>
                <div className="bg-[#06140e] p-2.5 rounded-lg border border-emerald-900/40">
                  <span className="text-slate-400 font-medium block">Frequency:</span>
                  <span className="text-slate-200 font-semibold">{item.frequency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-center gap-2 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Strict PPE Required: Wear gloves, eye protection, and N95 respirator. Adhere strictly to Pre-Harvest Intervals (PHI).</span>
          </div>

          {chemicalTreatments.map((chem, idx) => (
            <div key={idx} className="bg-[#14150c] border border-amber-900/40 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h5 className="font-bold text-white text-base flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {chem.active_ingredient}
                </h5>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-950 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-800 font-semibold">
                    Example: {chem.commercial_example || 'Commercial Formulation'}
                  </span>
                  <span className="bg-rose-950 text-rose-300 text-xs px-2.5 py-0.5 rounded-full border border-rose-800 font-bold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> PHI: {chem.pre_harvest_interval_days} Days
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                <div className="bg-[#0c0d07] p-2.5 rounded-lg border border-amber-900/30">
                  <span className="text-slate-400 font-medium block">Dosage per Liter:</span>
                  <span className="text-amber-300 font-bold">{chem.dosage_per_liter}</span>
                </div>
                <div className="bg-[#0c0d07] p-2.5 rounded-lg border border-amber-900/30">
                  <span className="text-slate-400 font-medium block">Safety & PPE Notes:</span>
                  <span className="text-slate-300">{chem.safety_notes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Sprout, ShieldCheck, Cpu, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#040e0a] border-t border-emerald-950 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">AgriSmart AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Enterprise AI-Powered Agriculture Crop Advisory Assistant. Empowering farmers with real-time vision diagnostics, soil stoichiometry, and weather-adaptive irrigation schedules.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Agronomic Standards
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>FAO Agricultural Guidelines</li>
              <li>ICAR & CGIAR Research Models</li>
              <li>USDA-ARS Chemical Safety Protocols</li>
              <li>Pre-Harvest Interval (PHI) Compliance</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-emerald-500" /> AI Systems Engine
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>Google Gemini 2.5 Flash Vision</li>
              <li>Google Gemini 2.5 Pro Agronomy</li>
              <li>Structured JSON Schema Decoders</li>
              <li>Localized ET₀ Evapotranspiration</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-emerald-500" /> Sustainable Farming
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Designed to optimize fertilizer application, minimize chemical runoff into groundwater, prevent pesticide drift, and conserve water resources.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} AgriSmart AI Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with React 18, Node.js, PostgreSQL/SQLite & Google Gemini APIs.</p>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Scan, FlaskConical, Compass, Bot, ShieldCheck, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 border border-emerald-500/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6">
            <Sprout className="w-4 h-4 text-emerald-400" />
            Enterprise AI Agriculture Advisory Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Precision Agronomy Powered by <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">Google Gemini AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 mt-6 leading-relaxed">
            Translate soil chemistry (NPK, pH), micro-climate telemetry, and foliar crop diagnostics into hyper-localized, actionable steps. Mitigate crop failure, eliminate fertilizer waste, and maximize net yield per hectare.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <Link
              to="/dashboard"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-900/50 transition-all flex items-center gap-2"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/diagnostics"
              className="px-6 py-3.5 bg-emerald-950/80 border border-emerald-800 hover:border-emerald-500 text-emerald-300 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
            >
              <Scan className="w-4 h-4 text-emerald-400" />
              <span>Scan Leaf Pathology</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-emerald-900/60 text-xs">
            <div>
              <p className="font-extrabold text-2xl text-emerald-400">96.8%</p>
              <p className="text-slate-400 font-medium mt-0.5">Vision Diagnostic Accuracy</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl text-teal-400">46-0-0</p>
              <p className="text-slate-400 font-medium mt-0.5">Exact Urea & DAP Stoichiometry</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl text-emerald-400">7-Day</p>
              <p className="text-slate-400 font-medium mt-0.5">ET₀ Water & Spray Window</p>
            </div>
            <div>
              <p className="font-extrabold text-2xl text-teal-400">5 Languages</p>
              <p className="text-slate-400 font-medium mt-0.5">EN, HI, ES, SW, FR</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Modules */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Full-Stack Enterprise Agronomy Features</h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered for smallholder farmers, commercial agricultural enterprises, and extension officers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-emerald-900/40">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
              <Scan className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Multimodal Pathology Vision AI</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Instantly identify fungal blights, bacterial wilts, viral mosaics, and pest feeding damage with Gemini 2.5 Flash Vision. Returns confidence ratings and treatment protocols.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Organic & Biocontrol Alternatives</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Synthetic Pesticides with Dosage & PHI</li>
            </ul>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-emerald-900/40">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Precision NPK Fertilizer Calculator</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Stoichiometric conversion of soil Nitrogen, Phosphorus, and Potassium deficits into commercial fertilizer recipes (Urea, DAP, MOP) in metric kg and 50kg bags.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> DAP Phosphorus Deficit Fulfillment First</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Basal vs Top-Dressing Split Schedules</li>
            </ul>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-emerald-900/40">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Weather & Water Budget Planner</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Daily evapotranspiration (ET₀) water requirements paired with explicit chemical spray feasibility warnings (prohibiting spraying during high winds &gt;15km/h or rain).
            </p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> 7-Day Watering Duration Calendar</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Chemical Drift & Wash-off Prevention</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

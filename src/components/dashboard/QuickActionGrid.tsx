import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, FlaskConical, Compass, Bot, ArrowRight } from 'lucide-react';

export const QuickActionGrid: React.FC = () => {
  const actions = [
    {
      title: 'Multimodal Pathology Scanner',
      desc: 'Instant AI leaf diagnosis with organic & chemical PHI protocols.',
      icon: Scan,
      path: '/diagnostics',
      color: 'from-emerald-600 to-green-500',
      badge: 'Vision AI',
    },
    {
      title: 'Precision Fertilizer Calculator',
      desc: 'Convert NPK deficits to Urea, DAP, and MOP 50kg split dosages.',
      icon: FlaskConical,
      path: '/fertilizer-calc',
      color: 'from-teal-600 to-cyan-500',
      badge: 'Stoichiometry',
    },
    {
      title: 'Seasonal Crop Advisor',
      desc: 'Ranked crop rotation suitability, expected yields & water budgets.',
      icon: Compass,
      path: '/crop-planner',
      color: 'from-amber-600 to-yellow-500',
      badge: 'Gemini Pro',
    },
    {
      title: 'Dr. Agro AI Consultation',
      desc: 'Multilingual chat assistant with real-time farm context retention.',
      icon: Bot,
      path: '/assistant',
      color: 'from-emerald-700 to-teal-600',
      badge: 'Chatbot',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link
            key={act.title}
            to={act.path}
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-emerald-900/40 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                  {act.badge}
                </span>
              </div>
              <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                {act.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{act.desc}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 mt-4 group-hover:translate-x-1 transition-transform">
              Launch Tool <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

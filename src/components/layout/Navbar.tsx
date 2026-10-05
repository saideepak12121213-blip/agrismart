import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  MapPin,
  Scan,
  Compass,
  FlaskConical,
  Droplets,
  Bot,
  History,
  Languages,
  ChevronDown,
} from 'lucide-react';
import { useFarms } from '../../api/hooks';
import { Language } from '@shared/types';

interface NavbarProps {
  activeFarmId: string;
  onSelectFarm: (farmId: string) => void;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeFarmId,
  onSelectFarm,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const location = useLocation();
  const { data: farms = [] } = useFarms();

  const navItems = [
    { path: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { path: '/farms', label: 'Farms & Soil', icon: MapPin },
    { path: '/diagnostics', label: 'Crop Scanner', icon: Scan },
    { path: '/crop-planner', label: 'Crop Advisor', icon: Compass },
    { path: '/fertilizer-calc', label: 'Fertilizer Calc', icon: FlaskConical },
    { path: '/irrigation', label: 'Water & Weather', icon: Droplets },
    { path: '/assistant', label: 'Dr. Agro AI', icon: Bot },
    { path: '/history', label: 'Field History', icon: History },
  ];

  const languages: { code: Language; name: string }[] = [
    { code: 'en', name: 'English (US)' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'sw', name: 'Swahili (Kiswahili)' },
    { code: 'fr', name: 'French (Français)' },
  ];

  const activeFarm = farms.find((f) => f.id === activeFarmId) || farms[0];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-emerald-900/40 bg-[#06140e]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">AgriSmart</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                  AI Enterprise
                </span>
              </div>
              <p className="text-[10px] text-emerald-400/80 tracking-wide font-medium">Precision Agronomy & Advisory</p>
            </div>
          </Link>

          {/* Controls: Active Farm Selector & Language */}
          <div className="hidden md:flex items-center gap-4">
            {/* Active Farm Selector Dropdown */}
            <div className="relative group">
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/50 rounded-lg px-3 py-1.5 text-xs text-emerald-200 hover:border-emerald-500 transition-colors cursor-pointer">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="font-medium max-w-[140px] truncate">
                  {activeFarm ? activeFarm.farm_name : 'Select Farm Plot'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <select
                value={activeFarmId || (activeFarm?.id || '')}
                onChange={(e) => onSelectFarm(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#0b1d15] text-emerald-200">
                    {f.farm_name} ({f.total_area_hectares} ha - {f.location_name})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-800/50 rounded-lg px-2.5 py-1.5 text-xs text-emerald-200 hover:border-emerald-500 transition-colors cursor-pointer">
                <Languages className="w-4 h-4 text-emerald-400" />
                <span className="uppercase font-semibold text-emerald-300">{selectedLanguage}</span>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => onSelectLanguage(e.target.value as Language)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0b1d15] text-emerald-200">
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2 border-t border-emerald-950 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

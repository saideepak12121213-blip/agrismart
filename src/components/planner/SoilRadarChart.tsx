import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SoilTest } from '@shared/types';

interface SoilRadarChartProps {
  soilTest?: SoilTest;
}

export const SoilRadarChart: React.FC<SoilRadarChartProps> = ({ soilTest }) => {
  const n = soilTest?.nitrogen_kg_ha || 180;
  const p = soilTest?.phosphorus_kg_ha || 35;
  const k = soilTest?.potassium_kg_ha || 220;
  const ph = (soilTest?.ph_level || 6.8) * 40; // Scaled for radar visibility

  const data = [
    { metric: 'Nitrogen (N)', Current: Math.min(100, Math.round((n / 300) * 100)), Target: 80 },
    { metric: 'Phosphorus (P)', Current: Math.min(100, Math.round((p / 60) * 100)), Target: 75 },
    { metric: 'Potassium (K)', Current: Math.min(100, Math.round((k / 300) * 100)), Target: 85 },
    { metric: 'pH Index', Current: Math.min(100, Math.round(ph / 3)), Target: 75 },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40">
      <h4 className="text-base font-bold text-white mb-2">Soil NPK & pH Radar Balance</h4>
      <p className="text-xs text-slate-400 mb-4">
        Visual comparison of active soil chemistry levels against standard target recommendations (Scaled 0-100%).
      </p>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#1e382b" />
            <PolarAngleAxis dataKey="metric" stroke="#a7f3d0" tick={{ fill: '#a7f3d0', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#1e382b" />
            <Radar name="Current Soil Level" dataKey="Current" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} />
            <Radar name="Baseline Target" dataKey="Target" stroke="#eab308" fill="#eab308" fillOpacity={0.1} strokeDasharray="4 4" />
            <Tooltip
              contentStyle={{ backgroundColor: '#091b13', borderColor: '#22c55e', borderRadius: '12px', fontSize: '12px' }}
              itemStyle={{ color: '#ecfdf5' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

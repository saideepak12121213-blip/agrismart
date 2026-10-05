import React from 'react';
import { useDiagnosticHistory } from '../../api/hooks';
import { Scan, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentScansCarouselProps {
  farmId: string;
}

export const RecentScansCarousel: React.FC<RecentScansCarouselProps> = ({ farmId }) => {
  const { data: scans = [] } = useDiagnosticHistory(farmId);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Recent Vision AI Scans</h3>
        </div>
        <Link to="/diagnostics" className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
          Scan New Leaf <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-8 bg-[#091b13] rounded-xl border border-dashed border-emerald-900/60">
          <Scan className="w-10 h-10 text-emerald-500/40 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">No crop diagnostic scans yet</p>
          <p className="text-xs text-slate-500 mt-1">Upload a leaf or fruit photo to diagnose pests & fungal pathogens instantly.</p>
          <Link
            to="/diagnostics"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Launch Scanner
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scans.slice(0, 3).map((scan) => (
            <div key={scan.id} className="bg-[#091b13] border border-emerald-900/50 rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-all">
              <div className="h-36 relative overflow-hidden bg-emerald-950">
                <img
                  src={scan.image_url}
                  alt={scan.diagnosis_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  {scan.confidence_score}% Confidence
                </div>
                <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-semibold text-white">
                  {scan.crop_name}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-400 line-clamp-1">{scan.diagnosis_name}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      scan.severity_level === 'Critical' || scan.severity_level === 'High'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {scan.severity_level}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3 line-clamp-2">
                  {scan.symptoms_detected?.[0] || 'Pathogen symptoms detected via Vision AI'}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-emerald-950 text-[11px]">
                  <span className="text-slate-500">{new Date(scan.created_at).toLocaleDateString()}</span>
                  <Link to="/history" className="text-emerald-400 hover:underline font-medium">
                    View Protocol →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

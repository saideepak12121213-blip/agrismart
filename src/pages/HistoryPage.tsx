import React, { useState } from 'react';
import { useDiagnosticHistory, useToggleDiagnosticResolved } from '../api/hooks';
import { History, Printer, CheckCircle2, AlertTriangle, Filter, Search, FileText } from 'lucide-react';

interface HistoryPageProps {
  activeFarmId: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ activeFarmId }) => {
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: diagnostics = [], isLoading } = useDiagnosticHistory(activeFarmId, severityFilter || undefined);
  const toggleResolvedMutation = useToggleDiagnosticResolved();

  const filtered = diagnostics.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.diagnosis_name.toLowerCase().includes(term) ||
      item.crop_name.toLowerCase().includes(term) ||
      item.pathogen_type.toLowerCase().includes(term)
    );
  });

  const handlePrintAuditReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Diagnostic Archive & Field History</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chronological audit log of all visual crop scans, pathogen diagnoses, and chemical prescriptions.
          </p>
        </div>

        <button
          onClick={handlePrintAuditReport}
          className="px-4 py-2.5 bg-emerald-950 border border-emerald-800 hover:border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-lg"
        >
          <Printer className="w-4 h-4" /> Export Printable Field Audit Report
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop, disease, pathogen..."
            className="w-full bg-[#071911] border border-emerald-800 rounded-xl pl-9 pr-4 py-2 text-xs text-emerald-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-emerald-400" /> Filter Severity:
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-[#071911] border border-emerald-800 rounded-xl px-3 py-1.5 text-xs text-emerald-200 focus:outline-none"
          >
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* History Log Table */}
      <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-emerald-900/60 bg-[#071b12] text-slate-300">
                <th className="p-3 font-semibold">Specimen</th>
                <th className="p-3 font-semibold">Crop & Pathogen</th>
                <th className="p-3 font-semibold">Confidence</th>
                <th className="p-3 font-semibold">Severity</th>
                <th className="p-3 font-semibold">Date Logged</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950 text-slate-200">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#082016]/50 transition-colors">
                  <td className="p-3">
                    <img
                      src={item.image_url}
                      alt={item.diagnosis_name}
                      className="w-12 h-12 object-cover rounded-lg border border-emerald-800"
                    />
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white text-sm">{item.diagnosis_name}</div>
                    <div className="text-emerald-400 text-[11px]">{item.crop_name} ({item.pathogen_type})</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-300">
                    {item.confidence_score}%
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        item.severity_level === 'Critical' || item.severity_level === 'High'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {item.severity_level}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {item.is_resolved ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Resolved
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Active Alert
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() =>
                        toggleResolvedMutation.mutate({
                          id: item.id,
                          is_resolved: !item.is_resolved,
                        })
                      }
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                        item.is_resolved
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {item.is_resolved ? 'Mark Active' : 'Mark Resolved'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

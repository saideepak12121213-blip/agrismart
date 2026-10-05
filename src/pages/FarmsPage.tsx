import React, { useState } from 'react';
import { useFarms, useCreateFarm, useCreateSoilTest } from '../api/hooks';
import { SoilRadarChart } from '../components/planner/SoilRadarChart';
import { MapPin, Plus, Sprout, TestTube, Check, X, Calendar, Activity } from 'lucide-react';
import { SoilType, IrrigationSource } from '@shared/types';

export const FarmsPage: React.FC = () => {
  const { data: farms = [], isLoading } = useFarms();
  const createFarmMutation = useCreateFarm();

  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddSoilModal, setShowAddSoilModal] = useState(false);

  // New Farm Form State
  const [farmName, setFarmName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [areaHectares, setAreaHectares] = useState(5.0);
  const [soilType, setSoilType] = useState<SoilType>('Black Cotton');
  const [irrigationSource, setIrrigationSource] = useState<IrrigationSource>('Drip System');
  const [isOrganic, setIsOrganic] = useState(false);

  // New Soil Test Form State
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [nitrogen, setNitrogen] = useState(180);
  const [phosphorus, setPhosphorus] = useState(35);
  const [potassium, setPotassium] = useState(220);
  const [phLevel, setPhLevel] = useState(6.8);
  const [ecDsM, setEcDsM] = useState(0.8);
  const [organicCarbon, setOrganicCarbon] = useState(0.65);
  const [soilNotes, setSoilNotes] = useState('');

  const activeFarm = farms.find((f) => f.id === selectedFarmId) || farms[0];
  const createSoilTestMutation = useCreateSoilTest(activeFarm?.id || '');

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    createFarmMutation.mutate(
      {
        farm_name: farmName,
        location_name: locationName,
        total_area_hectares: Number(areaHectares),
        soil_type: soilType,
        irrigation_source: irrigationSource,
        is_organic: isOrganic,
      },
      {
        onSuccess: () => {
          setShowAddFarmModal(false);
          setFarmName('');
          setLocationName('');
        },
      }
    );
  };

  const handleCreateSoilTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFarm) return;
    createSoilTestMutation.mutate(
      {
        test_date: testDate,
        nitrogen_kg_ha: Number(nitrogen),
        phosphorus_kg_ha: Number(phosphorus),
        potassium_kg_ha: Number(potassium),
        ph_level: Number(phLevel),
        ec_ds_m: Number(ecDsM),
        organic_carbon_pct: Number(organicCarbon),
        notes: soilNotes,
      },
      {
        onSuccess: () => {
          setShowAddSoilModal(false);
        },
      }
    );
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" /> Farm Plot & Soil Health Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-farm plot registry, soil test logs, and NPK stoichiometry radar analysis.
          </p>
        </div>

        <button
          onClick={() => setShowAddFarmModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/40 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Farm Plot
        </button>
      </div>

      {/* Farm Plots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {farms.map((farm) => {
          const isSelected = farm.id === (activeFarm?.id || '');
          const soil = farm.latest_soil_test;
          return (
            <div
              key={farm.id}
              onClick={() => setSelectedFarmId(farm.id)}
              className={`glass-panel rounded-2xl p-5 border cursor-pointer transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-[#0a2318] shadow-lg shadow-emerald-900/30'
                  : 'border-emerald-900/40 hover:border-emerald-500/40 bg-[#071911]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  {farm.total_area_hectares} Hectares
                </span>
                {farm.is_organic && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                    Organic Certified
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-white text-lg">{farm.farm_name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{farm.location_name}</p>

              <div className="mt-4 pt-3 border-t border-emerald-900/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Soil Classification:</span>
                  <span className="text-slate-200 font-semibold">{farm.soil_type}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Irrigation Source:</span>
                  <span className="text-slate-200 font-semibold">{farm.irrigation_source}</span>
                </div>
              </div>

              {soil && (
                <div className="mt-3 bg-[#05140e] p-2.5 rounded-xl border border-emerald-900/40 text-[11px] flex items-center justify-between text-emerald-300 font-mono">
                  <span>NPK: {soil.nitrogen_kg_ha}/{soil.phosphorus_kg_ha}/{soil.potassium_kg_ha}</span>
                  <span>pH: {soil.ph_level}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Farm Detailed Soil Test Management */}
      {activeFarm && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SoilRadarChart soilTest={activeFarm.latest_soil_test} />

          <div className="glass-panel rounded-2xl p-6 border border-emerald-900/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TestTube className="w-5 h-5 text-emerald-400" /> Active Soil Chemistry Log
                  </h3>
                  <p className="text-xs text-slate-400">Farm: {activeFarm.farm_name}</p>
                </div>
                <button
                  onClick={() => setShowAddSoilModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-950 border border-emerald-800 text-emerald-300 hover:border-emerald-500 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Soil Test
                </button>
              </div>

              {activeFarm.latest_soil_test ? (
                <div className="space-y-3">
                  <div className="bg-[#081d14] p-4 rounded-xl border border-emerald-900/40 grid grid-cols-3 gap-3 text-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nitrogen (N)</span>
                      <span className="text-emerald-400 text-xl font-extrabold">{activeFarm.latest_soil_test.nitrogen_kg_ha}</span>
                      <span className="text-slate-500 text-[10px] block">kg/ha</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Phosphorus (P)</span>
                      <span className="text-amber-400 text-xl font-extrabold">{activeFarm.latest_soil_test.phosphorus_kg_ha}</span>
                      <span className="text-slate-500 text-[10px] block">kg/ha</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">Potassium (K)</span>
                      <span className="text-teal-400 text-xl font-extrabold">{activeFarm.latest_soil_test.potassium_kg_ha}</span>
                      <span className="text-slate-500 text-[10px] block">kg/ha</span>
                    </div>
                  </div>

                  <div className="bg-[#081d14] p-3 rounded-xl border border-emerald-900/40 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Soil pH Level:</span>
                    <span className="text-white font-bold">{activeFarm.latest_soil_test.ph_level} (Optimal 6.0 - 7.5)</span>
                  </div>

                  <div className="bg-[#081d14] p-3 rounded-xl border border-emerald-900/40 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Electrical Conductivity (EC):</span>
                    <span className="text-white font-bold">{activeFarm.latest_soil_test.ec_ds_m || 0.8} dS/m</span>
                  </div>

                  {activeFarm.latest_soil_test.notes && (
                    <p className="text-xs text-slate-300 bg-[#06150e] p-3 rounded-xl border border-emerald-900/30">
                      <span className="font-semibold text-emerald-400">Notes: </span>
                      {activeFarm.latest_soil_test.notes}
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No soil test logged for this farm plot yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Farm */}
      {showAddFarmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-emerald-500/40">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/60">
              <h3 className="text-lg font-bold text-white">Register New Farm Plot</h3>
              <button onClick={() => setShowAddFarmModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFarm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Farm Plot Name</label>
                <input
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Green Valley Sector B"
                  className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location / District</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Area (Hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(Number(e.target.value))}
                    className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Soil Classification</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                  >
                    <option value="Black Cotton">Black Cotton (Vertisol)</option>
                    <option value="Alluvial">Alluvial Soil</option>
                    <option value="Red & Yellow">Red & Yellow Soil</option>
                    <option value="Laterite">Laterite Soil</option>
                    <option value="Sandy Arid">Sandy Arid Soil</option>
                    <option value="Clay Loam">Clay Loam</option>
                    <option value="Saline/Alkaline">Saline/Alkaline</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Irrigation Infrastructure</label>
                <select
                  value={irrigationSource}
                  onChange={(e) => setIrrigationSource(e.target.value as IrrigationSource)}
                  className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                >
                  <option value="Drip System">Drip System</option>
                  <option value="Canal">Canal</option>
                  <option value="Borewell/Tubewell">Borewell / Tubewell</option>
                  <option value="Sprinkler">Sprinkler System</option>
                  <option value="Rainfed">Rainfed</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="organic"
                  checked={isOrganic}
                  onChange={(e) => setIsOrganic(e.target.checked)}
                  className="rounded border-emerald-800 bg-[#071911] text-emerald-600 focus:ring-0"
                />
                <label htmlFor="organic" className="text-slate-300 font-medium">
                  Organic Certified Plot (Prohibits synthetic chemical prescriptives)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddFarmModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createFarmMutation.isPending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Save Farm Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Soil Test */}
      {showAddSoilModal && activeFarm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-emerald-500/40">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-900/60">
              <h3 className="text-lg font-bold text-white">Log Soil Test ({activeFarm.farm_name})</h3>
              <button onClick={() => setShowAddSoilModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSoilTest} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nitrogen (N kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={nitrogen}
                    onChange={(e) => setNitrogen(Number(e.target.value))}
                    className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phosphorus (P kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(Number(e.target.value))}
                    className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Potassium (K kg/ha)</label>
                  <input
                    type="number"
                    required
                    value={potassium}
                    onChange={(e) => setPotassium(Number(e.target.value))}
                    className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Soil pH Level</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="11.0"
                    required
                    value={phLevel}
                    onChange={(e) => setPhLevel(Number(e.target.value))}
                    className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">EC (dS/m)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={ecDsM}
                    onChange={(e) => setEcDsM(Number(e.target.value))}
                    className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Soil Analysis Notes</label>
                <textarea
                  rows={2}
                  value={soilNotes}
                  onChange={(e) => setSoilNotes(e.target.value)}
                  placeholder="Pre-monsoon soil test findings..."
                  className="w-full bg-[#071911] border border-emerald-800 rounded-xl px-3 py-2 text-emerald-200"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSoilModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSoilTestMutation.isPending}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold"
                >
                  Save Soil Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

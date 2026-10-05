import { FertilizerPrescription, FertilizerSplit } from '@shared/types.js';

/**
 * Precision Stoichiometric Fertilizer Calculator
 * 
 * Formulas:
 * Commercial Fertilizers:
 * 1. DAP (Diammonium Phosphate): 18% N, 46% P₂O₅
 * 2. Urea: 46% N
 * 3. MOP (Muriate of Potash): 60% K₂O
 * 
 * Step 1: Satisfy Phosphorus (P) deficit using DAP
 *   DAP (kg/ha) = P_deficit / 0.46
 *   Incidental N provided by DAP = DAP * 0.18
 * 
 * Step 2: Satisfy remaining Nitrogen (N) deficit using Urea
 *   Remaining N Deficit = Math.max(0, Target N - Current N - Incidental N)
 *   Urea (kg/ha) = Remaining_N_Deficit / 0.46
 * 
 * Step 3: Satisfy Potassium (K) deficit using MOP
 *   MOP (kg/ha) = K_deficit / 0.60
 * 
 * Total Farm Requirement = Rate per ha * Farm Area in Hectares
 */
export function calculateFertilizerDosage(
  cropName: string,
  areaHectares: number,
  currentN: number,
  currentP: number,
  currentK: number,
  targetN: number,
  targetP: number,
  targetK: number
) {
  const deficitN_per_ha = Math.max(0, targetN - currentN);
  const deficitP_per_ha = Math.max(0, targetP - currentP);
  const deficitK_per_ha = Math.max(0, targetK - currentK);

  // 1. DAP required per ha for P deficit
  const dap_per_ha = deficitP_per_ha / 0.46;
  const incidental_N_from_dap = dap_per_ha * 0.18;

  // 2. Remaining N deficit after DAP application
  const remaining_N_per_ha = Math.max(0, deficitN_per_ha - incidental_N_from_dap);
  const urea_per_ha = remaining_N_per_ha / 0.46;

  // 3. MOP required per ha for K deficit
  const mop_per_ha = deficitK_per_ha / 0.60;

  // Total Kilograms for entire farm area
  const total_dap_kg = Number((dap_per_ha * areaHectares).toFixed(2));
  const total_urea_kg = Number((urea_per_ha * areaHectares).toFixed(2));
  const total_mop_kg = Number((mop_per_ha * areaHectares).toFixed(2));

  // Bags (50kg per commercial bag)
  const dap_bags = Number((total_dap_kg / 50).toFixed(1));
  const urea_bags = Number((total_urea_kg / 50).toFixed(1));
  const mop_bags = Number((total_mop_kg / 50).toFixed(1));

  // Split Application Timetable
  const splits: FertilizerSplit[] = [
    {
      stage: 'Basal Application (At Sowing / Transplanting)',
      timing: 'Day 0 (Before or during sowing)',
      dap_kg: Number((total_dap_kg * 1.0).toFixed(2)), // 100% DAP as basal
      mop_kg: Number((total_mop_kg * 0.5).toFixed(2)), // 50% MOP as basal
      urea_kg: Number((total_urea_kg * 0.25).toFixed(2)), // 25% Urea as basal starter
      notes: 'Incorporate DAP and MOP into top 5-10cm soil layer during land preparation. Apply basal urea in moist soil.',
    },
    {
      stage: 'Vegetative / Active Tillering Split',
      timing: '25-30 Days After Sowing (DAS)',
      dap_kg: 0,
      mop_kg: Number((total_mop_kg * 0.5).toFixed(2)), // Remaining 50% MOP
      urea_kg: Number((total_urea_kg * 0.5).toFixed(2)), // 50% Urea
      notes: 'Top-dress urea when field is well irrigated. Avoid applying directly against plant stems.',
    },
    {
      stage: 'Flowering & Fruit/Grain Set Split',
      timing: '45-60 Days After Sowing (DAS)',
      dap_kg: 0,
      mop_kg: 0,
      urea_kg: Number((total_urea_kg * 0.25).toFixed(2)), // Final 25% Urea
      notes: 'Final top dressing to boost grain filling and fruit yield. Ensure adequate soil moisture.',
    },
  ];

  const agronomyAdvice = `For ${cropName} (${areaHectares} ha): Apply full Phosphorus (${dap_bags} bags DAP) at planting because Phosphorus promotes root establishment. Apply MOP in 2 splits to optimize root uptake. Split Urea 3-ways to prevent volatilization and leaching losses into groundwater.`;

  return {
    crop_name: cropName,
    area_hectares: areaHectares,
    target_n_deficit: Number((deficitN_per_ha * areaHectares).toFixed(2)),
    target_p_deficit: Number((deficitP_per_ha * areaHectares).toFixed(2)),
    target_k_deficit: Number((deficitK_per_ha * areaHectares).toFixed(2)),
    urea_kg_required: total_urea_kg,
    dap_kg_required: total_dap_kg,
    mop_kg_required: total_mop_kg,
    urea_bags_50kg: urea_bags,
    dap_bags_50kg: dap_bags,
    mop_bags_50kg: mop_bags,
    application_splits: splits,
    agronomy_advice: agronomyAdvice,
  };
}

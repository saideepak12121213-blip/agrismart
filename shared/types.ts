export type Language = 'en' | 'hi' | 'es' | 'sw' | 'fr';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  preferred_language: Language;
  created_at: string;
}

export type SoilType =
  | 'Alluvial'
  | 'Black Cotton'
  | 'Red & Yellow'
  | 'Laterite'
  | 'Sandy Arid'
  | 'Clay Loam'
  | 'Saline/Alkaline'
  | 'Peaty/Marshy';

export type IrrigationSource =
  | 'Canal'
  | 'Borewell/Tubewell'
  | 'Drip System'
  | 'Sprinkler'
  | 'Rainfed';

export interface Farm {
  id: string;
  user_id: string;
  farm_name: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  total_area_hectares: number;
  soil_type: SoilType;
  irrigation_source: IrrigationSource;
  is_organic: boolean;
  created_at: string;
  updated_at: string;
  latest_soil_test?: SoilTest;
  recent_diagnostics_count?: number;
}

export interface SoilTest {
  id: string;
  farm_id: string;
  test_date: string;
  nitrogen_kg_ha: number;
  phosphorus_kg_ha: number;
  potassium_kg_ha: number;
  ph_level: number;
  organic_carbon_pct?: number;
  ec_ds_m?: number;
  notes?: string;
  created_at: string;
}

export type PathogenType =
  | 'Fungal'
  | 'Bacterial'
  | 'Viral'
  | 'Insect Pest'
  | 'Nematode'
  | 'Nutrient Deficiency'
  | 'Abiotic Stress'
  | 'Healthy';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface OrganicTreatment {
  treatment_name: string;
  dosage_and_application: string;
  frequency: string;
}

export interface ChemicalTreatment {
  active_ingredient: string;
  commercial_example: string;
  dosage_per_liter: string;
  pre_harvest_interval_days: number;
  safety_notes: string;
}

export interface DiseaseDiagnostic {
  id: string;
  farm_id: string;
  crop_name: string;
  image_url: string;
  diagnosis_name: string;
  pathogen_type: PathogenType;
  confidence_score: number;
  severity_level: SeverityLevel;
  symptoms_detected: string[];
  organic_treatments: OrganicTreatment[];
  chemical_treatments: ChemicalTreatment[];
  preventive_measures: string[];
  raw_ai_response?: any;
  is_resolved: boolean;
  created_at: string;
}

export interface GrowthStage {
  stage_name: string;
  day_range: string;
  key_action: string;
}

export interface RecommendedCrop {
  crop_name: string;
  variety_suggestions?: string[];
  suitability_score: number;
  suitability_rationale: string;
  expected_duration_days: number;
  expected_yield_per_ha: string;
  water_requirement_mm: number;
  soil_amendment_advice?: string;
  key_risks: string[];
  growth_stages: GrowthStage[];
}

export interface CropPlan {
  id: string;
  farm_id: string;
  season: string;
  target_crop: string;
  suitability_score: number;
  expected_duration_days: number;
  expected_yield_per_ha: string;
  water_requirement_mm: number;
  key_risks: string[];
  growth_stages: GrowthStage[];
  created_at: string;
}

export interface FertilizerSplit {
  stage: string;
  timing: string;
  urea_kg: number;
  dap_kg: number;
  mop_kg: number;
  notes: string;
}

export interface FertilizerPrescription {
  id: string;
  farm_id: string;
  crop_name: string;
  area_hectares: number;
  target_n_deficit: number;
  target_p_deficit: number;
  target_k_deficit: number;
  urea_kg_required: number;
  dap_kg_required: number;
  mop_kg_required: number;
  urea_bags_50kg: number;
  dap_bags_50kg: number;
  mop_bags_50kg: number;
  application_splits: FertilizerSplit[];
  agronomy_advice?: string;
  created_at: string;
}

export type SprayFeasibility = 'OPTIMAL' | 'CAUTION' | 'PROHIBITED';

export interface DailyIrrigationDay {
  day_offset: number;
  date: string;
  temp_c: number;
  humidity_pct: number;
  wind_speed_kmh: number;
  rain_probability_pct: number;
  weather_condition: string;
  et0_mm: number;
  irrigation_amount_mm: number;
  duration_minutes: number;
  spray_feasibility: SprayFeasibility;
  spray_notes: string;
}

export interface IrrigationSchedule {
  id?: string;
  farm_id: string;
  crop_name: string;
  schedule_date?: string;
  days: DailyIrrigationDay[];
  weekly_water_total_mm: number;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_role: 'user' | 'model' | 'system';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  farm_id?: string;
  title: string;
  created_at: string;
  messages?: ChatMessage[];
}

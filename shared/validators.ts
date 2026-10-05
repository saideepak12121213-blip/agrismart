import { z } from 'zod';

export const RegisterUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  full_name: z.string().min(2, "Full name is required").max(150),
  phone_number: z.string().optional(),
  preferred_language: z.enum(['en', 'hi', 'es', 'sw', 'fr']).default('en'),
});

export const LoginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const CreateFarmSchema = z.object({
  farm_name: z.string().min(2, "Farm name must be at least 2 characters").max(100),
  location_name: z.string().min(2, "Location is required"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  total_area_hectares: z.number().positive("Area must be greater than zero"),
  soil_type: z.enum([
    'Alluvial',
    'Black Cotton',
    'Red & Yellow',
    'Laterite',
    'Sandy Arid',
    'Clay Loam',
    'Saline/Alkaline',
    'Peaty/Marshy'
  ]),
  irrigation_source: z.enum(['Canal', 'Borewell/Tubewell', 'Drip System', 'Sprinkler', 'Rainfed']),
  is_organic: z.boolean().default(false),
});

export const CreateSoilTestSchema = z.object({
  test_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  nitrogen_kg_ha: z.number().min(0, "Nitrogen cannot be negative").max(1000),
  phosphorus_kg_ha: z.number().min(0, "Phosphorus cannot be negative").max(500),
  potassium_kg_ha: z.number().min(0, "Potassium cannot be negative").max(1000),
  ph_level: z.number().min(3.0, "pH too acidic").max(11.0, "pH too basic"),
  organic_carbon_pct: z.number().min(0).max(10).optional(),
  ec_ds_m: z.number().min(0).max(20).optional(),
  notes: z.string().max(500).optional(),
});

export const DiagnoseRequestSchema = z.object({
  farm_id: z.string().min(1, "Farm ID is required"),
  crop_name: z.string().min(2, "Crop name is required").max(100),
});

export const CropPlanRequestSchema = z.object({
  farm_id: z.string().min(1, "Farm ID is required"),
  season: z.enum(['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Perennial']),
  target_crops_preference: z.array(z.string()).optional(),
  budget_constraint: z.string().optional(),
});

export const FertilizerCalcSchema = z.object({
  farm_id: z.string().min(1, "Farm ID is required"),
  crop_name: z.string().min(2, "Crop name is required"),
  area_hectares: z.number().positive("Area must be positive"),
  target_n: z.number().positive("Target N must be positive"),
  target_p: z.number().positive("Target P must be positive"),
  target_k: z.number().positive("Target K must be positive"),
});

export const ChatMessageSchema = z.object({
  conversation_id: z.string().optional(),
  farm_id: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty").max(2000),
  language: z.enum(['en', 'hi', 'es', 'sw', 'fr']).default('en'),
});

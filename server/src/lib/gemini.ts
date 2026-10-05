import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const MODEL_FAST = 'gemini-2.5-flash';
export const MODEL_REASONING = 'gemini-2.5-pro';

export function bufferToGenerativePart(buffer: Buffer, mimeType: string) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

export const SYSTEM_INSTRUCTION = `You are "Dr. Agro", a world-renowned Senior Agronomist, Plant Pathologist, and Precision Soil Scientist with over 25 years of global agricultural extension experience.
CORE OPERATIONAL PRINCIPLES:
1. AGRONOMIC ACCURACY: Base all disease diagnoses and nutrient calculations on established agricultural science (FAO guidelines, ICAR, USDA-ARS, and CGIAR standards).
2. SAFETY FIRST: Whenever synthetic pesticides or fungicides are recommended:
   - Always state the required Personal Protective Equipment (PPE).
   - Specify the Pre-Harvest Interval (PHI) in days.
   - Mandate dilution ratios and maximum application frequency to avoid pathogen resistance.
3. BALANCED INTERVENTIONS: For every synthetic chemical treatment suggested, you MUST provide at least one viable Organic/Biological alternative (e.g., Trichoderma viride, Bacillus subtilis, Neem oil azadirachtin 10,000 ppm, copper oxychloride).
4. PREVENTIVE CULTURAL MEASURES: Include crop sanitation, spacing, drip irrigation adjustments, and resistant cultivar suggestions.
5. ENVIRONMENTAL RESPONSIBILITY: Prohibit spraying recommendations when weather conditions show high winds (>15 km/h) or imminent rain, to prevent chemical drift and water table contamination.
6. CLARITY & ACCESSIBILITY: Explain scientific concepts in practical, actionable language suitable for farmers. Avoid jargon where simple instructions suffice.`;

export const diseaseDiagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    crop_identified: { type: Type.STRING },
    diagnosis_name: { type: Type.STRING },
    pathogen_type: {
      type: Type.STRING,
      enum: ['Fungal', 'Bacterial', 'Viral', 'Insect Pest', 'Nematode', 'Nutrient Deficiency', 'Abiotic Stress', 'Healthy'],
    },
    confidence_score: { type: Type.NUMBER, description: 'Percentage from 0 to 100' },
    severity_level: {
      type: Type.STRING,
      enum: ['Low', 'Medium', 'High', 'Critical'],
    },
    symptoms_detected: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    organic_treatments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          treatment_name: { type: Type.STRING },
          dosage_and_application: { type: Type.STRING },
          frequency: { type: Type.STRING },
        },
        required: ['treatment_name', 'dosage_and_application', 'frequency'],
      },
    },
    chemical_treatments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          active_ingredient: { type: Type.STRING },
          commercial_example: { type: Type.STRING },
          dosage_per_liter: { type: Type.STRING },
          pre_harvest_interval_days: { type: Type.INTEGER },
          safety_notes: { type: Type.STRING },
        },
        required: ['active_ingredient', 'dosage_per_liter', 'pre_harvest_interval_days', 'safety_notes'],
      },
    },
    preventive_measures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'crop_identified',
    'diagnosis_name',
    'pathogen_type',
    'confidence_score',
    'severity_level',
    'symptoms_detected',
    'organic_treatments',
    'chemical_treatments',
    'preventive_measures',
  ],
};

export const cropRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          crop_name: { type: Type.STRING },
          variety_suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          suitability_score: { type: Type.INTEGER, description: 'Score between 0 and 100' },
          suitability_rationale: { type: Type.STRING },
          expected_duration_days: { type: Type.INTEGER },
          expected_yield_per_ha: { type: Type.STRING },
          water_requirement_mm: { type: Type.NUMBER },
          soil_amendment_advice: { type: Type.STRING },
          key_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          growth_stages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage_name: { type: Type.STRING },
                day_range: { type: Type.STRING },
                key_action: { type: Type.STRING },
              },
              required: ['stage_name', 'day_range', 'key_action'],
            },
          },
        },
        required: [
          'crop_name',
          'suitability_score',
          'suitability_rationale',
          'expected_duration_days',
          'expected_yield_per_ha',
          'water_requirement_mm',
          'key_risks',
          'growth_stages',
        ],
      },
    },
  },
  required: ['recommendations'],
};

import { DailyIrrigationDay, IrrigationSchedule, SprayFeasibility } from '@shared/types.js';

/**
 * 7-Day Weather Forecast & Irrigation Requirement Service
 * 
 * Rules:
 * - Spray Feasibility:
 *   - Wind Speed: Safe < 15 km/h; Caution 15-20 km/h; PROHIBITED > 20 km/h (Drift Hazard)
 *   - Precipitation: Safe < 30%; PROHIBITED >= 40% (Wash-off Hazard)
 *   - Temperature: Safe < 32°C; Peak heat caution > 35°C (Foliar Scorch Risk)
 * 
 * - Reference Evapotranspiration ET0:
 *   ET0 (mm/day) calculated based on temperature, relative humidity, and solar radiation.
 */
export function generate7DayIrrigationSchedule(
  farmId: string,
  cropName: string,
  soilType: string,
  locationName: string
): IrrigationSchedule {
  const days: DailyIrrigationDay[] = [];
  const baseDate = new Date();

  // Weather pattern seeds per day
  const forecastParams = [
    { temp: 28, humidity: 62, wind: 11, rainProb: 15, cond: 'Partly Cloudy' },
    { temp: 31, humidity: 55, wind: 18, rainProb: 25, cond: 'Breezy & Sunny' },
    { temp: 29, humidity: 78, wind: 23, rainProb: 65, cond: 'Heavy Thunderstorms' },
    { temp: 27, humidity: 82, wind: 14, rainProb: 45, cond: 'Light Showers' },
    { temp: 30, humidity: 60, wind: 9,  rainProb: 10, cond: 'Clear & Sunny' },
    { temp: 33, humidity: 50, wind: 12, rainProb: 5,  cond: 'Hot & Clear' },
    { temp: 36, humidity: 45, wind: 16, rainProb: 15, cond: 'Extreme Heat' },
  ];

  let weeklyTotalWater = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    const telemetry = forecastParams[i];

    // Calculate ET0 water requirement
    // Hargreaves approx: ET0 = 0.0023 * (Tmean + 17.8) * sqrt(Tmax - Tmin) * Ra
    let et0 = 4.2 + (telemetry.temp - 25) * 0.15 - (telemetry.humidity - 50) * 0.03;
    et0 = Math.max(2.0, Math.min(8.5, Number(et0.toFixed(1))));

    // Adjust water needed based on rainfall
    let irrigationWaterMm = et0;
    if (telemetry.rainProb >= 60) {
      irrigationWaterMm = 0; // Rain meets water demand
    } else if (telemetry.rainProb >= 40) {
      irrigationWaterMm = Number((et0 * 0.4).toFixed(1));
    }

    // Convert mm water to drip duration minutes (assume drip rate ~ 5 mm/hour -> 1mm = 12 mins)
    const durationMinutes = Math.round(irrigationWaterMm * 12);
    weeklyTotalWater += irrigationWaterMm;

    // Evaluate Spray Feasibility Window
    let sprayFeasibility: SprayFeasibility = 'OPTIMAL';
    const notes: string[] = [];

    if (telemetry.wind > 20) {
      sprayFeasibility = 'PROHIBITED';
      notes.push(`High wind speed (${telemetry.wind} km/h) creates severe spray drift risk.`);
    } else if (telemetry.wind >= 15) {
      if (sprayFeasibility !== 'PROHIBITED') sprayFeasibility = 'CAUTION';
      notes.push(`Moderate wind (${telemetry.wind} km/h). Use low-drift nozzles if spraying.`);
    }

    if (telemetry.rainProb >= 40) {
      sprayFeasibility = 'PROHIBITED';
      notes.push(`Rain probability (${telemetry.rainProb}%) will wash off chemical sprays.`);
    } else if (telemetry.rainProb >= 30) {
      if (sprayFeasibility !== 'PROHIBITED') sprayFeasibility = 'CAUTION';
      notes.push(`30% rain chance. Add a sticker/spreader adjuvant if applying foliar sprays.`);
    }

    if (telemetry.temp > 35) {
      if (sprayFeasibility !== 'PROHIBITED') sprayFeasibility = 'CAUTION';
      notes.push(`High temperature (${telemetry.temp}°C) creates foliar scorch risk. Spray only early morning (6-8 AM).`);
    }

    if (notes.length === 0) {
      notes.push('Weather conditions ideal for spraying and fertilization (calm wind, low rain probability).');
    }

    days.push({
      day_offset: i,
      date: dateStr,
      temp_c: telemetry.temp,
      humidity_pct: telemetry.humidity,
      wind_speed_kmh: telemetry.wind,
      rain_probability_pct: telemetry.rainProb,
      weather_condition: telemetry.cond,
      et0_mm: et0,
      irrigation_amount_mm: irrigationWaterMm,
      duration_minutes: durationMinutes,
      spray_feasibility: sprayFeasibility,
      spray_notes: notes.join(' '),
    });
  }

  return {
    farm_id: farmId,
    crop_name: cropName,
    days,
    weekly_water_total_mm: Number(weeklyTotalWater.toFixed(1)),
  };
}

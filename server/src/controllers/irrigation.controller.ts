import { Response } from 'express';
import db from '../db/pool.ts';
import { generate7DayIrrigationSchedule } from '../services/weather.service.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getIrrigationSchedule(req: AuthenticatedRequest, res: Response) {
  const { farmId } = req.params;
  const crop_name = (req.query.crop_name as string) || 'Tomato';
  const userId = req.user?.id;

  const farm = await db.queryOne(`SELECT * FROM farms WHERE id = $1 AND user_id = $2`, [farmId, userId]);
  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm plot not found' });
  }

  const schedule = generate7DayIrrigationSchedule(farm.id, crop_name, farm.soil_type, farm.location_name);

  // Save latest schedule records to DB for audit history
  for (const day of schedule.days) {
    const existing = await db.queryOne(
      `SELECT id FROM irrigation_schedules WHERE farm_id = $1 AND schedule_date = $2`,
      [farm.id, day.date]
    );

    if (!existing) {
      const id = db.generateUUID();
      await db.query(
        `INSERT INTO irrigation_schedules (
          id, farm_id, crop_name, schedule_date, irrigation_amount_mm, duration_minutes,
          weather_summary, spray_feasibility, spray_notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          farm.id,
          crop_name,
          day.date,
          day.irrigation_amount_mm,
          day.duration_minutes,
          `${day.weather_condition}, ${day.temp_c}°C, Wind ${day.wind_speed_kmh}km/h`,
          day.spray_feasibility,
          day.spray_notes,
        ]
      );
    }
  }

  res.json({ success: true, data: { ...schedule, farm_name: farm.farm_name, location_name: farm.location_name } });
}

import { Response } from 'express';
import db from '../db/pool.ts';
import { CropPlanRequestSchema } from '@shared/validators.ts';
import { generateCropPlanRecommendations } from '../services/gemini.service.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function recommendCrops(req: AuthenticatedRequest, res: Response) {
  const data = CropPlanRequestSchema.parse(req.body);
  const userId = req.user?.id;

  // Retrieve farm details & latest soil test
  const farm = await db.queryOne(`SELECT * FROM farms WHERE id = $1 AND user_id = $2`, [data.farm_id, userId]);
  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm plot not found' });
  }

  const latestSoil = await db.queryOne(
    `SELECT * FROM soil_tests WHERE farm_id = $1 ORDER BY test_date DESC LIMIT 1`,
    [data.farm_id]
  );
  farm.latest_soil_test = latestSoil;

  // Call Gemini 2.5 Pro reasoning engine
  const recommendations = await generateCropPlanRecommendations(farm, data.season, data.budget_constraint);

  // Persist top recommendation into crop_plans table
  const savedPlans: any[] = [];
  for (const item of recommendations.recommendations) {
    const id = db.generateUUID();
    await db.query(
      `INSERT INTO crop_plans (
        id, farm_id, season, target_crop, suitability_score, expected_duration_days,
        expected_yield_per_ha, water_requirement_mm, key_risks, growth_stages
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id,
        data.farm_id,
        data.season,
        item.crop_name,
        item.suitability_score,
        item.expected_duration_days,
        item.expected_yield_per_ha,
        item.water_requirement_mm,
        JSON.stringify(item.key_risks || []),
        JSON.stringify(item.growth_stages || []),
      ]
    );

    const plan = await db.queryOne(`SELECT * FROM crop_plans WHERE id = $1`, [id]);
    savedPlans.push({ ...item, plan_id: id });
  }

  res.json({
    success: true,
    data: {
      farm_name: farm.farm_name,
      season: data.season,
      recommendations: savedPlans,
    },
  });
}

export async function getCropPlanHistory(req: AuthenticatedRequest, res: Response) {
  const { farmId } = req.params;
  const userId = req.user?.id;

  let queryStr = `
    SELECT p.*, f.farm_name 
    FROM crop_plans p
    JOIN farms f ON p.farm_id = f.id
    WHERE f.user_id = $1
  `;
  const params: any[] = [userId];

  if (farmId && farmId !== 'all') {
    queryStr += ` AND p.farm_id = $2`;
    params.push(farmId);
  }

  queryStr += ` ORDER BY p.created_at DESC`;

  const plans = await db.query(queryStr, params);
  res.json({ success: true, data: plans });
}

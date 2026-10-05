import { Response } from 'express';
import db from '../db/pool.ts';
import { FertilizerCalcSchema } from '@shared/validators.ts';
import { calculateFertilizerDosage } from '../services/fertilizer.service.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function calculateFertilizer(req: AuthenticatedRequest, res: Response) {
  const data = FertilizerCalcSchema.parse(req.body);
  const userId = req.user?.id;

  const farm = await db.queryOne(`SELECT * FROM farms WHERE id = $1 AND user_id = $2`, [data.farm_id, userId]);
  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm plot not found' });
  }

  const latestSoil = await db.queryOne(
    `SELECT * FROM soil_tests WHERE farm_id = $1 ORDER BY test_date DESC LIMIT 1`,
    [data.farm_id]
  );

  const currentN = latestSoil?.nitrogen_kg_ha || 180;
  const currentP = latestSoil?.phosphorus_kg_ha || 35;
  const currentK = latestSoil?.potassium_kg_ha || 220;

  const calculation = calculateFertilizerDosage(
    data.crop_name,
    data.area_hectares,
    currentN,
    currentP,
    currentK,
    data.target_n,
    data.target_p,
    data.target_k
  );

  // Save prescription to fertilizer_prescriptions table
  const id = db.generateUUID();
  await db.query(
    `INSERT INTO fertilizer_prescriptions (
      id, farm_id, crop_name, area_hectares, target_n_deficit, target_p_deficit, target_k_deficit,
      urea_kg_required, dap_kg_required, mop_kg_required, application_splits
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      id,
      data.farm_id,
      data.crop_name,
      data.area_hectares,
      calculation.target_n_deficit,
      calculation.target_p_deficit,
      calculation.target_k_deficit,
      calculation.urea_kg_required,
      calculation.dap_kg_required,
      calculation.mop_kg_required,
      JSON.stringify(calculation.application_splits),
    ]
  );

  const prescription = await db.queryOne(`SELECT * FROM fertilizer_prescriptions WHERE id = $1`, [id]);

  res.json({
    success: true,
    data: {
      ...calculation,
      prescription_id: id,
    },
  });
}

export async function getFertilizerHistory(req: AuthenticatedRequest, res: Response) {
  const { farmId } = req.params;
  const userId = req.user?.id;

  let queryStr = `
    SELECT fp.*, f.farm_name 
    FROM fertilizer_prescriptions fp
    JOIN farms f ON fp.farm_id = f.id
    WHERE f.user_id = $1
  `;
  const params: any[] = [userId];

  if (farmId && farmId !== 'all') {
    queryStr += ` AND fp.farm_id = $2`;
    params.push(farmId);
  }

  queryStr += ` ORDER BY fp.created_at DESC`;

  const items = await db.query(queryStr, params);
  res.json({ success: true, data: items });
}

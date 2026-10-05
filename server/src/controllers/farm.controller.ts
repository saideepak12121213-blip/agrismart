import { Response } from 'express';
import db from '../db/pool.ts';
import { CreateFarmSchema, CreateSoilTestSchema } from '@shared/validators.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function getFarms(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const farms = await db.query(
    `SELECT * FROM farms WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  // Attach latest soil test for each farm
  for (const farm of farms) {
    const latestSoil = await db.queryOne(
      `SELECT * FROM soil_tests WHERE farm_id = $1 ORDER BY test_date DESC LIMIT 1`,
      [farm.id]
    );
    farm.latest_soil_test = latestSoil || null;

    const diagCount = await db.queryOne(
      `SELECT COUNT(*) as cnt FROM disease_diagnostics WHERE farm_id = $1 AND is_resolved = 0`,
      [farm.id]
    );
    farm.recent_diagnostics_count = Number(diagCount?.cnt || 0);
  }

  res.json({ success: true, data: farms });
}

export async function createFarm(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const data = CreateFarmSchema.parse(req.body);

  const id = db.generateUUID();
  await db.query(
    `INSERT INTO farms (id, user_id, farm_name, location_name, latitude, longitude, total_area_hectares, soil_type, irrigation_source, is_organic)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      userId,
      data.farm_name,
      data.location_name,
      data.latitude || null,
      data.longitude || null,
      data.total_area_hectares,
      data.soil_type,
      data.irrigation_source,
      data.is_organic ? 1 : 0,
    ]
  );

  // Create an initial baseline soil test for the new farm
  const soilId = db.generateUUID();
  await db.query(
    `INSERT INTO soil_tests (id, farm_id, test_date, nitrogen_kg_ha, phosphorus_kg_ha, potassium_kg_ha, ph_level, organic_carbon_pct, ec_ds_m, notes)
     VALUES ($1, $2, CURRENT_DATE, 180.0, 35.0, 220.0, 6.8, 0.60, 0.75, 'Default initial agronomy baseline record')`,
    [soilId, id]
  );

  const farm = await db.queryOne(`SELECT * FROM farms WHERE id = $1`, [id]);
  farm.latest_soil_test = await db.queryOne(`SELECT * FROM soil_tests WHERE id = $1`, [soilId]);

  res.status(201).json({ success: true, data: farm });
}

export async function getFarmById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user?.id;

  const farm = await db.queryOne(
    `SELECT * FROM farms WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm plot not found' });
  }

  const latestSoil = await db.queryOne(
    `SELECT * FROM soil_tests WHERE farm_id = $1 ORDER BY test_date DESC LIMIT 1`,
    [id]
  );
  farm.latest_soil_test = latestSoil || null;

  const recentDiagnostics = await db.query(
    `SELECT * FROM disease_diagnostics WHERE farm_id = $1 ORDER BY created_at DESC LIMIT 5`,
    [id]
  );
  farm.recent_diagnostics = recentDiagnostics;

  res.json({ success: true, data: farm });
}

export async function deleteFarm(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user?.id;

  const farm = await db.queryOne(`SELECT id FROM farms WHERE id = $1 AND user_id = $2`, [id, userId]);
  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm not found' });
  }

  await db.query(`DELETE FROM farms WHERE id = $1`, [id]);
  res.json({ success: true, message: 'Farm and associated records deleted successfully' });
}

export async function getSoilTests(req: AuthenticatedRequest, res: Response) {
  const { farmId } = req.params;
  const userId = req.user?.id;

  // Verify farm ownership
  const farm = await db.queryOne(`SELECT id FROM farms WHERE id = $1 AND user_id = $2`, [farmId, userId]);
  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm not found' });
  }

  const tests = await db.query(
    `SELECT * FROM soil_tests WHERE farm_id = $1 ORDER BY test_date DESC`,
    [farmId]
  );

  res.json({ success: true, data: tests });
}

export async function createSoilTest(req: AuthenticatedRequest, res: Response) {
  const { farmId } = req.params;
  const userId = req.user?.id;

  const farm = await db.queryOne(`SELECT id FROM farms WHERE id = $1 AND user_id = $2`, [farmId, userId]);
  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm not found' });
  }

  const data = CreateSoilTestSchema.parse(req.body);
  const id = db.generateUUID();

  await db.query(
    `INSERT INTO soil_tests (id, farm_id, test_date, nitrogen_kg_ha, phosphorus_kg_ha, potassium_kg_ha, ph_level, organic_carbon_pct, ec_ds_m, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      id,
      farmId,
      data.test_date,
      data.nitrogen_kg_ha,
      data.phosphorus_kg_ha,
      data.potassium_kg_ha,
      data.ph_level,
      data.organic_carbon_pct || null,
      data.ec_ds_m || null,
      data.notes || null,
    ]
  );

  const test = await db.queryOne(`SELECT * FROM soil_tests WHERE id = $1`, [id]);
  res.status(201).json({ success: true, data: test });
}

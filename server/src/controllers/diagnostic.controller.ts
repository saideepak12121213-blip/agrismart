import { Response } from 'express';
import db from '../db/pool.ts';
import { DiagnoseRequestSchema } from '@shared/validators.ts';
import { analyzePlantPathology } from '../services/gemini.service.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function analyzeCrop(req: AuthenticatedRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Crop image file is required' });
  }

  const data = DiagnoseRequestSchema.parse(req.body);
  const userId = req.user?.id;

  // Verify farm ownership
  const farm = await db.queryOne(`SELECT id FROM farms WHERE id = $1 AND user_id = $2`, [data.farm_id, userId]);
  if (!farm) {
    return res.status(404).json({ success: false, error: 'Farm plot not found' });
  }

  // Convert uploaded file buffer to base64 data URI for storage preview
  const base64Data = req.file.buffer.toString('base64');
  const imageUrl = `data:${req.file.mimetype};base64,${base64Data}`;

  // Call Gemini Vision AI Service
  const aiResult = await analyzePlantPathology(req.file.buffer, req.file.mimetype, data.crop_name);

  const id = db.generateUUID();

  await db.query(
    `INSERT INTO disease_diagnostics (
      id, farm_id, crop_name, image_url, diagnosis_name, pathogen_type, confidence_score,
      severity_level, symptoms_detected, organic_treatments, chemical_treatments,
      preventive_measures, raw_ai_response, is_resolved
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0)`,
    [
      id,
      data.farm_id,
      aiResult.crop_identified || data.crop_name,
      imageUrl,
      aiResult.diagnosis_name,
      aiResult.pathogen_type,
      aiResult.confidence_score,
      aiResult.severity_level,
      JSON.stringify(aiResult.symptoms_detected || []),
      JSON.stringify(aiResult.organic_treatments || []),
      JSON.stringify(aiResult.chemical_treatments || []),
      JSON.stringify(aiResult.preventive_measures || []),
      JSON.stringify(aiResult),
    ]
  );

  const record = await db.queryOne(`SELECT * FROM disease_diagnostics WHERE id = $1`, [id]);
  res.status(201).json({ success: true, data: record });
}

export async function getDiagnosticHistory(req: AuthenticatedRequest, res: Response) {
  const { farmId } = req.params;
  const userId = req.user?.id;
  const { severity, is_resolved } = req.query;

  let queryStr = `
    SELECT d.*, f.farm_name 
    FROM disease_diagnostics d
    JOIN farms f ON d.farm_id = f.id
    WHERE f.user_id = $1
  `;
  const params: any[] = [userId];
  let paramIndex = 2;

  if (farmId && farmId !== 'all') {
    queryStr += ` AND d.farm_id = $${paramIndex++}`;
    params.push(farmId);
  }

  if (severity) {
    queryStr += ` AND d.severity_level = $${paramIndex++}`;
    params.push(severity);
  }

  if (is_resolved !== undefined) {
    queryStr += ` AND d.is_resolved = $${paramIndex++}`;
    params.push(is_resolved === 'true' ? 1 : 0);
  }

  queryStr += ` ORDER BY d.created_at DESC`;

  const records = await db.query(queryStr, params);
  res.json({ success: true, data: records });
}

export async function toggleDiagnosticResolved(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { is_resolved } = req.body;
  const userId = req.user?.id;

  const record = await db.queryOne(
    `SELECT d.id FROM disease_diagnostics d JOIN farms f ON d.farm_id = f.id WHERE d.id = $1 AND f.user_id = $2`,
    [id, userId]
  );

  if (!record) {
    return res.status(404).json({ success: false, error: 'Diagnostic record not found' });
  }

  await db.query(`UPDATE disease_diagnostics SET is_resolved = $1 WHERE id = $2`, [is_resolved ? 1 : 0, id]);
  const updated = await db.queryOne(`SELECT * FROM disease_diagnostics WHERE id = $1`, [id]);

  res.json({ success: true, data: updated });
}

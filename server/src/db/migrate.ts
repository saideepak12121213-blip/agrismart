import db from './pool.ts';
import bcrypt from 'bcryptjs';

export async function runMigrations() {
  console.log('🌱 Initializing Database Schemas & Migrations...');

  // Create Users Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone_number TEXT,
      preferred_language TEXT DEFAULT 'en',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create Farms Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS farms (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      farm_name TEXT NOT NULL,
      location_name TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      total_area_hectares REAL NOT NULL,
      soil_type TEXT NOT NULL,
      irrigation_source TEXT NOT NULL,
      is_organic INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Soil Tests Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS soil_tests (
      id TEXT PRIMARY KEY,
      farm_id TEXT NOT NULL,
      test_date TEXT NOT NULL DEFAULT CURRENT_DATE,
      nitrogen_kg_ha REAL NOT NULL,
      phosphorus_kg_ha REAL NOT NULL,
      potassium_kg_ha REAL NOT NULL,
      ph_level REAL NOT NULL,
      organic_carbon_pct REAL,
      ec_ds_m REAL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );
  `);

  // Create Disease Diagnostics Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS disease_diagnostics (
      id TEXT PRIMARY KEY,
      farm_id TEXT NOT NULL,
      crop_name TEXT NOT NULL,
      image_url TEXT NOT NULL,
      diagnosis_name TEXT NOT NULL,
      pathogen_type TEXT NOT NULL,
      confidence_score REAL NOT NULL,
      severity_level TEXT NOT NULL,
      symptoms_detected TEXT NOT NULL DEFAULT '[]',
      organic_treatments TEXT NOT NULL DEFAULT '[]',
      chemical_treatments TEXT NOT NULL DEFAULT '[]',
      preventive_measures TEXT NOT NULL DEFAULT '[]',
      raw_ai_response TEXT,
      is_resolved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );
  `);

  // Create Crop Plans Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS crop_plans (
      id TEXT PRIMARY KEY,
      farm_id TEXT NOT NULL,
      season TEXT NOT NULL,
      target_crop TEXT NOT NULL,
      suitability_score INTEGER NOT NULL,
      expected_duration_days INTEGER NOT NULL,
      expected_yield_per_ha TEXT NOT NULL,
      water_requirement_mm REAL,
      key_risks TEXT NOT NULL DEFAULT '[]',
      growth_stages TEXT NOT NULL DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );
  `);

  // Create Fertilizer Prescriptions Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS fertilizer_prescriptions (
      id TEXT PRIMARY KEY,
      farm_id TEXT NOT NULL,
      crop_name TEXT NOT NULL,
      area_hectares REAL NOT NULL,
      target_n_deficit REAL NOT NULL,
      target_p_deficit REAL NOT NULL,
      target_k_deficit REAL NOT NULL,
      urea_kg_required REAL NOT NULL,
      dap_kg_required REAL NOT NULL,
      mop_kg_required REAL NOT NULL,
      application_splits TEXT NOT NULL DEFAULT '[]',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );
  `);

  // Create Irrigation Schedules Table
  await db.query(`
    CREATE TABLE IF NOT EXISTS irrigation_schedules (
      id TEXT PRIMARY KEY,
      farm_id TEXT NOT NULL,
      crop_name TEXT NOT NULL,
      schedule_date TEXT NOT NULL,
      irrigation_amount_mm REAL NOT NULL,
      duration_minutes INTEGER NOT NULL,
      weather_summary TEXT NOT NULL,
      spray_feasibility TEXT NOT NULL,
      spray_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
    );
  `);

  // Create Chat Conversations & Messages Tables
  await db.query(`
    CREATE TABLE IF NOT EXISTS chat_conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      farm_id TEXT,
      title TEXT NOT NULL DEFAULT 'Agronomy Consultation',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_role TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata TEXT DEFAULT '{}',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
    );
  `);

  // Seed default Demo Farmer user if database is empty
  const defaultUser = await db.queryOne(`SELECT * FROM users WHERE email = $1`, ['farmer@agrismart.ai']);
  let userId: string;

  if (!defaultUser) {
    userId = '00000000-0000-4000-a000-000000000001';
    const passHash = await bcrypt.hash('farmer123', 10);
    await db.query(
      `INSERT INTO users (id, email, password_hash, full_name, phone_number, preferred_language)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, 'farmer@agrismart.ai', passHash, 'Rajesh Kumar', '+91 98765 43210', 'en']
    );
    console.log('✅ Demo user created: farmer@agrismart.ai (pass: farmer123)');
  } else {
    userId = defaultUser.id;
  }

  // Seed default demo farms if empty
  const existingFarms = await db.query(`SELECT * FROM farms WHERE user_id = $1`, [userId]);
  if (existingFarms.length === 0) {
    const farm1Id = '11111111-1111-4111-a111-111111111111';
    const farm2Id = '22222222-2222-4222-a222-222222222222';

    await db.query(
      `INSERT INTO farms (id, user_id, farm_name, location_name, latitude, longitude, total_area_hectares, soil_type, irrigation_source, is_organic)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [farm1Id, userId, 'Green Acres Farm', 'Nashik, Maharashtra', 20.0059, 73.7898, 4.5, 'Black Cotton', 'Drip System', 0]
    );

    await db.query(
      `INSERT INTO farms (id, user_id, farm_name, location_name, latitude, longitude, total_area_hectares, soil_type, irrigation_source, is_organic)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [farm2Id, userId, 'Sunrise Valley Plot', 'Ludhiana, Punjab', 30.9010, 75.8573, 8.0, 'Alluvial', 'Canal', 1]
    );

    // Seed Soil Tests for Farm 1
    await db.query(
      `INSERT INTO soil_tests (id, farm_id, test_date, nitrogen_kg_ha, phosphorus_kg_ha, potassium_kg_ha, ph_level, organic_carbon_pct, ec_ds_m, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        '33333333-3333-4333-a333-333333333333',
        farm1Id,
        '2026-09-15',
        185.5,
        32.0,
        210.0,
        6.8,
        0.65,
        0.8,
        'Pre-monsoon comprehensive soil analysis. Slightly deficient in Phosphorous and Nitrogen.'
      ]
    );

    // Seed Diagnostics for Farm 1
    await db.query(
      `INSERT INTO disease_diagnostics (id, farm_id, crop_name, image_url, diagnosis_name, pathogen_type, confidence_score, severity_level, symptoms_detected, organic_treatments, chemical_treatments, preventive_measures, is_resolved)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        '44444444-4444-4444-a444-444444444444',
        farm1Id,
        'Tomato',
        'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80',
        'Early Blight (Alternaria solani)',
        'Fungal',
        94.5,
        'High',
        JSON.stringify(['Concentric dark target-like spots on lower leaves', 'Yellowing margins surrounding lesions', 'Premature leaf drop']),
        JSON.stringify([
          { treatment_name: 'Neem Oil Extract (10,000 ppm)', dosage_and_application: '5 ml per liter of water', frequency: 'Spray every 7 days during humid conditions' },
          { treatment_name: 'Bio-Fungicide Trichoderma viride', dosage_and_application: '10g/L soil drench and foliar spray', frequency: 'Bi-weekly application' }
        ]),
        JSON.stringify([
          { active_ingredient: 'Mancozeb 75% WP', commercial_example: 'Dithane M-45', dosage_per_liter: '2.5 grams / liter', pre_harvest_interval_days: 7, safety_notes: 'Wear nitrile gloves and N95 respirator. Do not enter field for 24 hours.' },
          { active_ingredient: 'Azoxystrobin 23% SC', commercial_example: 'Amistar', dosage_per_liter: '1.0 ml / liter', pre_harvest_interval_days: 5, safety_notes: 'Alternate with non-strobilurin fungicides to prevent resistance.' }
        ]),
        JSON.stringify(['Improve inter-row spacing to 60cm for airflow', 'Remove and burn infected lower foliage', 'Switch to drip irrigation to prevent foliar wetting']),
        0
      ]
    );

    console.log('✅ Demo farms, soil test, and diagnostic records initialized');
  }

  console.log('✨ Migrations completed successfully.');
}

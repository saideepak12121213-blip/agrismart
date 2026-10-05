import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const dbPath = path.resolve(process.cwd(), 'agrismart_db.json');

// Memory Data Store with JSON File Persistence
interface DBStore {
  users: any[];
  farms: any[];
  soil_tests: any[];
  disease_diagnostics: any[];
  crop_plans: any[];
  fertilizer_prescriptions: any[];
  irrigation_schedules: any[];
  chat_conversations: any[];
  chat_messages: any[];
}

let store: DBStore = {
  users: [],
  farms: [],
  soil_tests: [],
  disease_diagnostics: [],
  crop_plans: [],
  fertilizer_prescriptions: [],
  irrigation_schedules: [],
  chat_conversations: [],
  chat_messages: [],
};

function loadStore() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      store = JSON.parse(data);
    } else {
      saveStore();
    }
  } catch (err) {
    console.error('Error loading JSON DB store:', err);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving JSON DB store:', err);
  }
}

loadStore();

export function generateUUID(): string {
  return uuidv4();
}

/**
 * Robust Pure JS SQL-compatible Query Handler
 */
export async function query(sql: string, params: any[] = []): Promise<any[]> {
  loadStore();
  const trimmed = sql.trim();

  // SELECT queries
  if (/^SELECT/i.test(trimmed)) {
    if (/FROM users/i.test(trimmed)) {
      if (params.length > 0 && /WHERE email =/i.test(trimmed)) {
        return store.users.filter((u) => u.email === params[0]);
      }
      if (params.length > 0 && /WHERE id =/i.test(trimmed)) {
        return store.users.filter((u) => u.id === params[0]);
      }
      return store.users;
    }

    if (/FROM farms/i.test(trimmed)) {
      let res = store.farms;
      if (/WHERE user_id = \$1/i.test(trimmed) && params.length > 0) {
        res = res.filter((f) => f.user_id === params[0]);
      } else if (/WHERE id = \$1 AND user_id = \$2/i.test(trimmed) && params.length > 1) {
        res = res.filter((f) => f.id === params[0] && f.user_id === params[1]);
      } else if (/WHERE id = \$1/i.test(trimmed) && params.length > 0) {
        res = res.filter((f) => f.id === params[0]);
      }
      return res.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    if (/FROM soil_tests/i.test(trimmed)) {
      let res = store.soil_tests;
      if (/WHERE farm_id = \$1/i.test(trimmed) && params.length > 0) {
        res = res.filter((s) => s.farm_id === params[0]);
      } else if (/WHERE id = \$1/i.test(trimmed) && params.length > 0) {
        res = res.filter((s) => s.id === params[0]);
      }
      return res.sort((a, b) => new Date(b.test_date || 0).getTime() - new Date(a.test_date || 0).getTime());
    }

    if (/FROM disease_diagnostics/i.test(trimmed)) {
      let res = [...store.disease_diagnostics];
      if (/JOIN farms/i.test(trimmed) && params.length > 0) {
        const userFarmIds = store.farms.filter((f) => f.user_id === params[0]).map((f) => f.id);
        res = res.filter((d) => userFarmIds.includes(d.farm_id));
        if (params.length > 1 && params[1] !== 'all') {
          res = res.filter((d) => d.farm_id === params[1]);
        }
      } else if (params.length > 0 && /WHERE farm_id = \$1/i.test(trimmed)) {
        res = res.filter((d) => d.farm_id === params[0]);
      } else if (params.length > 0 && /WHERE id = \$1/i.test(trimmed)) {
        res = res.filter((d) => d.id === params[0]);
      }
      return res.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    if (/FROM crop_plans/i.test(trimmed)) {
      let res = [...store.crop_plans];
      if (/JOIN farms/i.test(trimmed) && params.length > 0) {
        const userFarmIds = store.farms.filter((f) => f.user_id === params[0]).map((f) => f.id);
        res = res.filter((p) => userFarmIds.includes(p.farm_id));
        if (params.length > 1 && params[1] !== 'all') {
          res = res.filter((p) => p.farm_id === params[1]);
        }
      }
      return res.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    if (/FROM fertilizer_prescriptions/i.test(trimmed)) {
      let res = [...store.fertilizer_prescriptions];
      if (/JOIN farms/i.test(trimmed) && params.length > 0) {
        const userFarmIds = store.farms.filter((f) => f.user_id === params[0]).map((f) => f.id);
        res = res.filter((fp) => userFarmIds.includes(fp.farm_id));
        if (params.length > 1 && params[1] !== 'all') {
          res = res.filter((fp) => fp.farm_id === params[1]);
        }
      }
      return res.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    if (/FROM irrigation_schedules/i.test(trimmed)) {
      let res = store.irrigation_schedules;
      if (params.length >= 2) {
        res = res.filter((i) => i.farm_id === params[0] && i.schedule_date === params[1]);
      }
      return res;
    }

    if (/FROM chat_conversations/i.test(trimmed)) {
      let res = store.chat_conversations;
      if (params.length > 0 && /WHERE user_id = \$1/i.test(trimmed)) {
        res = res.filter((c) => c.user_id === params[0]);
      } else if (params.length > 1 && /WHERE id = \$1 AND user_id = \$2/i.test(trimmed)) {
        res = res.filter((c) => c.id === params[0] && c.user_id === params[1]);
      }
      return res.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    if (/FROM chat_messages/i.test(trimmed)) {
      let res = store.chat_messages;
      if (params.length > 0 && /WHERE conversation_id = \$1/i.test(trimmed)) {
        res = res.filter((m) => m.conversation_id === params[0]);
      }
      return res.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
    }
  }

  // INSERT queries
  if (/^INSERT INTO/i.test(trimmed)) {
    const now = new Date().toISOString();

    if (/INSERT INTO users/i.test(trimmed)) {
      store.users.push({
        id: params[0],
        email: params[1],
        password_hash: params[2],
        full_name: params[3],
        phone_number: params[4],
        preferred_language: params[5],
        created_at: now,
      });
    } else if (/INSERT INTO farms/i.test(trimmed)) {
      store.farms.push({
        id: params[0],
        user_id: params[1],
        farm_name: params[2],
        location_name: params[3],
        latitude: params[4],
        longitude: params[5],
        total_area_hectares: params[6],
        soil_type: params[7],
        irrigation_source: params[8],
        is_organic: params[9],
        created_at: now,
      });
    } else if (/INSERT INTO soil_tests/i.test(trimmed)) {
      store.soil_tests.push({
        id: params[0],
        farm_id: params[1],
        test_date: params[2],
        nitrogen_kg_ha: params[3],
        phosphorus_kg_ha: params[4],
        potassium_kg_ha: params[5],
        ph_level: params[6],
        organic_carbon_pct: params[7],
        ec_ds_m: params[8],
        notes: params[9],
        created_at: now,
      });
    } else if (/INSERT INTO disease_diagnostics/i.test(trimmed)) {
      store.disease_diagnostics.push({
        id: params[0],
        farm_id: params[1],
        crop_name: params[2],
        image_url: params[3],
        diagnosis_name: params[4],
        pathogen_type: params[5],
        confidence_score: params[6],
        severity_level: params[7],
        symptoms_detected: typeof params[8] === 'string' ? JSON.parse(params[8]) : params[8],
        organic_treatments: typeof params[9] === 'string' ? JSON.parse(params[9]) : params[9],
        chemical_treatments: typeof params[10] === 'string' ? JSON.parse(params[10]) : params[10],
        preventive_measures: typeof params[11] === 'string' ? JSON.parse(params[11]) : params[11],
        raw_ai_response: typeof params[12] === 'string' ? JSON.parse(params[12]) : params[12],
        is_resolved: false,
        created_at: now,
      });
    } else if (/INSERT INTO crop_plans/i.test(trimmed)) {
      store.crop_plans.push({
        id: params[0],
        farm_id: params[1],
        season: params[2],
        target_crop: params[3],
        suitability_score: params[4],
        expected_duration_days: params[5],
        expected_yield_per_ha: params[6],
        water_requirement_mm: params[7],
        key_risks: typeof params[8] === 'string' ? JSON.parse(params[8]) : params[8],
        growth_stages: typeof params[9] === 'string' ? JSON.parse(params[9]) : params[9],
        created_at: now,
      });
    } else if (/INSERT INTO fertilizer_prescriptions/i.test(trimmed)) {
      store.fertilizer_prescriptions.push({
        id: params[0],
        farm_id: params[1],
        crop_name: params[2],
        area_hectares: params[3],
        target_n_deficit: params[4],
        target_p_deficit: params[5],
        target_k_deficit: params[6],
        urea_kg_required: params[7],
        dap_kg_required: params[8],
        mop_kg_required: params[9],
        application_splits: typeof params[10] === 'string' ? JSON.parse(params[10]) : params[10],
        created_at: now,
      });
    } else if (/INSERT INTO irrigation_schedules/i.test(trimmed)) {
      store.irrigation_schedules.push({
        id: params[0],
        farm_id: params[1],
        crop_name: params[2],
        schedule_date: params[3],
        irrigation_amount_mm: params[4],
        duration_minutes: params[5],
        weather_summary: params[6],
        spray_feasibility: params[7],
        spray_notes: params[8],
        created_at: now,
      });
    } else if (/INSERT INTO chat_conversations/i.test(trimmed)) {
      store.chat_conversations.push({
        id: params[0],
        user_id: params[1],
        farm_id: params[2],
        title: params[3],
        created_at: now,
      });
    } else if (/INSERT INTO chat_messages/i.test(trimmed)) {
      store.chat_messages.push({
        id: params[0],
        conversation_id: params[1],
        sender_role: params[2],
        content: params[3],
        metadata: typeof params[4] === 'string' ? JSON.parse(params[4]) : params[4],
        created_at: now,
      });
    }

    saveStore();
    return [{ affectedRows: 1 }];
  }

  // UPDATE queries
  if (/^UPDATE/i.test(trimmed)) {
    if (/UPDATE disease_diagnostics SET is_resolved = \$1 WHERE id = \$2/i.test(trimmed)) {
      const item = store.disease_diagnostics.find((d) => d.id === params[1]);
      if (item) {
        item.is_resolved = params[0] === 1 || params[0] === true;
        saveStore();
      }
    }
    return [{ affectedRows: 1 }];
  }

  // DELETE queries
  if (/^DELETE FROM/i.test(trimmed)) {
    if (/DELETE FROM farms WHERE id = \$1/i.test(trimmed)) {
      store.farms = store.farms.filter((f) => f.id !== params[0]);
      store.soil_tests = store.soil_tests.filter((s) => s.farm_id !== params[0]);
      store.disease_diagnostics = store.disease_diagnostics.filter((d) => d.farm_id !== params[0]);
      saveStore();
    }
    return [{ affectedRows: 1 }];
  }

  return [];
}

export async function queryOne(sql: string, params: any[] = []): Promise<any | null> {
  const rows = await query(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export const db = {
  query,
  queryOne,
  generateUUID,
  isPg: false,
};

export default db;

import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/pool.ts';
import { RegisterUserSchema, LoginUserSchema } from '@shared/validators.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function register(req: AuthenticatedRequest, res: Response) {
  const data = RegisterUserSchema.parse(req.body);

  const existing = await db.queryOne(`SELECT id FROM users WHERE email = $1`, [data.email]);
  if (existing) {
    return res.status(400).json({ success: false, error: 'User with this email already exists' });
  }

  const id = db.generateUUID();
  const password_hash = await bcrypt.hash(data.password, 12);

  await db.query(
    `INSERT INTO users (id, email, password_hash, full_name, phone_number, preferred_language)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [id, data.email, password_hash, data.full_name, data.phone_number || null, data.preferred_language]
  );

  const secret = process.env.JWT_SECRET || 'super_secret_agrismart_jwt_token_key_32chars_long_2026';
  const token = jwt.sign({ id, email: data.email, full_name: data.full_name }, secret, { expiresIn: '7d' });

  res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id,
        email: data.email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        preferred_language: data.preferred_language,
      },
    },
  });
}

export async function login(req: AuthenticatedRequest, res: Response) {
  const data = LoginUserSchema.parse(req.body);

  const user = await db.queryOne(`SELECT * FROM users WHERE email = $1`, [data.email]);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const isValid = await bcrypt.compare(data.password, user.password_hash);
  if (!isValid) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const secret = process.env.JWT_SECRET || 'super_secret_agrismart_jwt_token_key_32chars_long_2026';
  const token = jwt.sign({ id: user.id, email: user.email, full_name: user.full_name }, secret, { expiresIn: '7d' });

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        preferred_language: user.preferred_language,
      },
    },
  });
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;
  const user = await db.queryOne(
    `SELECT id, email, full_name, phone_number, preferred_language, created_at FROM users WHERE id = $1`,
    [userId]
  );

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({ success: true, data: user });
}

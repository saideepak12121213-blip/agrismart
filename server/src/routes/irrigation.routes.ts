import { Router } from 'express';
import { getIrrigationSchedule } from '../controllers/irrigation.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/schedule/:farmId', getIrrigationSchedule);

export default router;

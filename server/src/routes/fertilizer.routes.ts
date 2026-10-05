import { Router } from 'express';
import { calculateFertilizer, getFertilizerHistory } from '../controllers/fertilizer.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/calculate', calculateFertilizer);
router.get('/history/:farmId', getFertilizerHistory);

export default router;

import { Router } from 'express';
import { recommendCrops, getCropPlanHistory } from '../controllers/planner.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/recommend', recommendCrops);
router.get('/history/:farmId', getCropPlanHistory);

export default router;

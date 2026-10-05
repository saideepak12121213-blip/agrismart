import { Router } from 'express';
import {
  getFarms,
  createFarm,
  getFarmById,
  deleteFarm,
  getSoilTests,
  createSoilTest,
} from '../controllers/farm.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getFarms);
router.post('/', createFarm);
router.get('/:id', getFarmById);
router.delete('/:id', deleteFarm);

router.get('/:farmId/soil-tests', getSoilTests);
router.post('/:farmId/soil-tests', createSoilTest);

export default router;

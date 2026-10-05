import { Router } from 'express';
import { analyzeCrop, getDiagnosticHistory, toggleDiagnosticResolved } from '../controllers/diagnostic.controller.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authMiddleware);

router.post('/analyze', upload.single('image'), analyzeCrop);
router.get('/history/:farmId', getDiagnosticHistory);
router.patch('/:id/resolve', toggleDiagnosticResolved);

export default router;

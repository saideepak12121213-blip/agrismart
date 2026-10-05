import { Router } from 'express';
import { sendMessage, getConversationHistory, getConversations } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.post('/message', sendMessage);
router.get('/conversations', getConversations);
router.get('/history/:conversationId', getConversationHistory);

export default router;

import { Response } from 'express';
import db from '../db/pool.ts';
import { ChatMessageSchema } from '@shared/validators.ts';
import { chatWithDrAgroService } from '../services/gemini.service.ts';
import { AuthenticatedRequest } from '../middleware/auth.ts';

export async function sendMessage(req: AuthenticatedRequest, res: Response) {
  const data = ChatMessageSchema.parse(req.body);
  const userId = req.user?.id;

  let conversationId = data.conversation_id;

  // Create new conversation if none provided
  if (!conversationId) {
    conversationId = db.generateUUID();
    const title = data.message.length > 40 ? `${data.message.substring(0, 40)}...` : data.message;

    await db.query(
      `INSERT INTO chat_conversations (id, user_id, farm_id, title)
       VALUES ($1, $2, $3, $4)`,
      [conversationId, userId, data.farm_id || null, title]
    );
  }

  // Save User Message
  const userMsgId = db.generateUUID();
  await db.query(
    `INSERT INTO chat_messages (id, conversation_id, sender_role, content, metadata)
     VALUES ($1, $2, 'user', $3, $4)`,
    [userMsgId, conversationId, data.message, JSON.stringify({ language: data.language })]
  );

  // Retrieve farm context
  let farmContext: any = null;
  if (data.farm_id) {
    farmContext = await db.queryOne(`SELECT * FROM farms WHERE id = $1`, [data.farm_id]);
    if (farmContext) {
      farmContext.latest_soil_test = await db.queryOne(
        `SELECT * FROM soil_tests WHERE farm_id = $1 ORDER BY test_date DESC LIMIT 1`,
        [data.farm_id]
      );
    }
  }

  // Retrieve conversation history
  const pastMessages = await db.query(
    `SELECT sender_role as role, content FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [conversationId]
  );

  const formattedMessages = pastMessages.map((m: any) => ({
    role: m.role === 'model' ? ('model' as const) : ('user' as const),
    content: m.content,
  }));

  // Call Gemini Dr. Agro Service
  const botReply = await chatWithDrAgroService(formattedMessages, farmContext, data.language);

  // Save Bot Reply Message
  const botMsgId = db.generateUUID();
  await db.query(
    `INSERT INTO chat_messages (id, conversation_id, sender_role, content, metadata)
     VALUES ($1, $2, 'model', $3, $4)`,
    [botMsgId, conversationId, botReply, JSON.stringify({ language: data.language })]
  );

  res.json({
    success: true,
    data: {
      conversation_id: conversationId,
      user_message: { id: userMsgId, role: 'user', content: data.message },
      bot_message: { id: botMsgId, role: 'model', content: botReply },
    },
  });
}

export async function getConversationHistory(req: AuthenticatedRequest, res: Response) {
  const { conversationId } = req.params;
  const userId = req.user?.id;

  const conv = await db.queryOne(
    `SELECT * FROM chat_conversations WHERE id = $1 AND user_id = $2`,
    [conversationId, userId]
  );

  if (!conv) {
    return res.status(404).json({ success: false, error: 'Conversation thread not found' });
  }

  const messages = await db.query(
    `SELECT * FROM chat_messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
    [conversationId]
  );

  res.json({
    success: true,
    data: {
      conversation: conv,
      messages,
    },
  });
}

export async function getConversations(req: AuthenticatedRequest, res: Response) {
  const userId = req.user?.id;

  const convs = await db.query(
    `SELECT * FROM chat_conversations WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );

  res.json({ success: true, data: convs });
}

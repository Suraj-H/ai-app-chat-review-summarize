import type { Request, Response } from 'express';
import z from 'zod';
import { MAX_PROMPT_LENGTH } from '../config/constants';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required.')
    .max(
      MAX_PROMPT_LENGTH,
      `Prompt is too long (max ${MAX_PROMPT_LENGTH} characters).`
    ),
  conversationId: z.uuid(),
});

export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json(z.treeifyError(parseResult.error));
      return;
    }

    try {
      const { prompt, conversationId } = req.body;

      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ message: response.message });
    } catch (error: any) {
      console.error('Chat service error:', {
        message: error?.message,
        code: error?.code,
        type: error?.type,
        param: error?.param,
      });

      res.status(500).json({ error: 'Failed to generate a response!' });
    }
  },
};

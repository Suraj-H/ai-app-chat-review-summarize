import type { Request, Response } from 'express';
import z from 'zod';
import { MAX_PROMPT_LENGTH } from '../config/constants';
import { ERROR_MESSAGES } from '../config/errors';
import { HTTP_STATUS } from '../config/http';
import { LOG_MESSAGES } from '../config/logging';
import { VALIDATION_MESSAGES } from '../config/validation';
import { chatService } from '../services/chat.service';

const chatSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.PROMPT_REQUIRED)
    .max(
      MAX_PROMPT_LENGTH,
      VALIDATION_MESSAGES.PROMPT_TOO_LONG(MAX_PROMPT_LENGTH)
    ),
  conversationId: z.uuid(),
});

export const chatController = {
  async sendMessage(req: Request, res: Response) {
    const parseResult = chatSchema.safeParse(req.body);

    if (!parseResult.success) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(z.treeifyError(parseResult.error));
      return;
    }

    try {
      const { prompt, conversationId } = req.body;

      const response = await chatService.sendMessage(prompt, conversationId);

      res.json({ message: response.message });
    } catch (error: any) {
      console.error(LOG_MESSAGES.CHAT_SERVICE_ERROR, {
        message: error?.message,
        code: error?.code,
        type: error?.type,
        param: error?.param,
      });

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.FAILED_TO_GENERATE_RESPONSE,
      });
    }
  },
};

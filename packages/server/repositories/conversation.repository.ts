import { prisma } from './prisma';

export const conversationRepository = {
  async getLastResponseId(conversationId: string): Promise<string | null> {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { lastResponseId: true },
    });
    return conversation?.lastResponseId ?? null;
  },

  async setLastResponseId(
    conversationId: string,
    responseId: string
  ): Promise<void> {
    await prisma.conversation.upsert({
      where: { id: conversationId },
      update: { lastResponseId: responseId },
      create: { id: conversationId, lastResponseId: responseId },
    });
  },
};

import OpenAI from 'openai';
import { DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '../config/constants';
import { env } from '../config/env';
import { DEFAULT_LLM_MODEL } from '../config/llm';
import { TEMPLATE_PLACEHOLDERS } from '../config/templates';
import template from '../llm/prompts/chatbot.prompt.txt';
import { conversationRepository } from '../repositories/conversation.repository';

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

let instructionsCache: string | null = null;

async function getInstructions(): Promise<string> {
  if (instructionsCache) return instructionsCache;

  const parkInfoFile = Bun.file(
    `${import.meta.dir}/../llm/prompts/wonderworld.md`
  );
  const parkInfo = await parkInfoFile.text();
  instructionsCache = template.replace(
    TEMPLATE_PLACEHOLDERS.PARK_INFO,
    parkInfo
  );
  return instructionsCache;
}

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const previousResponseId =
      await conversationRepository.getLastResponseId(conversationId);

    const instructions = await getInstructions();

    const response = await client.responses.create({
      model: DEFAULT_LLM_MODEL,
      input: prompt,
      instructions: instructions,
      previous_response_id: previousResponseId,
      temperature: DEFAULT_TEMPERATURE,
      max_output_tokens: DEFAULT_MAX_TOKENS,
    });

    const message = response.output_text ?? '';
    const responseId = response.id;

    await conversationRepository.setLastResponseId(conversationId, responseId);

    return {
      id: responseId,
      message,
    };
  },
};

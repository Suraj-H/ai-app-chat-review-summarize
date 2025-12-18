import { DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '../config/constants';
import { env } from '../config/env';
import OpenAI from 'openai';
import template from '../llm/prompts/chatbot.prompt.txt';
import { conversationRepository } from '../repositories/conversation.repository';

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

// Lazy load park info using Bun's native file API
let instructionsCache: string | null = null;

async function getInstructions(): Promise<string> {
  if (instructionsCache) return instructionsCache;

  const parkInfoFile = Bun.file(
    `${import.meta.dir}/../llm/prompts/wonderworld.md`
  );
  const parkInfo = await parkInfoFile.text();
  instructionsCache = template.replace('{{parkInfo}}', parkInfo);
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
    // Get previous response ID from database for conversation continuity
    const previousResponseId =
      await conversationRepository.getLastResponseId(conversationId);

    const instructions = await getInstructions();

    // Using new Responses API with built-in conversation continuity
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      instructions: instructions,
      previous_response_id: previousResponseId,
      temperature: DEFAULT_TEMPERATURE,
      max_output_tokens: DEFAULT_MAX_TOKENS,
    });

    const message = response.output_text ?? '';
    const responseId = response.id;

    // Store conversation state in database for next request
    await conversationRepository.setLastResponseId(conversationId, responseId);

    return {
      id: responseId,
      message,
    };
  },
};

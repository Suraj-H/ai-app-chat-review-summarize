import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';
import template from '../llm/prompts/chatbot.prompt.txt';
import { conversationRepository } from '../repositories/conversation.repository';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const parkInfo = fs.readFileSync(
  path.join(__dirname, '..', 'llm/prompts', 'wonderworld.md'),
  'utf8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
  id: string;
  message: string;
};

export const chatService = {
  async sendMessage(
    prompt: string,
    conversationId: string
  ): Promise<ChatResponse> {
    const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      instructions: instructions,
      temperature: 0.2,
      max_output_tokens: 50,
      previous_response_id:
        conversationRepository.getLastResponseId(conversationId),
    });

    conversationRepository.setLastResponseId(conversationId, response.id);

    return {
      id: response.id,
      message: response.output_text,
    };
  },
};

import { InferenceClient } from '@huggingface/inference';
import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '../config/constants';
import { env } from '../config/env';
import summarizePrompt from './prompts/summarize.txt';

const ollamaClient = new Ollama();

const openAIClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const inferenceClient = new InferenceClient(env.HF_TOKEN);

type GenerateTextOptions = {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  instructions?: string;
  previousResponseId?: string;
};

type GenerateTextResponse = {
  id: string;
  text: string;
};

export const llmClient = {
  async generateText({
    prompt,
    temperature = DEFAULT_TEMPERATURE,
    maxTokens = DEFAULT_MAX_TOKENS,
    model = 'gpt-4o-mini',
    instructions,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResponse> {
    // Using new Responses API (superset of Chat Completions)
    // Benefits: Built-in conversation continuity, simpler API, better state management
    const response = await openAIClient.responses.create({
      model,
      input: prompt,
      instructions: instructions,
      previous_response_id: previousResponseId,
      temperature,
      max_output_tokens: maxTokens,
    });

    return {
      id: response.id,
      text: response.output_text ?? '',
    };
  },

  async summarize(text: string): Promise<string> {
    const output = await inferenceClient.chatCompletion({
      model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
      messages: [
        {
          role: 'system',
          content: summarizePrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });
    return output?.choices[0]?.message.content ?? '';
  },

  async summarizeWithOllama(text: string): Promise<string> {
    const response = await ollamaClient.chat({
      model: 'llama3.1',
      messages: [
        {
          role: 'system',
          content: summarizePrompt,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });
    return response.message.content ?? '';
  },
};

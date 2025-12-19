import { InferenceClient } from '@huggingface/inference';
import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE } from '../config/constants';
import { env } from '../config/env';
import { DEFAULT_LLM_MODEL, LLM_MODELS, LLMRole } from '../config/llm';
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
    model = DEFAULT_LLM_MODEL,
    instructions,
    previousResponseId,
  }: GenerateTextOptions): Promise<GenerateTextResponse> {
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
      model: LLM_MODELS.META_LLAMA_3_1_8B,
      messages: [
        {
          role: LLMRole.SYSTEM,
          content: summarizePrompt,
        },
        {
          role: LLMRole.USER,
          content: text,
        },
      ],
    });
    return output?.choices[0]?.message.content ?? '';
  },

  async summarizeWithOllama(text: string): Promise<string> {
    const response = await ollamaClient.chat({
      model: LLM_MODELS.LLAMA_3_1,
      messages: [
        {
          role: LLMRole.SYSTEM,
          content: summarizePrompt,
        },
        {
          role: LLMRole.USER,
          content: text,
        },
      ],
    });
    return response.message.content ?? '';
  },
};

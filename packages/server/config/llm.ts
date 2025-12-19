export const LLM_MODELS = {
  GPT_4O_MINI: 'gpt-4o-mini',
  META_LLAMA_3_1_8B: 'meta-llama/Llama-3.1-8B-Instruct:novita',
  LLAMA_3_1: 'llama3.1',
} as const;

export enum LLMRole {
  SYSTEM = 'system',
  USER = 'user',
}

export const DEFAULT_LLM_MODEL = LLM_MODELS.GPT_4O_MINI;

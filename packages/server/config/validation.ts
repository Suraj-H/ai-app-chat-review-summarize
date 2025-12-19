export const VALIDATION_MESSAGES = {
  PROMPT_REQUIRED: 'Prompt is required.',
  PROMPT_TOO_LONG: (maxLength: number) =>
    `Prompt is too long (max ${maxLength} characters).`,

  DATABASE_URL_INVALID: 'DATABASE_URL must be a valid URL',
  OPENAI_API_KEY_REQUIRED: 'OPENAI_API_KEY is required',
} as const;

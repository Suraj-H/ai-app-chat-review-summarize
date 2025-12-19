import { z, ZodError } from 'zod';
import { LOG_MESSAGES, LOGGING_CONSTANTS } from './logging';
import { VALIDATION_MESSAGES } from './validation';

const envSchema = z.object({
  DATABASE_URL: z.url(VALIDATION_MESSAGES.DATABASE_URL_INVALID),
  OPENAI_API_KEY: z
    .string()
    .min(1, VALIDATION_MESSAGES.OPENAI_API_KEY_REQUIRED),
  PORT: z
    .string()
    .optional()
    .default('3000')
    .transform((val) => Number.parseInt(val, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development'),
  HF_TOKEN: z.string().optional(),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error(LOG_MESSAGES.ENV_VALIDATION_FAILED);
    for (const issue of error.issues) {
      const path =
        issue.path.length > 0
          ? issue.path.join('.')
          : LOGGING_CONSTANTS.ROOT_PATH;
      console.error(`  - ${path}: ${issue.message}`);
    }
    process.exit(1);
  }
  throw error;
}

export { env };

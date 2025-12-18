import { z, ZodError } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url('DATABASE_URL must be a valid URL'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
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
    console.error('❌ Environment variable validation failed:');
    for (const issue of error.issues) {
      const path = issue.path.length > 0 ? issue.path.join('.') : 'root';
      console.error(`  - ${path}: ${issue.message}`);
    }
    process.exit(1);
  }
  throw error;
}

export { env };

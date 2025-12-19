/**
 * Application constants
 *
 * For domain-specific constants, see:
 * - config/errors.ts - Error messages and codes
 * - config/http.ts - HTTP status codes and methods
 * - config/routes.ts - API route paths
 * - config/llm.ts - LLM models and roles
 * - config/logging.ts - Log messages and levels
 * - config/validation.ts - Validation messages
 * - config/templates.ts - Template placeholders
 */

export const REVIEW_LIMIT = 10;
export const SUMMARY_EXPIRY_DAYS = 7;

export const MAX_PROMPT_LENGTH = 1000;
export const DEFAULT_MAX_TOKENS = 50;
export const DEFAULT_TEMPERATURE = 0.2;

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

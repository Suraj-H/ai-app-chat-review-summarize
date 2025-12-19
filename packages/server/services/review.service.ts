import { REVIEW_LIMIT, SUMMARY_EXPIRY_DAYS } from '../config/constants';
import { DEFAULT_LLM_MODEL } from '../config/llm';
import { TEMPLATE_PLACEHOLDERS } from '../config/templates';
import type { Review } from '../generated/prisma';
import { llmClient } from '../llm/client';
import summarizeReviewsPromptTemplate from '../llm/prompts/summarize-reviews.txt';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
  async getReviews(productId: number): Promise<Review[]> {
    return reviewRepository.getReviews(productId);
  },

  async summarizeReviews(productId: number): Promise<string | null> {
    const existingSummary = await this.getReviewSummary(productId);

    if (existingSummary) {
      return existingSummary;
    }

    const reviews = await reviewRepository.getReviews(productId, REVIEW_LIMIT);

    if (reviews.length === 0) {
      return null;
    }

    const reviewsText = reviews.map((review) => review.content).join('\n\n');

    const prompt = summarizeReviewsPromptTemplate.replace(
      TEMPLATE_PLACEHOLDERS.REVIEWS,
      reviewsText
    );

    // summarize with OpenAI LLM
    const { text: summary } = await llmClient.generateText({
      prompt,
      model: DEFAULT_LLM_MODEL,
    });

    // summarize with Hugging Face InferenceClient LLM
    // const summary = await llmClient.summarize(reviewsText);

    // summarize with Ollama LLM
    // const summary = await llmClient.summarizeWithOllama(reviewsText);

    await reviewRepository.storeReviewSummary(
      productId,
      summary,
      SUMMARY_EXPIRY_DAYS
    );

    return summary;
  },

  async getReviewSummary(productId: number): Promise<string | null> {
    return reviewRepository.getReviewSummary(productId);
  },
};

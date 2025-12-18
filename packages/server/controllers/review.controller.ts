import type { Request, Response } from 'express';
import z from 'zod';
import { productRepository } from '../repositories/product.repository';
import { reviewService } from '../services/review.service';

const reviewSchema = z.object({
  productId: z.string().transform(Number),
});

export const reviewController = {
  async getReviewsWithSummary(req: Request, res: Response) {
    const parseResult = reviewSchema.safeParse(req.params);

    if (!parseResult.success) {
      res.status(400).json(z.treeifyError(parseResult.error));
      return;
    }

    const { productId } = parseResult.data;

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product.' });
      return;
    }

    const product = await productRepository.getProduct(productId);

    if (!product) {
      res.status(400).json({ error: 'Invalid product.' });
      return;
    }

    try {
      const reviews = await reviewService.getReviews(productId);
      const summary = await reviewService.getReviewSummary(productId);
      res.json({ summary, reviews });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get reviews!' });
    }
  },

  async summarizeReviews(req: Request, res: Response) {
    const parseResult = reviewSchema.safeParse(req.params);

    if (!parseResult.success) {
      res.status(400).json(z.treeifyError(parseResult.error));
      return;
    }

    const { productId } = parseResult.data;

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product.' });
      return;
    }

    const product = await productRepository.getProduct(productId);

    if (!product) {
      res.status(400).json({ error: 'Invalid product.' });
      return;
    }

    try {
      const summary = await reviewService.summarizeReviews(productId);

      if (!summary) {
        res.status(400).json({
          error: 'There are no reviews for this product to summarize.',
        });
        return;
      }

      res.json({ summary });
    } catch (error) {
      res.status(500).json({ error: 'Failed to summarize reviews!' });
    }
  },
};

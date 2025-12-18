import type { Request, Response } from 'express';
import z from 'zod';
import { reviewService } from '../services/review.service';

const reviewSchema = z.object({
  productId: z.string().transform(Number),
});

export const reviewController = {
  async getReviews(req: Request, res: Response) {
    const parseResult = reviewSchema.safeParse(req.params);

    if (!parseResult.success) {
      res.status(400).json(z.treeifyError(parseResult.error));
      return;
    }

    const { productId } = parseResult.data;

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID.' });
      return;
    }

    try {
      const reviews = await reviewService.getReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get reviews!' });
    }
  },
};

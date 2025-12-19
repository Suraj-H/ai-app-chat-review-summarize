import type { Request, Response } from 'express';
import z from 'zod';
import { ERROR_MESSAGES } from '../config/errors';
import { HTTP_STATUS } from '../config/http';
import { productRepository } from '../repositories/product.repository';
import { reviewService } from '../services/review.service';

const reviewSchema = z.object({
  productId: z.string().transform(Number),
});

export const reviewController = {
  async getReviewsWithSummary(req: Request, res: Response) {
    const parseResult = reviewSchema.safeParse(req.params);

    if (!parseResult.success) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(z.treeifyError(parseResult.error));
      return;
    }

    const { productId } = parseResult.data;

    if (isNaN(productId)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.INVALID_PRODUCT,
      });
      return;
    }

    const product = await productRepository.getProduct(productId);

    if (!product) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.INVALID_PRODUCT,
      });
      return;
    }

    try {
      const reviews = await reviewService.getReviews(productId);
      const summary = await reviewService.getReviewSummary(productId);
      res.json({ summary, reviews });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.FAILED_TO_GET_REVIEWS,
      });
    }
  },

  async summarizeReviews(req: Request, res: Response) {
    const parseResult = reviewSchema.safeParse(req.params);

    if (!parseResult.success) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(z.treeifyError(parseResult.error));
      return;
    }

    const { productId } = parseResult.data;

    if (isNaN(productId)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.INVALID_PRODUCT,
      });
      return;
    }

    const product = await productRepository.getProduct(productId);

    if (!product) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERROR_MESSAGES.INVALID_PRODUCT,
      });
      return;
    }

    try {
      const summary = await reviewService.summarizeReviews(productId);

      if (!summary) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ERROR_MESSAGES.NO_REVIEWS_TO_SUMMARIZE,
        });
        return;
      }

      res.json({ summary });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        error: ERROR_MESSAGES.FAILED_TO_SUMMARIZE_REVIEWS,
      });
    }
  },
};

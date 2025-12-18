import express from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

router.post('/api/chat', chatController.sendMessage);

router.get(
  '/api/products/:productId/reviews',
  reviewController.getReviewsWithSummary
);

router.post(
  '/api/products/:productId/reviews/summarize',
  reviewController.summarizeReviews
);

export default router;

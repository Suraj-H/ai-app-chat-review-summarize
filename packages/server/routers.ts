import express from 'express';
import { HTTP_STATUS } from './config/http';
import { ROUTES } from './config/routes';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

router.get(ROUTES.HEALTH, (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.post(ROUTES.CHAT, chatController.sendMessage);

router.get(
  ROUTES.PRODUCTS.REVIEWS(':productId'),
  reviewController.getReviewsWithSummary
);

router.post(
  ROUTES.PRODUCTS.SUMMARIZE_REVIEWS(':productId'),
  reviewController.summarizeReviews
);

export default router;

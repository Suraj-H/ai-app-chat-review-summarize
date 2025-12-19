export const ROUTES = {
  API: '/api',

  CHAT: '/api/chat',

  PRODUCTS: {
    BASE: '/api/products',
    REVIEWS: (productId: string | number) =>
      `/api/products/${productId}/reviews`,
    SUMMARIZE_REVIEWS: (productId: string | number) =>
      `/api/products/${productId}/reviews/summarize`,
  },

  HEALTH: '/health',
} as const;

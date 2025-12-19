import dotenv from 'dotenv';
import express from 'express';
import { env } from './config/env';
import { LOG_MESSAGES } from './config/logging';
import { ROUTES } from './config/routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { rateLimitMiddleware } from './middleware/rateLimit';
import router from './routers';
import { setupGracefulShutdown } from './utils/shutdown';

dotenv.config();

const app = express();

app.use(requestLogger);
app.use(ROUTES.API, rateLimitMiddleware);
app.use(express.json());
app.use(router);

app.use(errorHandler);

const port = env.PORT;

const server = app.listen(port, () => {
  console.log(LOG_MESSAGES.SERVER_RUNNING(port));
});

setupGracefulShutdown(server);

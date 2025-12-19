# 🤖 AI App API

A modern, production-ready RESTful API for AI-powered chat and product review management. Built with **Bun**, **Express.js 5**, **Prisma ORM**, and **PostgreSQL**, featuring OpenAI integration, conversation continuity, and intelligent review summarization.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Security Features](#-security-features)
- [Error Handling](#-error-handling)
- [Testing](#-testing)
- [Postman Collection](#-postman-collection)
- [Development](#-development)
- [Production Deployment](#-production-deployment)

## ✨ Features

### Core Functionality
- **AI Chat Assistant**: Interactive chat with conversation continuity using OpenAI Responses API
- **Product Review Management**: Retrieve and manage product reviews
- **AI-Powered Review Summarization**: Automatically generate summaries of product reviews using OpenAI
- **Review Summary Caching**: Intelligent caching with 7-day expiration to reduce API costs
- **Health Check Endpoint**: Server health monitoring

### Technical Features
- **Bun Runtime**: Ultra-fast JavaScript runtime with native TypeScript support
- **Express.js 5**: Modern web framework with native async/await error handling
- **Prisma ORM**: Type-safe database access with PostgreSQL
- **Repository Pattern**: Clean separation of data access logic
- **Service Layer**: Business logic abstraction
- **Input Validation**: Comprehensive request validation using Zod
- **Error Handling**: Centralized error handling with Prisma-specific error mapping
- **Rate Limiting**: API protection with express-rate-limit (100 requests per 15 minutes)
- **Request Logging**: Structured logging with Morgan (development: concise, production: JSON)
- **Graceful Shutdown**: Proper cleanup of database connections and HTTP server
- **Constants & Enums**: Type-safe constants and enums for maintainability
- **Environment Validation**: Zod-based environment variable validation on startup

## 🛠 Tech Stack

### Runtime & Framework
- **Bun 1.2.21+**: Fast all-in-one JavaScript runtime with native TypeScript support
- **Express.js 5.1.0**: Modern web framework with native async/await error handling
- **TypeScript 5+**: Type-safe development

### Database
- **PostgreSQL**: Relational database
- **Prisma 6.15.0**: Next-generation ORM with type safety
- **Prisma Migrations**: Version-controlled database schema changes

### AI & LLM Integration
- **OpenAI 5.16.0**: OpenAI Responses API for chat and summarization
- **Hugging Face Inference** (optional): Alternative LLM provider
- **Ollama** (optional): Local LLM support

### Validation & Security
- **Zod 4.1.5**: Schema validation and type inference
- **express-rate-limit 8.2.1**: Rate limiting middleware
- **Input Sanitization**: Automatic input validation and sanitization

### Utilities
- **Morgan 1.10.1**: HTTP request logger
- **dotenv 17.2.1**: Environment variable management (Bun auto-loads, but included for compatibility)

### Development Tools
- **Bun Test Runner**: Built-in testing framework (Jest-compatible API)
- **TypeScript**: Native TypeScript support (no transpilation needed)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** >= 1.2.21 ([Installation Guide](https://bun.sh/docs/installation))
- **PostgreSQL** >= 12.0 (local installation or cloud database)
- **OpenAI API Key** ([Get your API key](https://platform.openai.com/api-keys))
- **Git** (for cloning the repository)

### Optional
- **Hugging Face Token** (for alternative LLM provider)
- **Ollama** (for local LLM support)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-app
```

### 2. Install Dependencies

```bash
# Install all dependencies (workspace-aware)
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in `packages/server/` directory:

```bash
cd packages/server
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai_app?schema=public"

# OpenAI API
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Server Configuration
PORT=3000
NODE_ENV=development

# Optional: Hugging Face (for alternative LLM)
HF_TOKEN="your-huggingface-token-here"
```

**Important:**
- Use a valid PostgreSQL connection string for `DATABASE_URL`
- Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- `HF_TOKEN` is optional (only needed for Hugging Face LLM)

### 4. Set Up Database

**Run Prisma migrations:**

```bash
cd packages/server
bun prisma migrate dev
```

This will:
- Create the database schema
- Generate Prisma Client
- Apply all migrations

**Generate Prisma Client** (if needed):

```bash
bun prisma generate
```

### 5. Run the Application

**Development Mode** (with hot reload):

```bash
cd packages/server
bun run dev
```

**Production Mode**:

```bash
cd packages/server
bun run start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key for chat and summarization | Yes | - |
| `PORT` | Server port | No | `3000` |
| `NODE_ENV` | Environment (development/production/test) | No | `development` |
| `HF_TOKEN` | Hugging Face API token (optional) | No | - |

### Configuration Files

The project uses a modular configuration structure:

- `config/env.ts`: Environment variable validation with Zod
- `config/constants.ts`: Application constants (limits, defaults)
- `config/errors.ts`: Error messages and error codes
- `config/http.ts`: HTTP status codes and methods
- `config/routes.ts`: API route paths
- `config/llm.ts`: LLM model names and roles
- `config/logging.ts`: Log messages and Prisma log levels
- `config/validation.ts`: Validation messages
- `config/templates.ts`: Template placeholders

## 📚 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

**No authentication required** - All endpoints are publicly accessible. Rate limiting is applied to prevent abuse.

---

## 💬 Chat Endpoints

### `POST /api/chat`

**Send a chat message to the AI assistant**

**Request Body:**
```json
{
  "prompt": "What attractions are available at WonderWorld?",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `200 OK`
```json
{
  "message": "WonderWorld offers various attractions including..."
}
```

**Validation:**
- `prompt`: String, 1-1000 characters, required
- `conversationId`: Valid UUID, required

**Features:**
- **Conversation Continuity**: Use the same `conversationId` across multiple messages to maintain context
- **New Conversations**: Generate a new UUID for each new conversation
- **Context Management**: Automatically tracks conversation state using OpenAI Responses API
- **Custom Instructions**: Uses WonderWorld theme park information for context-aware responses

**Error Responses:**
- `400 Bad Request`: Validation error (invalid prompt length, invalid UUID format)
- `500 Internal Server Error`: Failed to generate response

**Example Flow:**
```bash
# First message (new conversation)
POST /api/chat
{
  "prompt": "What attractions are available?",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000"
}

# Follow-up message (same conversation)
POST /api/chat
{
  "prompt": "Tell me more about the rides",
  "conversationId": "550e8400-e29b-41d4-a716-446655440000"  # Same ID
}
```

---

## 📦 Product Review Endpoints

### `GET /api/products/:productId/reviews`

**Get all reviews for a product with summary**

**Parameters:**
- `productId`: Integer (product ID)

**Response:** `200 OK`
```json
{
  "summary": "Customers love the product quality and fast shipping...",
  "reviews": [
    {
      "id": 1,
      "author": "John Doe",
      "rating": 5,
      "content": "Great product!",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "productId": 1
    }
  ]
}
```

**Features:**
- Returns reviews sorted by creation date (newest first)
- Includes summary if available and not expired (7-day cache)
- Summary will be `null` if not available or expired
- Validates product exists before returning reviews

**Error Responses:**
- `400 Bad Request`: Invalid product ID or product not found
- `500 Internal Server Error`: Failed to get reviews

---

### `POST /api/products/:productId/reviews/summarize`

**Generate or refresh review summary using AI**

**Parameters:**
- `productId`: Integer (product ID)

**Request Body:** Empty (no body required)

**Response:** `200 OK`
```json
{
  "summary": "Based on the latest reviews, customers appreciate..."
}
```

**Features:**
- **Intelligent Caching**: Returns cached summary if valid (not expired)
- **Auto-Generation**: Generates new summary if cache expired or missing
- **Review Limit**: Uses latest 10 reviews for summarization
- **Cache Duration**: Summaries cached for 7 days
- **Cost Optimization**: Reduces OpenAI API calls through caching

**Business Logic:**
1. Checks for existing valid summary (not expired)
2. If found, returns cached summary
3. If not found or expired:
   - Fetches latest 10 reviews
   - Generates summary using OpenAI
   - Stores summary with 7-day expiration
   - Returns new summary

**Error Responses:**
- `400 Bad Request`: Invalid product ID, product not found, or no reviews to summarize
- `500 Internal Server Error`: Failed to summarize reviews

---

## 🏥 Health Check Endpoint

### `GET /health`

**Check server health status**

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Features:**
- No authentication required
- Excluded from rate limiting
- Excluded from request logging
- Useful for load balancers and monitoring tools

---

## 📁 Project Structure

```
ai-app/
├── packages/
│   └── server/                      # Server package
│       ├── config/                  # Configuration files
│       │   ├── constants.ts        # Application constants
│       │   ├── env.ts              # Environment variable validation
│       │   ├── errors.ts           # Error messages and codes
│       │   ├── http.ts             # HTTP status codes and methods
│       │   ├── llm.ts              # LLM models and roles
│       │   ├── logging.ts          # Log messages and levels
│       │   ├── routes.ts           # API route paths
│       │   ├── templates.ts        # Template placeholders
│       │   └── validation.ts       # Validation messages
│       ├── controllers/            # Request/response handlers
│       │   ├── chat.controller.ts  # Chat endpoint controller
│       │   └── review.controller.ts # Review endpoint controller
│       ├── services/               # Business logic layer
│       │   ├── chat.service.ts     # Chat business logic
│       │   └── review.service.ts   # Review business logic
│       ├── repositories/           # Data access layer
│       │   ├── prisma.ts           # Prisma Client singleton
│       │   ├── conversation.repository.ts # Conversation data access
│       │   ├── product.repository.ts     # Product data access
│       │   └── review.repository.ts      # Review data access
│       ├── llm/                    # LLM integration
│       │   ├── client.ts           # Unified LLM client (OpenAI, HF, Ollama)
│       │   └── prompts/            # Prompt templates
│       │       ├── chatbot.prompt.txt
│       │       ├── summarize-reviews.txt
│       │       ├── summarize.txt
│       │       └── wonderworld.md
│       ├── middleware/             # Express middleware
│       │   ├── errorHandler.ts     # Centralized error handling
│       │   ├── logger.ts           # Request logging (Morgan)
│       │   └── rateLimit.ts        # Rate limiting
│       ├── prisma/                 # Prisma schema and migrations
│       │   ├── schema.prisma       # Database schema
│       │   └── migrations/         # Database migrations
│       ├── utils/                  # Utility functions
│       │   └── shutdown.ts         # Graceful shutdown handler
│       ├── generated/              # Generated Prisma Client (auto-generated)
│       ├── index.ts                # Application entry point
│       ├── routers.ts              # Route definitions
│       ├── package.json
│       └── tsconfig.json
├── test-api.js                     # Manual API testing script
├── AI_App_API.postman_collection.json # Postman collection
├── package.json                    # Root package (workspaces)
└── README.md                       # This file
```

## 🏗 Architecture

### Layered Architecture

The project follows a clean, layered architecture:

```
HTTP Request
    ↓
Router (routers.ts)
    ↓
Controller (controllers/)
    ↓
Service (services/)
    ↓
Repository (repositories/)
    ↓
Prisma Client (generated/prisma/)
    ↓
PostgreSQL Database
```

### Design Patterns

1. **Repository Pattern**: All database access through repositories
   - Single Prisma Client instance (singleton pattern)
   - No direct Prisma Client usage in services
   - Type-safe data access

2. **Service Layer**: Business logic separation
   - Services orchestrate business operations
   - Services use repositories (never Prisma directly)
   - Reusable business logic

3. **Controller Layer**: HTTP request/response handling
   - Thin controllers delegate to services
   - Input validation using Zod
   - Error handling and status codes

4. **Constants & Enums**: Type-safe configuration
   - Domain-specific constants in separate files
   - Enums for fixed value sets
   - Single source of truth

### Key Principles

- **Single Responsibility**: Each file/class does one thing
- **Dependency Injection**: Services depend on repositories
- **Type Safety**: Full TypeScript coverage with Prisma types
- **Error Handling**: Centralized error handling middleware
- **Validation**: Zod schemas for all inputs
- **Separation of Concerns**: Clear boundaries between layers

## 🔒 Security Features

### Input Validation
- **Zod Validation**: Comprehensive request body and parameter validation
- **Type Safety**: TypeScript + Prisma types prevent type errors
- **Input Sanitization**: Automatic trimming and validation

### Rate Limiting
- **express-rate-limit**: 100 requests per 15 minutes per IP
- **IPv6 Support**: Proper IPv6 address handling with `ipKeyGenerator`
- **Health Check Exclusion**: Health endpoint excluded from rate limiting

### Error Handling
- **Generic Error Messages**: Prevents information leakage
- **Prisma Error Mapping**: Specific error codes for database errors
- **No Stack Traces**: Stack traces only in development mode

### Best Practices
- **Environment Variables**: Sensitive data in environment variables
- **No Hardcoded Secrets**: All secrets in `.env` file
- **Parameterized Queries**: Prisma uses parameterized queries (SQL injection protection)
- **Graceful Shutdown**: Proper cleanup of connections

## ⚠️ Error Handling

### Error Response Format

All errors follow a consistent format:

**400 Bad Request** (Validation Errors)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["prompt"],
      "message": "Prompt is required."
    }
  ]
}
```

**400 Bad Request** (Business Logic Errors)
```json
{
  "error": "Invalid product."
}
```

**404 Not Found** (Route Not Found)
```json
{
  "error": "Route not found"
}
```

**409 Conflict** (Prisma Unique Constraint)
```json
{
  "error": "Resource already exists",
  "code": "UNIQUE_CONSTRAINT_VIOLATION"
}
```

**429 Too Many Requests** (Rate Limit)
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Maximum 100 requests per 15 minutes.",
  "retryAfter": 900
}
```

**500 Internal Server Error** (Server Errors)
```json
{
  "error": "Internal server error"
}
```

### Prisma Error Codes

The error handler maps Prisma error codes to HTTP status codes:

- `P2002`: Unique constraint violation → `409 Conflict`
- `P2025`: Record not found → `404 Not Found`
- `P2003`: Foreign key constraint → `400 Bad Request`
- Other Prisma errors → `500 Internal Server Error`

### Error Logging

- **Development**: Full error details with stack traces
- **Production**: Generic error messages, detailed logs server-side only
- **Structured Logging**: Morgan logger for request/response logging

## 🧪 Testing

### Manual Testing

Use the provided `test-api.js` script for manual API testing:

```bash
# Make sure server is running first
cd packages/server && bun run dev

# In another terminal, run tests
node test-api.js
```

The test script covers:
- Health check endpoint
- Chat endpoint (valid and invalid inputs)
- Conversation continuity
- Review endpoints (valid and invalid inputs)
- Validation error handling
- Error response handling

### Test Coverage

The test script includes:
- ✅ Health check
- ✅ Chat message sending
- ✅ Conversation continuity
- ✅ Validation errors (empty prompt, too long, invalid UUID)
- ✅ Review retrieval
- ✅ Review summarization
- ✅ Invalid product ID handling
- ✅ Missing required fields
- ✅ Invalid endpoint (404)

## 📮 Postman Collection

A complete Postman collection is included: `AI_App_API.postman_collection.json`

### Features

- **Auto-save Variables**: Automatically saves conversation IDs and response data
- **Collection Variables**: Pre-configured variables for baseUrl, conversationId, productId
- **Request Examples**: Sample request bodies for all endpoints
- **Documentation**: Detailed descriptions for each endpoint
- **Test Scripts**: Automatic variable saving on successful responses

### Import Instructions

1. Open Postman
2. Click **Import** button
3. Select `AI_App_API.postman_collection.json`
4. Collection will be imported with all endpoints organized by resource

### Collection Variables

- `baseUrl`: API base URL (default: `http://localhost:3000`)
- `conversationId`: UUID for conversation context (generate new UUID for new conversations)
- `productId`: Product ID (integer, update with valid product ID)
- `lastMessage`: Last chat response (auto-populated)
- `lastSummary`: Last generated summary (auto-populated)
- `reviewCount`: Number of reviews (auto-populated)

### Usage Flow

1. **Health Check**: Verify server is running
2. **Chat**: Start a conversation with a new UUID
3. **Continue Chat**: Use same conversationId for context
4. **Get Reviews**: Retrieve reviews for a product
5. **Summarize Reviews**: Generate AI summary of reviews

## 💻 Development

### Development Scripts

```bash
# Start development server with hot reload
cd packages/server
bun run dev

# Start production server
bun run start

# Run Prisma migrations
bun prisma migrate dev

# Generate Prisma Client
bun prisma generate

# Open Prisma Studio (database GUI)
bun prisma studio
```

### Code Style

- **TypeScript**: Strict type checking
- **ES Modules**: Use `import`/`export` (not `require`/`module.exports`)
- **Async/Await**: Express 5 native async/await error handling (no wrapper needed)
- **Constants**: Use constants from `config/` files (no magic strings)
- **Repository Pattern**: Always use repositories, never Prisma Client directly in services

### Adding New Features

1. **Create Repository**: Add data access methods in `repositories/`
2. **Create Service**: Add business logic in `services/`
3. **Create Controller**: Add HTTP handlers in `controllers/`
4. **Add Route**: Register route in `routers.ts`
5. **Add Constants**: Extract strings to `config/` files
6. **Add Validation**: Create Zod schema in controller
7. **Update Schema**: Add Prisma model if needed, run migrations

### Database Migrations

```bash
# Create a new migration
bun prisma migrate dev --name descriptive_name

# Apply migrations in production
bun prisma migrate deploy

# Reset database (development only)
bun prisma migrate reset
```

### Prisma Best Practices

- **Singleton Pattern**: Single Prisma Client instance (in `repositories/prisma.ts`)
- **Repository Pattern**: All database access through repositories
- **Query Optimization**: Use `select`, `include`, pagination
- **Indexes**: Define indexes in schema for frequently queried fields
- **Transactions**: Use `prisma.$transaction()` for multi-step operations

## 🚀 Production Deployment

### Environment Setup

1. Set production environment variables
2. Use strong database connection string
3. Configure OpenAI API key
4. Enable production logging
5. Set up process manager (PM2, systemd, etc.)

### Recommended Practices

- Use managed PostgreSQL service (AWS RDS, Supabase, Neon, etc.)
- Enable PostgreSQL connection pooling
- Use environment-specific configuration
- Set up monitoring and alerting
- Configure reverse proxy (Nginx, Caddy)
- Enable HTTPS/SSL
- Set up backup strategy
- Monitor rate limiting metrics
- Enable structured logging
- Use Bun's production optimizations

### Performance Optimization

- **Bun Runtime**: Leverage Bun's faster execution
- **Prisma Connection Pooling**: Automatic with singleton pattern
- **Query Optimization**: Use `select` to fetch only needed fields
- **Index Usage**: Ensure database indexes are used
- **Caching**: Review summaries cached for 7 days
- **Rate Limiting**: Prevents abuse and ensures fair usage

### Database Considerations

- **Connection Pooling**: Prisma manages connection pooling automatically
- **Indexes**: All frequently queried fields are indexed
- **Migrations**: Use `bun prisma migrate deploy` for production
- **Backups**: Set up regular database backups
- **Monitoring**: Monitor query performance and connection pool usage

## 📝 API Workflow Examples

### Chat Conversation Flow

1. **Start New Conversation**
   ```bash
   POST /api/chat
   {
     "prompt": "What attractions are available?",
     "conversationId": "550e8400-e29b-41d4-a716-446655440000"  # New UUID
   }
   # Returns: { "message": "..." }
   ```

2. **Continue Conversation**
   ```bash
   POST /api/chat
   {
     "prompt": "Tell me more about the rides",
     "conversationId": "550e8400-e29b-41d4-a716-446655440000"  # Same UUID
   }
   # Returns: { "message": "..." } (with context from previous message)
   ```

### Review Summarization Flow

1. **Get Reviews with Summary**
   ```bash
   GET /api/products/1/reviews
   # Returns: { "summary": "...", "reviews": [...] }
   # Summary may be null if not generated or expired
   ```

2. **Generate/Refresh Summary**
   ```bash
   POST /api/products/1/reviews/summarize
   # Returns: { "summary": "..." }
   # Generates new summary if cache expired, otherwise returns cached
   ```

3. **Get Reviews Again** (summary now cached)
   ```bash
   GET /api/products/1/reviews
   # Returns: { "summary": "...", "reviews": [...] }
   # Summary is now available (cached for 7 days)
   ```

## 🎯 Quick Reference

### Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Health check | No |
| `POST` | `/api/chat` | Send chat message | No |
| `GET` | `/api/products/:productId/reviews` | Get reviews with summary | No |
| `POST` | `/api/products/:productId/reviews/summarize` | Generate review summary | No |

### Rate Limits

- **Limit**: 100 requests per 15 minutes per IP
- **Excluded**: `/health` endpoint
- **Headers**: `RateLimit-*` headers included in responses

### Response Times

- Health check: < 10ms
- Chat: ~500-2000ms (depends on OpenAI API)
- Get reviews: ~50-200ms (depends on database)
- Summarize reviews: ~1000-3000ms (depends on OpenAI API, cached responses are faster)

## 📄 License

ISC License

## 👤 Author

AI App API - Bun + Express.js 5 + Prisma + OpenAI

---

**Built with ❤️ using Bun, Express.js 5, Prisma, PostgreSQL, and OpenAI**

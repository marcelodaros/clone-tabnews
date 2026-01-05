# AI Coding Agent Instructions for Clone TabNews

## Project Overview
This is a clone of [TabNews](https://github.com/filipedeschamps/tabnews.com.br), a Brazilian news platform similar to Hacker News. It's built as a Next.js application with PostgreSQL, featuring user-generated content, voting system (TabCoins), and moderation tools. The project follows curso.dev's educational approach for building full-stack web applications.

## Architecture
- **Framework**: Next.js with API routes (`pages/api/v1/`)
- **Database**: PostgreSQL with custom SQL queries (no ORM like Prisma)
- **Frontend**: React with custom UI library (`@tabnews/ui`)
- **Data Fetching**: SWR for client-side caching and revalidation
- **Authentication**: Session-based with custom models
- **Validation**: Joi schemas in `models/validator.js`
- **Testing**: Jest with custom orchestrator for database setup

## Key Components
- **Models** (`models/`): Business logic for users, content, events, balance
- **Pages** (`pages/`): Next.js pages and API routes
- **Interface** (`pages/interface/`): Shared React components and hooks
- **Infra** (`infra/`): Database, webserver, logger, migrator
- **Tests** (`tests/`): Integration tests with orchestrator setup

## Critical Patterns
- **API Routes**: Use `next-connect` with middleware chain (e.g., `controller.injectRequestMetadata`, `authorization.canRequest`)
- **Database Queries**: Raw SQL with parameterized queries; avoid ORMs
- **Error Handling**: Custom error classes (`ForbiddenError`, `NotFoundError`) with consistent response format
- **Authorization**: Feature-based permissions (e.g., `'read:content'`, `'update:user'`)
- **Content Structure**: Hierarchical with `parent_id` for threads; `path` array for ancestry
- **Voting System**: TabCoins with credit/debit tracking via events
- **Caching**: SWR with `revalidate` and `swrMaxAge` for static generation
- **Validation**: Centralized schemas in `validator.js` with Portuguese error messages

## Developer Workflows
- **Setup**: Use `.nvmrc` (Node 18 LTS); run migrations with `infra/migrator.js`
- **Testing**: `npm test` runs integration tests; orchestrator handles DB state
- **Build**: Standard Next.js build; check `/api/v1/status` for health
- **Debugging**: Use `infra/logger.js` for structured logging; check events table for audit trail

## Conventions
- **File Naming**: Snake_case for models (`user.js`, `content.js`); PascalCase for components
- **Imports**: Relative paths with `models/`, `infra/`, `pages/interface/`
- **Database**: UUID primary keys; `created_at`/`updated_at` timestamps; soft deletes with `deleted_at`
- **API Responses**: JSON with `status_code`, `name`, `message`, `action`, `error_id`
- **Markdown**: Use `@tabnews/ui/markdown` for editor/viewer with custom plugins
- **Emails**: Transactional emails via custom service; HTML templates with `@react-email/components`
- **Firewall**: Automated moderation with review system for spam/content blocks

## Examples
- **API Route Structure** (from `pages/api/v1/contents/[username]/[slug]/root/index.public.js`):
  ```js
  export default createRouter()
    .use(controller.injectRequestMetadata)
    .use(controller.logRequest)
    .use(cacheControl.swrMaxAge(10))
    .get(getValidationHandler, getHandler)
    .handler(controller.handlerOptions);
  ```

- **Model Query** (from `models/user.js`):
  ```js
  const results = await database.query(query, options);
  return results.rows;
  ```

- **Component Usage** (from `pages/interface/components/TabNewsUI/index.js`):
  ```js
  import { Box, DefaultLayout, Button } from '@/TabNewsUI';
  ```

- **Test Setup** (from `tests/orchestrator.js`):
  ```js
  beforeEach(async () => {
    await orchestrator.waitForAllServices();
    await orchestrator.dropAllTables();
    await orchestrator.runPendingMigrations();
  });
  ```

## Integration Points
- **Database**: Direct PostgreSQL connection; migrations in `infra/migrations/`
- **Email Service**: External HTTP service for sending emails
- **Analytics**: Umami integration for stats
- **Ads**: Advertisement model with random selection
- **External APIs**: None prominent; self-contained system

Focus on building features incrementally: start with user registration, then content creation, voting, and moderation. Always write integration tests first, following the orchestrator pattern.
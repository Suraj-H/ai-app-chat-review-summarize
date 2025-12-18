# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a TypeScript-based AI application built with Bun as the JavaScript runtime. The project uses a monorepo structure with workspaces for organizing multiple packages.

### Key Technologies

- **Runtime**: Bun (fast all-in-one JavaScript runtime)
- **Language**: TypeScript with strict configuration
- **Architecture**: Monorepo with workspaces (packages/\*)
- **Module System**: ES modules (type: "module")

## Essential Commands

### Development

```bash
# Install dependencies
bun install

# Run the main application
bun run index.ts

# Run with hot reload (useful for development)
bun --hot index.ts
```

### Testing

```bash
# Run tests using Bun's built-in test runner
bun test

# Run tests in a specific file
bun test <filename>.test.ts
```

### Building

```bash
# Build files (Bun handles bundling automatically)
bun build index.ts

# Build HTML files with automatic bundling
bun build <file.html>
```

## Project Structure

```
ai-app/
├── index.ts              # Main entry point
├── packages/             # Workspace packages
│   └── client/           # Client-side package
├── .cursor/rules/        # Cursor IDE rules
├── package.json          # Root package config with workspaces
└── tsconfig.json         # TypeScript configuration
```

## Architecture Guidelines

### Bun-First Development

This project follows Bun-first principles as defined in `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`:

- **Runtime**: Always use `bun` instead of `node`, `npm`, `pnpm`, or `yarn`
- **Built-in APIs**: Prefer Bun's built-in APIs over external packages:
  - `Bun.serve()` for HTTP servers with WebSocket support
  - `bun:sqlite` for SQLite operations
  - `Bun.file()` for file operations
  - `Bun.$` for shell commands
- **Testing**: Use `bun:test` instead of Jest or Vitest
- **Environment**: Bun automatically loads .env files

### TypeScript Configuration

- Strict mode enabled with comprehensive type checking
- Module resolution set to "bundler" mode
- ESNext target with Preserve module system
- JSX support configured for React

### Frontend Development Pattern

If building frontend components:

- Use HTML imports with `Bun.serve()` instead of Vite
- Import TypeScript/React files directly in HTML
- CSS files can be imported directly in components
- Hot Module Replacement (HMR) available via `Bun.serve()`

## Development Workflow

1. **Starting Development**: Use `bun --hot index.ts` for hot reload
2. **Adding Dependencies**: Use `bun install <package>`
3. **Testing**: Write tests using `import { test, expect } from "bun:test"`
4. **Building**: Bun handles bundling automatically - no separate build step needed

## Workspace Management

This is a monorepo with packages in `packages/` directory. Each package can have its own:

- Dependencies
- Scripts
- Configuration

To work with workspace packages:

```bash
# Install dependencies for all workspaces
bun install

# Run commands in specific workspace
bun run --filter <package-name> <script>
```

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Strapi 5.31.3 CMS for a photography portfolio website. Uses TypeScript, React 18, and better-sqlite3 for local development.

## Development Commands

```bash
# Development (with auto-reload)
npm run develop

# Build admin panel
npm run build

# Production (no auto-reload)
npm run start

# Strapi console
npm run console

# Deploy to Strapi Cloud
npm run deploy

# Check for upgrades
npm run upgrade:dry
npm run upgrade
```

## Architecture

### Content Types Structure

Strapi content types in `src/api/` follow this pattern:

```
src/api/{content-type-name}/
  ├── content-types/{content-type-name}/schema.json
  ├── controllers/{content-type-name}.ts
  ├── services/{content-type-name}.ts
  └── routes/{content-type-name}.ts
```

Controllers, services, and routes use Strapi factories (`factories.createCoreController()`, etc.).

### Component System

Components in `src/components/` organized hierarchically:

- `blocks/` - Major content blocks (e.g., hero-gallery)
- `elements/` - Reusable elements (e.g., gallery-image)
- `sections/` - Page sections
- `shared/` - Shared components

Each component defined by JSON schema with collectionName, info, attributes.

### Configuration

Config files in `config/`:

- `database.ts` - Supports SQLite (default), MySQL, Postgres via env vars
- `plugins.ts` - Plugin configuration
- `server.ts` - Server settings
- `admin.ts` - Admin panel settings
- `api.ts` - API configuration

### Database

Default: SQLite at `.tmp/data.db`
Supports MySQL/Postgres via DATABASE_CLIENT env var

### Environment Variables

Required in `.env` (see `.env.example`):

- HOST, PORT
- APP_KEYS, API_TOKEN_SALT
- ADMIN_JWT_SECRET, JWT_SECRET
- TRANSFER_TOKEN_SALT, ENCRYPTION_KEY

### TypeScript

- Target: ES2019
- Module: CommonJS
- Admin files excluded from server compilation
- Output: `dist/`

### API Specification

OpenAPI 3.1.0 spec auto-generated at `specification.json`

## Current Content Types

- `home-page` (singleType) - Homepage with heroGallery component
- `about-page` - About page
- `homepage` - (Legacy, appears duplicate)

## Content Type Patterns

- Single types: Use `"kind": "singleType"` for unique pages
- Collections: Default for repeatable content
- Draft & Publish enabled by default
- Components support nesting and repetition (min/max constraints)

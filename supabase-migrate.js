#!/usr/bin/env node
/**
 * Supabase migration helper
 * 
 * This script helps set up Supabase migrations for the backend.
 * 
 * Usage:
 *   node supabase-migrate.js init     - Initialize migrations folder
 *   node supabase-migrate.js create   - Create a new migration
 *   node supabase-migrate.js up       - Run pending migrations
 * 
 * Docs: https://supabase.com/docs/guides/migrations
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, 'backend', 'supabase', 'migrations');

const createMigrationsDir = () => {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    console.log(`✓ Created migrations directory: ${MIGRATIONS_DIR}`);
  }
};

const initMigration = (name) => {
  createMigrationsDir();
  const timestamp = new Date().toISOString().replace(/[:-]/g, '').slice(0, 14);
  const filename = `${timestamp}_${name || 'init'}.sql`;
  const filepath = path.join(MIGRATIONS_DIR, filename);

  const template = `-- Migration: ${name || 'init'}
-- Created at: ${new Date().toISOString()}

-- Add your migration SQL here
-- Example:
-- CREATE TABLE users (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   created_at TIMESTAMP DEFAULT NOW()
-- );
`;

  fs.writeFileSync(filepath, template);
  console.log(`✓ Created migration: ${filepath}`);
};

const cmd = process.argv[2];

if (cmd === 'init' || cmd === 'create') {
  const name = process.argv[3] || 'migration';
  initMigration(name);
} else if (cmd === 'list') {
  createMigrationsDir();
  const files = fs.readdirSync(MIGRATIONS_DIR);
  console.log('Migrations:');
  files.forEach((f) => console.log(`  - ${f}`));
} else {
  console.log('Usage: node supabase-migrate.js [init|create|list] [name]');
}

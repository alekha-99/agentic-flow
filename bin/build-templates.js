#!/usr/bin/env node

// Build script — copies source configs into templates/ for npm distribution
// Run this before `npm publish` to sync templates with source

const fs = require('fs');
const path = require('path');
const { copyRecursive } = require('./lib/copy-recursive');

const ROOT = path.join(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');

const SOURCES = [
  { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
  { src: 'AGENTS.md', dest: 'AGENTS.md' },
  { src: '.claude', dest: '.claude' },
  { src: '.github', dest: '.github' },
];

// Clean templates directory
const expectedParent = path.resolve(__dirname, '..');
const resolvedTemplates = path.resolve(TEMPLATES);
if (!resolvedTemplates.startsWith(expectedParent + path.sep)) {
  console.error('ERROR: templates path resolved outside project root');
  process.exit(1);
}
if (fs.existsSync(resolvedTemplates)) {
  fs.rmSync(resolvedTemplates, { recursive: true, force: true });
}
fs.mkdirSync(resolvedTemplates, { recursive: true });

console.log('\nBuilding templates from source...\n');

let total = 0;
for (const { src, dest } of SOURCES) {
  const srcPath = path.join(ROOT, src);
  const destPath = path.join(TEMPLATES, dest);
  const result = copyRecursive(srcPath, destPath, {
    exclude: ['memory', '.operation-counter.json'],
  });
  console.log(`  ${dest} — ${result.copied} file(s)`);
  total += result.copied;
}

console.log(`\n  Total: ${total} template files built\n`);

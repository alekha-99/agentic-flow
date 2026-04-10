// Memory Persistence — Session End Hook
// Extracts patterns from the session and saves them for future reference
const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(process.cwd(), '.claude', 'memory');
const SESSION_DIR = path.join(MEMORY_DIR, 'session');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.next', 'dist', 'build', 'coverage',
  '.env', '.vscode', '.idea', '__pycache__',
]);
const MAX_DEPTH = 5;

function getRecentlyModifiedFiles(dir, since, depth = 0) {
  const results = [];
  if (depth > MAX_DEPTH) return results;
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.name.startsWith('.') || SKIP_DIRS.has(entry.name)) continue;

    if (entry.isDirectory()) {
      results.push(...getRecentlyModifiedFiles(fullPath, since, depth + 1));
    } else if (entry.isFile()) {
      const stat = fs.statSync(fullPath);
      if (stat.mtimeMs > since) {
        results.push({ path: path.relative(process.cwd(), fullPath), modified: stat.mtime });
      }
    }
  }
  return results;
}

function extractSessionSummary(modifiedFiles) {
  const fileTypes = {};
  for (const file of modifiedFiles) {
    const ext = path.extname(file.path) || 'unknown';
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  }

  return {
    totalFiles: modifiedFiles.length,
    fileTypes,
    timestamp: new Date().toISOString(),
  };
}

try {
  ensureDir(MEMORY_DIR);
  ensureDir(SESSION_DIR);

  // Find files modified in the last 4 hours (approximate session)
  const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000;
  const modifiedFiles = getRecentlyModifiedFiles(process.cwd(), fourHoursAgo);

  const summary = extractSessionSummary(modifiedFiles);

  // Update session log
  const sessionFile = path.join(SESSION_DIR, 'session-log.md');
  const entry = [
    `\n### Session End: ${summary.timestamp}`,
    `- Files modified: ${summary.totalFiles}`,
    `- File types: ${JSON.stringify(summary.fileTypes)}`,
    `- Status: completed\n`,
  ].join('\n');

  if (fs.existsSync(sessionFile)) {
    fs.appendFileSync(sessionFile, entry);
  } else {
    fs.writeFileSync(sessionFile, `# Session Log\n${entry}`);
  }

  console.log(`[Memory] Session end — ${summary.totalFiles} files modified`);
  console.log(`[Memory] File types:`, JSON.stringify(summary.fileTypes));
  console.log('[Memory] Session summary saved to', sessionFile);
} catch (err) {
  console.error('[Memory] Session end error:', err.message);
}

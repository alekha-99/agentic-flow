const fs = require('fs');
const path = require('path');

/**
 * Recursively copy a directory or file from src to dest.
 * @param {string} src - Source path
 * @param {string} dest - Destination path
 * @param {object} [opts] - Options
 * @param {boolean} [opts.dryRun] - Skip actual writes
 * @param {boolean} [opts.overwrite] - Overwrite existing files
 * @param {function} [opts.onCopy] - Called with relative path on copy
 * @param {function} [opts.onSkip] - Called with relative path on skip
 * @param {string[]} [opts.exclude] - Entry names to skip
 * @returns {{ copied: number, skipped: number }}
 */
function copyRecursive(src, dest, opts = {}) {
  const { dryRun = false, overwrite = true, onCopy, onSkip, exclude = [] } = opts;
  let copied = 0;
  let skipped = 0;

  if (!fs.existsSync(src)) return { copied, skipped };

  const stat = fs.lstatSync(src);

  // Reject symlinks to prevent path traversal
  if (stat.isSymbolicLink()) {
    return { copied: 0, skipped: 1 };
  }

  if (stat.isFile()) {
    if (fs.existsSync(dest) && !overwrite) {
      if (onSkip) onSkip(dest);
      return { copied: 0, skipped: 1 };
    }
    if (!dryRun) {
      const dir = path.dirname(dest);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
    }
    if (onCopy) onCopy(dest);
    return { copied: 1, skipped: 0 };
  }

  if (stat.isDirectory()) {
    if (!dryRun && !fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      if (exclude.includes(entry.name)) continue;
      if (entry.isSymbolicLink()) continue; // Skip symlinks
      const result = copyRecursive(
        path.join(src, entry.name),
        path.join(dest, entry.name),
        opts
      );
      copied += result.copied;
      skipped += result.skipped;
    }
  }

  return { copied, skipped };
}

module.exports = { copyRecursive };

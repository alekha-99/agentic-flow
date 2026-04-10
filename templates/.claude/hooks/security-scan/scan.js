// Security Scanning Hook — Pre-commit check
// Scans staged files for common security issues before allowing commits
const fs = require('fs');
const path = require('path');

// Patterns that indicate potential security issues
const SECRET_PATTERNS = [
  { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{10,}['"]/gi, name: 'API Key' },
  { pattern: /(?:secret|password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/gi, name: 'Password/Secret' },
  { pattern: /(?:token)\s*[:=]\s*['"][^'"]{10,}['"]/gi, name: 'Token' },
  { pattern: /(?:aws_access_key_id|aws_secret_access_key)\s*[:=]\s*['"][A-Z0-9]{16,}['"]/gi, name: 'AWS Key' },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: 'GitHub Token' },
  { pattern: /sk-[a-zA-Z0-9]{32,}/g, name: 'OpenAI API Key' },
  { pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g, name: 'Private Key' },
  { pattern: /(?:mongodb\+srv|postgres|mysql):\/\/[^:]+:[^@]+@/g, name: 'Database URL with credentials' },
];

const VULN_PATTERNS = [
  { pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html:/g, name: 'XSS: dangerouslySetInnerHTML', severity: 'HIGH' },
  { pattern: /eval\s*\(/g, name: 'Code injection: eval()', severity: 'CRITICAL' },
  { pattern: /new\s+Function\s*\(/g, name: 'Code injection: new Function()', severity: 'CRITICAL' },
  { pattern: /innerHTML\s*=/g, name: 'XSS: innerHTML assignment', severity: 'HIGH' },
  { pattern: /document\.write\s*\(/g, name: 'XSS: document.write()', severity: 'HIGH' },
  { pattern: /\$\{.*\}.*(?:SELECT|INSERT|UPDATE|DELETE|DROP)/gi, name: 'SQL injection risk', severity: 'CRITICAL' },
  { pattern: /crypto\.createHash\s*\(\s*['"]md5['"]\s*\)/g, name: 'Weak hash: MD5', severity: 'MEDIUM' },
  { pattern: /crypto\.createHash\s*\(\s*['"]sha1['"]\s*\)/g, name: 'Weak hash: SHA1', severity: 'MEDIUM' },
  { pattern: /disable.*csrf|csrf.*disable/gi, name: 'CSRF disabled', severity: 'HIGH' },
  { pattern: /cors\(\s*\)/g, name: 'Wide-open CORS', severity: 'MEDIUM' },
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const findings = [];

  for (const { pattern, name } of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      findings.push({ type: 'SECRET', name, file: filePath, severity: 'CRITICAL' });
    }
  }

  for (const { pattern, name, severity } of VULN_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      findings.push({ type: 'VULNERABILITY', name, file: filePath, severity });
    }
  }

  return findings;
}

function scanDirectory(dir, extensions) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip irrelevant directories
    if (entry.isDirectory()) {
      if (['node_modules', '.git', '.next', 'dist', 'build', 'coverage'].includes(entry.name)) {
        continue;
      }
      results.push(...scanDirectory(fullPath, extensions));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (extensions.includes(ext)) {
        results.push(...scanFile(fullPath));
      }
    }
  }
  return results;
}

// Main execution
try {
  const targetDir = process.argv[2] || process.cwd();
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.env', '.yml', '.yaml'];

  console.log(`[Security] Scanning ${targetDir}...`);
  const findings = scanDirectory(targetDir, extensions);

  if (findings.length === 0) {
    console.log('[Security] No issues found');
    process.exit(0);
  }

  const critical = findings.filter((f) => f.severity === 'CRITICAL');
  const high = findings.filter((f) => f.severity === 'HIGH');
  const medium = findings.filter((f) => f.severity === 'MEDIUM');

  console.log(`\n[Security] Found ${findings.length} issue(s):`);
  console.log(`  CRITICAL: ${critical.length}`);
  console.log(`  HIGH:     ${high.length}`);
  console.log(`  MEDIUM:   ${medium.length}\n`);

  for (const finding of findings) {
    console.log(`  [${finding.severity}] ${finding.type}: ${finding.name}`);
    console.log(`    File: ${finding.file}\n`);
  }

  // Exit with error code if CRITICAL issues found
  if (critical.length > 0) {
    console.error('[Security] CRITICAL issues must be fixed before committing!');
    process.exit(1);
  }
} catch (err) {
  console.error('[Security] Scan error:', err.message);
  process.exit(1);
}

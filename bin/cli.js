#!/usr/bin/env node

// Agentic Flow CLI — Install AI development harness into any project
// Usage: npx agentic-flow [options]

const fs = require('fs');
const path = require('path');
const { copyRecursive } = require('./lib/copy-recursive');

// ─── Configuration ──────────────────────────────────────────────
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const VERSION = require('../package.json').version;

const PROFILES = {
  full: {
    description: 'Full pipeline: agents + skills + hooks + commands + rules + GitHub Copilot configs',
    dirs: ['.claude', '.github'],
  },
  claude: {
    description: 'Claude Code only: agents + skills + hooks + commands + rules',
    dirs: ['.claude'],
  },
  copilot: {
    description: 'GitHub Copilot only: agents + prompts + copilot-instructions',
    dirs: ['.github'],
  },
  minimal: {
    description: 'Core files only: CLAUDE.md + AGENTS.md + orchestrator agent',
    dirs: ['minimal'],
  },
};

// ─── Helpers ────────────────────────────────────────────────────
function log(msg) {
  console.log(`  ${msg}`);
}

function logSuccess(msg) {
  console.log(`  ✓ ${msg}`);
}

function logSkip(msg) {
  console.log(`  → ${msg} (already exists, skipped)`);
}

function logError(msg) {
  console.error(`  ✗ ${msg}`);
}

function parseArgs(argv) {
  const args = {
    profile: 'full',
    dryRun: false,
    overwrite: false,
    help: false,
    version: false,
    targetDir: process.cwd(),
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--help':
      case '-h':
        args.help = true;
        break;
      case '--version':
      case '-v':
        args.version = true;
        break;
      case '--dry-run':
        args.dryRun = true;
        break;
      case '--overwrite':
      case '--force':
        args.overwrite = true;
        break;
      case '--profile':
        if (i + 1 >= argv.length || argv[i + 1].startsWith('-')) {
          logError('--profile requires a value (full, claude, copilot, minimal)');
          process.exit(1);
        }
        args.profile = argv[++i];
        break;
      case '--claude':
        args.profile = 'claude';
        break;
      case '--copilot':
        args.profile = 'copilot';
        break;
      case '--minimal':
        args.profile = 'minimal';
        break;
      case '--full':
        args.profile = 'full';
        break;
      default:
        if (!arg.startsWith('-')) {
          const resolved = path.resolve(arg);
          // Guard against writing to system directories
          const dangerous = process.platform === 'win32'
            ? ['C:\\Windows', 'C:\\Program Files', 'C:\\Program Files (x86)']
            : ['/', '/etc', '/usr', '/bin', '/sbin', '/var', '/sys', '/proc'];
          const isDangerous = dangerous.some(d =>
            resolved.toLowerCase() === d.toLowerCase() ||
            resolved.toLowerCase().startsWith(d.toLowerCase() + path.sep)
          );
          if (isDangerous) {
            logError(`Refusing to install to system directory: ${resolved}`);
            process.exit(1);
          }
          args.targetDir = resolved;
        }
        break;
    }
  }

  return args;
}

function showHelp() {
  console.log(`
  Agentic Flow v${VERSION}
  AI development harness for Claude Code, GitHub Copilot, Cursor & Codex

  USAGE
    npx agentic-flow [options] [target-directory]

  OPTIONS
    --full        Install everything (default)
    --claude      Claude Code configs only (.claude/)
    --copilot     GitHub Copilot configs only (.github/)
    --minimal     Core orchestrator files only

    --overwrite   Overwrite existing files
    --dry-run     Preview changes without writing
    --help, -h    Show this help
    --version     Show version

  EXAMPLES
    npx agentic-flow                    Install into current directory
    npx agentic-flow ./my-project       Install into specific directory
    npx agentic-flow --claude           Only Claude Code configs
    npx agentic-flow --copilot          Only GitHub Copilot configs
    npx agentic-flow --minimal          Just CLAUDE.md + AGENTS.md + orchestrator
    npx agentic-flow --dry-run          Preview what would be installed
    npx agentic-flow --overwrite        Replace existing config files

  PROFILES
${Object.entries(PROFILES)
  .map(([name, p]) => `    ${name.padEnd(12)} ${p.description}`)
  .join('\n')}

  WHAT GETS INSTALLED
    .claude/agents/       16 specialized sub-agents
    .claude/skills/       11 reusable skill definitions
    .claude/commands/     10 slash commands (/dev, /tdd, /e2e, etc.)
    .claude/hooks/        Automated triggers (security scan, memory, compact)
    .claude/rules/        Coding standards (TypeScript, testing, security)
    .claude/contexts/     Mode-specific context injection
    .claude/settings.json Model & token optimization
    .github/agents/       GitHub Copilot agent definitions
    .github/prompts/      Copilot prompt templates
    CLAUDE.md             Master harness configuration
    AGENTS.md             Cross-tool agent roster
`);
}

// ─── Main ───────────────────────────────────────────────────────
function main() {
  const args = parseArgs(process.argv);

  if (args.version) {
    console.log(VERSION);
    return;
  }

  if (args.help) {
    showHelp();
    return;
  }

  const profile = PROFILES[args.profile];
  if (!profile) {
    logError(`Unknown profile: ${args.profile}`);
    logError(`Available: ${Object.keys(PROFILES).join(', ')}`);
    process.exit(1);
  }

  console.log(`\n  Agentic Flow v${VERSION}`);
  console.log(`  Profile: ${args.profile} — ${profile.description}`);
  console.log(`  Target:  ${args.targetDir}`);
  if (args.dryRun) console.log('  Mode:    DRY RUN (no files will be written)');
  if (args.overwrite) console.log('  Mode:    OVERWRITE (existing files will be replaced)');
  console.log('');

  let totalCopied = 0;
  let totalSkipped = 0;

  if (args.profile === 'minimal') {
    // Minimal: just root configs + orchestrator
    const minimalFiles = [
      { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
      { src: 'AGENTS.md', dest: 'AGENTS.md' },
      { src: '.claude/agents/orchestrator.md', dest: '.claude/agents/orchestrator.md' },
      { src: '.claude/settings.json', dest: '.claude/settings.json' },
    ];

    for (const file of minimalFiles) {
      const srcPath = path.join(TEMPLATES_DIR, file.src);
      const destPath = path.join(args.targetDir, file.dest);

      if (!fs.existsSync(srcPath)) {
        logError(`Template not found: ${file.src}`);
        continue;
      }

      if (fs.existsSync(destPath) && !args.overwrite) {
        logSkip(file.dest);
        totalSkipped++;
        continue;
      }

      if (!args.dryRun) {
        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.copyFileSync(srcPath, destPath);
      }
      logSuccess(file.dest);
      totalCopied++;
    }
  } else {
    // Copy root config files
    const rootFiles = ['CLAUDE.md', 'AGENTS.md'];
    for (const file of rootFiles) {
      const srcPath = path.join(TEMPLATES_DIR, file);
      const destPath = path.join(args.targetDir, file);

      if (!fs.existsSync(srcPath)) continue;

      if (fs.existsSync(destPath) && !args.overwrite) {
        logSkip(file);
        totalSkipped++;
      } else {
        if (!args.dryRun) {
          const dir = path.dirname(destPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.copyFileSync(srcPath, destPath);
        }
        logSuccess(file);
        totalCopied++;
      }
    }

    // Copy profile directories
    for (const dir of profile.dirs) {
      const srcDir = path.join(TEMPLATES_DIR, dir);
      const destDir = path.join(args.targetDir, dir);

      if (!fs.existsSync(srcDir)) {
        logError(`Template directory not found: ${dir}`);
        continue;
      }

      console.log(`\n  Installing ${dir}/`);
      const result = copyRecursive(srcDir, destDir, {
        dryRun: args.dryRun,
        overwrite: args.overwrite,
        onCopy: (p) => logSuccess(path.relative(process.cwd(), p)),
        onSkip: (p) => logSkip(path.relative(process.cwd(), p)),
      });
      totalCopied += result.copied;
      totalSkipped += result.skipped;
    }
  }

  console.log(`\n  ──────────────────────────────────`);
  console.log(`  ${totalCopied} files installed, ${totalSkipped} skipped`);

  if (args.dryRun) {
    console.log('  (dry run — no files were written)');
  }

  if (!args.dryRun && totalCopied > 0) {
    console.log(`\n  Next steps:`);
    console.log(`  1. Review CLAUDE.md and customize for your project`);
    console.log(`  2. Update tech stack and rules to match your codebase`);
    console.log(`  3. Try: /dev "Build a feature for your project"`);
  }

  console.log('');
}

main();

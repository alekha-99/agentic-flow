// Memory Persistence — Session Start Hook
// Loads relevant memory files and checks for incomplete tasks
const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(process.cwd(), '.claude', 'memory');
const SESSION_DIR = path.join(MEMORY_DIR, 'session');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadMemoryFiles() {
  ensureDir(MEMORY_DIR);
  ensureDir(SESSION_DIR);

  const files = [];
  if (fs.existsSync(MEMORY_DIR)) {
    fs.readdirSync(MEMORY_DIR).forEach((file) => {
      const filePath = path.join(MEMORY_DIR, file);
      if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
        files.push({ name: file, content: fs.readFileSync(filePath, 'utf-8') });
      }
    });
  }
  return files;
}

function checkIncompleteTasks() {
  const taskFile = path.join(SESSION_DIR, 'current-task.md');
  if (fs.existsSync(taskFile)) {
    const content = fs.readFileSync(taskFile, 'utf-8');
    if (content.includes('- [ ]') || content.includes('status: in-progress')) {
      console.log('[Memory] Found incomplete tasks from last session:');
      console.log(content.substring(0, 500));
      return true;
    }
  }
  return false;
}

try {
  const memories = loadMemoryFiles();
  console.log(`[Memory] Session start — loaded ${memories.length} memory files`);
  memories.forEach((m) => console.log(`  - ${m.name}`));

  const hasIncomplete = checkIncompleteTasks();
  if (!hasIncomplete) {
    console.log('[Memory] No incomplete tasks from previous session');
  }

  // Create session start marker
  const sessionFile = path.join(SESSION_DIR, 'session-log.md');
  const timestamp = new Date().toISOString();
  const entry = `\n## Session: ${timestamp}\n\n- Status: started\n- Memory files loaded: ${memories.length}\n`;

  if (fs.existsSync(sessionFile)) {
    fs.appendFileSync(sessionFile, entry);
  } else {
    fs.writeFileSync(sessionFile, `# Session Log\n${entry}`);
  }
} catch (err) {
  console.error('[Memory] Session start error:', err.message);
}

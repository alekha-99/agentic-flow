// Strategic Compact Hook
// Suggests compaction at logical breakpoints to manage context window
const fs = require('fs');
const path = require('path');

// Thresholds for suggesting compaction
const COMPACT_THRESHOLDS = {
  filesRead: 20,        // After reading 20+ files
  editsCompleted: 15,   // After 15+ edits
  toolCalls: 50,        // After 50+ tool calls
};

// Track operation counts via a temp file
const COUNTER_FILE = path.join(
  process.cwd(),
  '.claude',
  'memory',
  'session',
  '.operation-counter.json'
);

function loadCounters() {
  if (fs.existsSync(COUNTER_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8'));
    } catch {
      return { filesRead: 0, editsCompleted: 0, toolCalls: 0, lastCompactSuggestion: 0 };
    }
  }
  return { filesRead: 0, editsCompleted: 0, toolCalls: 0, lastCompactSuggestion: 0 };
}

function saveCounters(counters) {
  const dir = path.dirname(COUNTER_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(counters, null, 2));
}

try {
  const counters = loadCounters();
  counters.toolCalls += 1;

  // Detect operation type from environment (whitelist known tool names)
  const toolName = process.env.TOOL_NAME || '';
  const KNOWN_READ_TOOLS = ['Read', 'Search', 'Grep', 'Glob'];
  const KNOWN_WRITE_TOOLS = ['Edit', 'Write'];
  if (KNOWN_READ_TOOLS.some(t => toolName.includes(t))) {
    counters.filesRead += 1;
  }
  if (KNOWN_WRITE_TOOLS.some(t => toolName.includes(t))) {
    counters.editsCompleted += 1;
  }

  // Check if compaction should be suggested
  const sinceLast = counters.toolCalls - counters.lastCompactSuggestion;
  const shouldSuggest =
    sinceLast > 30 &&
    (counters.filesRead > COMPACT_THRESHOLDS.filesRead ||
      counters.editsCompleted > COMPACT_THRESHOLDS.editsCompleted ||
      counters.toolCalls > COMPACT_THRESHOLDS.toolCalls);

  if (shouldSuggest) {
    console.log(
      `[Compact] Consider running /compact — ${counters.toolCalls} tool calls, ${counters.filesRead} reads, ${counters.editsCompleted} edits since session start.`
    );
    counters.lastCompactSuggestion = counters.toolCalls;
    // Reset read/edit counters after suggestion
    counters.filesRead = 0;
    counters.editsCompleted = 0;
  }

  saveCounters(counters);
} catch (err) {
  // Silent fail — don't block tool execution
}

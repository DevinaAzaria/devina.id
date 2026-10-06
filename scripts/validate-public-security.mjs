import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

const ignoredDirectories = new Set(['.git', 'node_modules', 'dist', '.astro']);

const forbiddenPublicPaths = [
  'PROFILE-README-DRAFT.md',
  'content/portfolio/source-baseline.md',
  '.github/workflows/scheduled-essay-publisher.yml',
];

const forbiddenPublicPrefixes = [
  'content/inventory/',
  'content/schedules/',
  'scheduled/',
];

const forbiddenFilenamePatterns = [
  /^\.env(?:\..+)?$/i,
  /\.(?:pem|key|p12|pfx|jks|keystore|mobileprovision)$/i,
];

const credentialPatterns = [
  { name: 'private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'GitHub token', regex: /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/ },
  { name: 'AWS access key', regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'Slack token', regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  { name: 'Google API key', regex: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
];

const textExtensions = new Set([
  '.astro', '.css', '.csv', '.html', '.js', '.json', '.md', '.mjs',
  '.txt', '.ts', '.tsx', '.xml', '.yml', '.yaml', '.toml', '.ini',
  '.conf', '.config',
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function isTextCandidate(file) {
  const base = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  return textExtensions.has(ext) || base === '.gitignore' || base === '.htaccess';
}

function hasUnsafeCredentialAssignment(content) {
  const lines = content.split(/\r?\n/);
  const assignment = /\b(?:password|passwd|secret|token|api[_-]?key|client[_-]?secret)\b\s*[:=]\s*([^\s#]+)/i;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(assignment);
    if (!match) continue;

    const value = match[1].replace(/^["']|["']$/g, '');
    if (
      value.includes('$' + '{{') ||
      value.includes('process.env') ||
      value.startsWith('$') ||
      /^<.+>$/.test(value) ||
      /example|placeholder|changeme|redacted/i.test(value)
    ) {
      continue;
    }

    if (value.length >= 8) return true;
  }

  return false;
}

const errors = [];
const files = await walk(root);

for (const file of files) {
  const rel = relative(file);
  const base = path.basename(file);

  if (
    forbiddenPublicPaths.includes(rel) ||
    forbiddenPublicPrefixes.some((prefix) => rel.startsWith(prefix))
  ) {
    errors.push(rel + ': editorial-only material must live in the private editorial repository');
    continue;
  }

  if (forbiddenFilenamePatterns.some((pattern) => pattern.test(base))) {
    if (base !== '.env.example') {
      errors.push(rel + ': credential-like file must not be tracked in the public repository');
    }
  }

  if (!isTextCandidate(file)) continue;

  const info = await stat(file);
  if (info.size > 1_000_000) continue;

  let content;
  try {
    content = await readFile(file, 'utf8');
  } catch {
    continue;
  }

  for (const pattern of credentialPatterns) {
    if (pattern.regex.test(content)) {
      errors.push(rel + ': possible ' + pattern.name + ' detected');
    }
  }

  if (hasUnsafeCredentialAssignment(content)) {
    errors.push(rel + ': possible literal credential assignment detected');
  }
}

if (errors.length) {
  console.error('\nPublic repository security validation failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('Public repository security validation passed.');

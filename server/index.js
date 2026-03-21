import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const DATA_DIR = join(__dirname, '..', 'data');
const CONTENT_FILE = join(DATA_DIR, 'published.json');
const BACKUP_DIR = join(DATA_DIR, 'backups');

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });

app.use(express.json({ limit: '20mb' }));
app.use(express.static(join(__dirname, '..', 'dist')));

// GET /api/content — load published content
app.get('/api/content', (req, res) => {
  try {
    if (!existsSync(CONTENT_FILE)) return res.json(null);
    const data = readFileSync(CONTENT_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading content:', err);
    res.json(null);
  }
});

// POST /api/content — save published content (with backup)
app.post('/api/content', (req, res) => {
  try {
    if (existsSync(CONTENT_FILE)) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      writeFileSync(join(BACKUP_DIR, 'published-' + ts + '.json'), readFileSync(CONTENT_FILE, 'utf8'));
      const backups = readdirSync(BACKUP_DIR).sort();
      while (backups.length > 20) unlinkSync(join(BACKUP_DIR, backups.shift()));
    }
    writeFileSync(CONTENT_FILE, JSON.stringify(req.body, null, 2));
    const kb = (JSON.stringify(req.body).length / 1024).toFixed(1);
    console.log('Published at ' + new Date().toISOString() + ' (' + kb + ' KB)');
    res.json({ ok: true });
  } catch (err) {
    console.error('Error saving:', err);
    res.status(500).json({ error: 'Failed to save' });
  }
});

// AI proxy
app.post('/api/ai', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(req.body),
    });
    res.json(await r.json());
  } catch (err) {
    console.error('AI error:', err);
    res.status(500).json({ error: 'AI unavailable' });
  }
});

// SPA fallback
app.get('*', (req, res) => res.sendFile(join(__dirname, '..', 'dist', 'index.html')));

app.listen(PORT, () => {
  console.log('Difilex running at http://localhost:' + PORT);
  console.log('Data: ' + DATA_DIR);
  console.log('Published: ' + (existsSync(CONTENT_FILE) ? 'found' : 'empty'));
});


require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const pool               = require('./connections/db');
const { connectRedis }   = require('./connections/redis');
const authRoutes         = require('./routes/auth');
const authenticateToken  = require('./middleware/authenticateToken');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(503).json({ status: 'error', message: err.message });
  }
});

// ── Auth routes (public) ─────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Protected route guard ────────────────────────────────────
// All routes registered AFTER this line require a valid JWT.
// Add future protected routes below this middleware.
app.use('/api', authenticateToken);

// ── (future protected routes go here) ────────────────────────
// e.g. app.use('/api/supply',  require('./routes/supply'));
// e.g. app.use('/api/demand',  require('./routes/demand'));
// e.g. app.use('/api/match',   require('./routes/match'));

// ── 404 fallback ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Start server ─────────────────────────────────────────────
async function start() {
  try {
    // Verify MySQL connection
    await pool.query('SELECT 1');
    console.log('[MySQL] Connected');

    // Connect Redis
    await connectRedis();
    console.log('[Redis] Ready');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Server] Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err);
    process.exit(1);
  }
}

start();

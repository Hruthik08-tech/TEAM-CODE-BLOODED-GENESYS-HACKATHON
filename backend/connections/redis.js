
const { createClient } = require('redis');

const REDIS_URL =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;

// ── Main client (used for GET / SET / DEL / PUBLISH) ────────
const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('[Redis] Client error:', err));
redisClient.on('connect', ()  => console.log('[Redis] Connected'));

// ── Subscriber client (pub/sub requires a dedicated connection) ──
const subscriberClient = redisClient.duplicate();
subscriberClient.on('error', (err) => console.error('[Redis] Subscriber error:', err));

/**
 * Connect both the main and subscriber Redis clients.
 * Safe to call multiple times — redis v4 ignores duplicate .connect() calls.
 */
async function connectRedis() {
  if (!redisClient.isOpen)     await redisClient.connect();
  if (!subscriberClient.isOpen) await subscriberClient.connect();
}

module.exports = { redisClient, subscriberClient, connectRedis };

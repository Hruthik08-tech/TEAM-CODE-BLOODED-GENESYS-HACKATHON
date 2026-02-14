
const { createClient } = require('redis');

const REDIS_URL =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`;


const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => console.error('[Redis] Client error:', err));
redisClient.on('connect', ()  => console.log('[Redis] Connected'));

const subscriberClient = redisClient.duplicate();
subscriberClient.on('error', (err) => console.error('[Redis] Subscriber error:', err));


async function connectRedis() {
  if (!redisClient.isOpen)     await redisClient.connect();
  if (!subscriberClient.isOpen) await subscriberClient.connect();
}

module.exports = { redisClient, subscriberClient, connectRedis };

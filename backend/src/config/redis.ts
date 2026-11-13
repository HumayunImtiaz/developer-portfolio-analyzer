import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_URL;


const retryStrategy = (attempt: number) => Math.min(attempt * 1000, 30000);

export const redisClient = redisUrl
  ? new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy,
    connectTimeout: 10000,
    family: 4,
  })
  : new Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy,
  });

export let redisAvailable = false;

redisClient.on('error', (err: NodeJS.ErrnoException) => {
  if (redisUrl) {
    console.error(`Redis connection error${err.code ? ` (${err.code})` : ''}:`, err.message);
  }
});

redisClient.on('connect', () => {
  redisAvailable = true;
  console.log(' Connected to Redis');
});

redisClient.on('close', () => {
  redisAvailable = false;
});

redisClient.on('end', () => {
  redisAvailable = false;
});

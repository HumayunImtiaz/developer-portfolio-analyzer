import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.UPSTASH_REDIS_URL;


const retryStrategy = () => null; // return null = stop retrying

export const redisClient = redisUrl
  ? new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    retryStrategy,
  })
  : new Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy,
  });

export let redisAvailable = false;

redisClient.on('error', (err: any) => {
  if (err.code === 'ECONNREFUSED') {
    if (!redisUrl) {
      // Only log once — suppress flood of messages
    } else {
      console.error('Redis connection error:', err.message);
    }
  }
});

redisClient.on('connect', () => {
  redisAvailable = true;
  console.log(' Connected to Redis');
});

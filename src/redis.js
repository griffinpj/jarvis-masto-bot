import { createClient } from 'redis';
import logger from './logger.js';
import config from './config.js';

config();

const client = createClient({
    url: `redis://${process.env.REDIS_PATH}`
});

await client.connect();
logger.info('Connected to redis at ' + process.env.REDIS_PATH);

client.on('error', err => logger.error(err));

const redis = {};


redis.set = async (key, value) => await client.set(key, value);
redis.get = async (key) => await client.get(key);
redis.close = async () => await client.disconnect();

export default redis;


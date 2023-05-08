import { createClient } from 'redis';
import data from '../config/redis.js';

const REDIS_HOST = data[ process.env.NODE_ENV ].host

const client = createClient({
    socket: {
        host: REDIS_HOST,
        port: 6379
    },
});

client.on('error', err => console.log('Redis Client Error', err));

client.connect();

export { client }
import { createClient } from "redis";

const redis = createClient({
    host: 'localhost',
    port: 6379
});

await redis.connect();

export { redis };
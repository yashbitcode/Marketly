import "dotenv/config";
import { Redis } from "ioredis";

const pubClient = new Redis(process.env.REDIS_URI, {
    maxRetriesPerRequest: null,
});
const subClient = pubClient.duplicate();

export { pubClient, subClient };

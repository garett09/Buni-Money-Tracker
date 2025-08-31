import { Redis } from "@upstash/redis";

// Initialize Redis client
let redis: any;

if (process.env.NODE_ENV === 'development' || !process.env.UPSTASH_REDIS_REST_URL) {
  console.log('Using in-memory storage for development');
  const memoryStore = {
    data: new Map(),
    async hset(key: string, obj: any) {
      this.data.set(key, obj);
    },
    async hgetall(key: string) {
      return this.data.get(key) || {};
    },
    async set(key: string, value: any) {
      this.data.set(key, value);
    },
    async get(key: string) {
      return this.data.get(key);
    },
    async lpush(key: string, value: any) {
      if (!this.data.has(key)) {
        this.data.set(key, []);
      }
      const arr = this.data.get(key);
      arr.unshift(value);
      this.data.set(key, arr);
    },
    async lrange(key: string, start: number, end: number) {
      const arr = this.data.get(key) || [];
      return arr.slice(start, end === -1 ? undefined : end + 1);
    },
    async lrem(key: string, count: number, value: any) {
      const arr = this.data.get(key) || [];
      const filtered = arr.filter((item: any) => item !== value);
      this.data.set(key, filtered);
    },
    async del(key: string) {
      this.data.delete(key);
    }
  };
  redis = memoryStore;
} else {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export { redis };

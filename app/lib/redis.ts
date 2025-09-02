import { Redis } from "@upstash/redis";

// Initialize Redis client
let redis: any;

// Ensure we're in a Node.js environment or have proper environment variables
const isServer = typeof window === 'undefined';
const hasRedisCredentials = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

if (!isServer || !hasRedisCredentials) {
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
    },
    async sadd(key: string, value: any) {
      if (!this.data.has(key)) {
        this.data.set(key, new Set());
      }
      const set = this.data.get(key);
      set.add(value);
      this.data.set(key, set);
    },
    async smembers(key: string) {
      const set = this.data.get(key) || new Set();
      return Array.from(set);
    },
    async srem(key: string, value: any) {
      const set = this.data.get(key) || new Set();
      set.delete(value);
      this.data.set(key, set);
    },
    // Sorted set methods for backup system
    async zadd(key: string, score: number, member: string) {
      if (!this.data.has(key)) {
        this.data.set(key, new Map<string, number>());
      }
      const sortedSet = this.data.get(key) as Map<string, number>;
      sortedSet.set(member, score);
      this.data.set(key, sortedSet);
    },
    async zrevrange(key: string, start: number, stop: number) {
      const sortedSet = (this.data.get(key) || new Map()) as Map<string, number>;
      const entries = Array.from(sortedSet.entries())
        .sort((a, b) => b[1] - a[1]) // Sort by score descending
        .slice(start, stop + 1);
      return entries.map(([member]) => member);
    },
    async zrangebyscore(key: string, min: number, max: number) {
      const sortedSet = (this.data.get(key) || new Map()) as Map<string, number>;
      const entries = Array.from(sortedSet.entries())
        .filter(([member, score]) => score >= min && score <= max)
        .sort((a, b) => a[1] - b[1]); // Sort by score ascending
      return entries.map(([member]) => member);
    },
    async zcard(key: string) {
      const sortedSet = (this.data.get(key) || new Map()) as Map<string, number>;
      return sortedSet.size;
    },
    async zrem(key: string, member: string) {
      const sortedSet = (this.data.get(key) || new Map()) as Map<string, number>;
      sortedSet.delete(member);
      this.data.set(key, sortedSet);
    }
  };
  redis = memoryStore;
} else {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// Ensure redis is properly initialized
if (!redis) {
  throw new Error('Redis client initialization failed');
}

export { redis };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Redis } = require("@upstash/redis");
const { v4: uuidv4 } = require("uuid");

// Initialize Redis client
let redis;

if (process.env.NODE_ENV === 'development' || !process.env.UPSTASH_REDIS_REST_URL) {
  console.log('Using in-memory storage for development');
  const memoryStore = {
    data: new Map(),
    async hset(key, obj) {
      this.data.set(key, obj);
    },
    async hgetall(key) {
      return this.data.get(key) || {};
    },
    async set(key, value) {
      this.data.set(key, value);
    },
    async get(key) {
      return this.data.get(key);
    },
    async lpush(key, value) {
      if (!this.data.has(key)) {
        this.data.set(key, []);
      }
      const arr = this.data.get(key);
      arr.unshift(value);
      this.data.set(key, arr);
    },
    async lrange(key, start, end) {
      const arr = this.data.get(key) || [];
      return arr.slice(start, end === -1 ? undefined : end + 1);
    },
    async lrem(key, count, value) {
      const arr = this.data.get(key) || [];
      const filtered = arr.filter(item => item !== value);
      this.data.set(key, filtered);
    },
    async del(key) {
      this.data.delete(key);
    }
  };
  redis = memoryStore;
} else {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Main API handler
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { pathname } = new URL(req.url, `http://${req.headers.host}`);

  try {
    // Test endpoint
    if (pathname === '/api/hello' || pathname === '/api/test') {
      return res.status(200).json({ 
        message: "API is working!",
        timestamp: new Date().toISOString(),
        path: pathname
      });
    }

    // Register endpoint
    if (pathname === '/api/register' && req.method === 'POST') {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await redis.get(`user:email:${email}`);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = uuidv4();
      const user = {
        id: userId,
        name,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      // Store user by ID
      await redis.hset(`user:${userId}`, user);
      // Store user by email for login lookup
      await redis.set(`user:email:${email}`, userId);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }

    // Login endpoint
    if (pathname === '/api/login' && req.method === 'POST') {
      const { email, password } = req.body;

      // Find user
      const userId = await redis.get(`user:email:${email}`);
      if (!userId) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = await redis.hgetall(`user:${userId}`);
      if (!user || Object.keys(user).length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    }

    // Default response
    return res.status(404).json({ message: 'Endpoint not found' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

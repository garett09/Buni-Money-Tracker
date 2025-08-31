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
    }
  };
  redis = memoryStore;
} else {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Redis } = require("@upstash/redis");
const { v4: uuidv4 } = require("uuid");

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "*" }));

// Initialize Redis client
let redis;

// For local development, use a simple in-memory store
if (process.env.NODE_ENV === 'development' || !process.env.UPSTASH_REDIS_REST_URL) {
  console.log('Using in-memory storage for development');
  // Simple in-memory storage for development
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
  // Production: Use Upstash Redis
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Redis data structure helpers
const UserService = {
  async create(userData) {
    const userId = uuidv4();
    const user = {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    
    // Store user by ID
    await redis.hset(`user:${userId}`, user);
    
    // Store user by email for login lookup
    await redis.set(`user:email:${userData.email}`, userId);
    
    return user;
  },

  async findByEmail(email) {
    const userId = await redis.get(`user:email:${email}`);
    if (!userId) return null;
    
    const user = await redis.hgetall(`user:${userId}`);
    return Object.keys(user).length > 0 ? user : null;
  },

  async findById(userId) {
    const user = await redis.hgetall(`user:${userId}`);
    return Object.keys(user).length > 0 ? user : null;
  }
};

const TransactionService = {
  async create(transactionData) {
    const transactionId = uuidv4();
    const transaction = {
      id: transactionId,
      userId: transactionData.userId,
      type: transactionData.type,
      amount: transactionData.amount,
      category: transactionData.category,
      description: transactionData.description,
      date: transactionData.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // Store transaction
    await redis.hset(`transaction:${transactionId}`, transaction);
    
    // Add to user's transaction list
    await redis.lpush(`user:${transactionData.userId}:transactions`, transactionId);
    
    // Add to user's transactions by type
    await redis.lpush(`user:${transactionData.userId}:transactions:${transactionData.type}`, transactionId);
    
    return transaction;
  },

  async findByUserId(userId, options = {}) {
    const { type, limit = 50, page = 1 } = options;
    
    let transactionIds;
    if (type) {
      transactionIds = await redis.lrange(`user:${userId}:transactions:${type}`, 0, -1);
    } else {
      transactionIds = await redis.lrange(`user:${userId}:transactions`, 0, -1);
    }
    
    // Reverse to get newest first
    transactionIds.reverse();
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedIds = transactionIds.slice(startIndex, endIndex);
    
    // Get transaction details
    const transactions = [];
    for (const id of paginatedIds) {
      const transaction = await redis.hgetall(`transaction:${id}`);
      if (Object.keys(transaction).length > 0) {
        transactions.push(transaction);
      }
    }
    
    return {
      transactions,
      total: transactionIds.length,
      totalPages: Math.ceil(transactionIds.length / limit),
      currentPage: page
    };
  },

  async delete(transactionId, userId) {
    // Get transaction to verify ownership
    const transaction = await redis.hgetall(`transaction:${transactionId}`);
    if (!transaction || transaction.userId !== userId) {
      return false;
    }
    
    // Remove from user's transaction lists
    await redis.lrem(`user:${userId}:transactions`, 0, transactionId);
    await redis.lrem(`user:${userId}:transactions:${transaction.type}`, 0, transactionId);
    
    // Delete transaction
    await redis.del(`transaction:${transactionId}`);
    
    return true;
  },

  async getStats(userId) {
    const incomeIds = await redis.lrange(`user:${userId}:transactions:income`, 0, -1);
    const expenseIds = await redis.lrange(`user:${userId}:transactions:expense`, 0, -1);
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    // Calculate total income
    for (const id of incomeIds) {
      const transaction = await redis.hgetall(`transaction:${id}`);
      if (transaction.amount) {
        totalIncome += parseFloat(transaction.amount);
      }
    }
    
    // Calculate total expenses
    for (const id of expenseIds) {
      const transaction = await redis.hgetall(`transaction:${id}`);
      if (transaction.amount) {
        totalExpenses += parseFloat(transaction.amount);
      }
    }
    
    // Get recent transactions (last 5)
    const allTransactionIds = await redis.lrange(`user:${userId}:transactions`, 0, 4);
    const recentTransactions = [];
    for (const id of allTransactionIds) {
      const transaction = await redis.hgetall(`transaction:${id}`);
      if (Object.keys(transaction).length > 0) {
        recentTransactions.push(transaction);
      }
    }
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      recentTransactions
    };
  }
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await UserService.create({ 
      name, 
      email, 
      password: hashedPassword 
    });

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
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserService.findByEmail(email);
    if (!user) {
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

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Transaction Routes
app.post("/api/transactions", authenticateToken, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    
    const transaction = await TransactionService.create({
      userId: req.user.userId,
      type,
      amount,
      category,
      description,
      date: date ? new Date(date).toISOString() : new Date().toISOString()
    });

    res.status(201).json({ message: 'Transaction added successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get("/api/transactions", authenticateToken, async (req, res) => {
  try {
    const { type, limit = 50, page = 1 } = req.query;
    
    const result = await TransactionService.findByUserId(req.user.userId, {
      type,
      limit: parseInt(limit),
      page: parseInt(page)
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete("/api/transactions/:id", authenticateToken, async (req, res) => {
  try {
    const success = await TransactionService.delete(req.params.id, req.user.userId);

    if (!success) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard Stats
app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await TransactionService.getStats(req.user.userId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test API
app.post("/hello", async (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

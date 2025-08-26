const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all transactions for a user
router.get("/", auth, async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;
    
    const filter = { user: req.user._id };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get transaction statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { user: req.user._id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const stats = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const incomeStats = stats.find(s => s._id === "income") || { total: 0, count: 0 };
    const expenseStats = stats.find(s => s._id === "expense") || { total: 0, count: 0 };

    // Get category breakdown
    const categoryStats = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.type",
          categories: {
            $push: {
              category: "$_id.category",
              total: "$total",
              count: "$count"
            }
          }
        }
      }
    ]);

    res.json({
      income: incomeStats.total,
      expenses: expenseStats.total,
      balance: incomeStats.total - expenseStats.total,
      transactionCount: incomeStats.count + expenseStats.count,
      categoryBreakdown: categoryStats
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new transaction
router.post("/", auth, async (req, res) => {
  try {
    const {
      type,
      category,
      amount,
      description,
      date,
      tags,
      location,
      paymentMethod,
      isRecurring,
      recurringInterval
    } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      date: date || new Date(),
      tags,
      location,
      paymentMethod,
      isRecurring,
      recurringInterval
    });

    await transaction.save();

    res.status(201).json({
      message: "Transaction created successfully",
      transaction
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single transaction
router.get("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ transaction });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update transaction
router.put("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction updated successfully",
      transaction
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete transaction
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get categories
router.get("/categories/list", auth, async (req, res) => {
  try {
    const categories = await Transaction.distinct("category", { user: req.user._id });
    res.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
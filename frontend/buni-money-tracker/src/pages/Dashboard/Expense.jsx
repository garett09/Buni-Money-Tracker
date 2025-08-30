import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiTrendingDown, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { transactionAPI } from "../../utils/apiPaths";

const Expense = () => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const expenseCategories = [
    "Food & Dining",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Travel",
    "Groceries",
    "Other"
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionAPI.getTransactions({ type: 'expense' });
      setTransactions(response.data.transactions);
    } catch (error) {
      toast.error("Failed to load expense transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await transactionAPI.addTransaction({
        ...formData,
        type: 'expense',
        amount: parseFloat(formData.amount)
      });
      
      toast.success("Expense added successfully!");
      setFormData({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
      fetchTransactions(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense transaction?")) {
      try {
        await transactionAPI.deleteTransaction(id);
        toast.success("Transaction deleted successfully");
        fetchTransactions(); // Refresh the list
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between ios-fade-in">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="mr-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
            >
              <FiArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-display text-3xl font-bold text-white">Expenses</h1>
              <p className="text-body text-white/70">Track your spending</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-body text-sm text-white/70">Total Expenses</p>
            <p className="text-display text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Expense Form */}
          <div className="glass-card rounded-2xl p-6 ios-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-display text-lg font-semibold text-white mb-6">Add New Expense</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="amount" className="block text-body text-sm font-medium text-white/90 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-body text-sm font-medium text-white/90 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
                >
                  <option value="">Select category</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-body text-sm font-medium text-white/90 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-body text-sm font-medium text-white/90 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full glass-button text-white py-3 px-4 rounded-xl font-medium text-body disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {submitting ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>

          {/* Expense List */}
          <div className="glass-card rounded-2xl ios-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-6 border-b border-white/20">
              <h2 className="text-display text-lg font-semibold text-white">Recent Expenses</h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/30"></div>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <FiTrendingDown className="mx-auto text-white/40 mb-4" size={48} />
                  <p className="text-body text-white/70">No expense transactions yet</p>
                  <p className="text-body text-sm text-white/50">Add your first expense above</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 glass rounded-xl"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                          <FiTrendingDown className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="text-body font-medium text-white">{transaction.description}</p>
                          <p className="text-body text-sm text-white/70">{transaction.category}</p>
                          <p className="text-body text-xs text-white/50">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-display font-semibold text-red-400">
                          -{formatCurrency(transaction.amount)}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(transaction._id)}
                          className="text-white/40 hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;

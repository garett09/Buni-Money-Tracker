'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { toast } from 'react-hot-toast';
import { FiTrendingDown, FiPlus, FiCalendar, FiTag, FiDollarSign, FiTarget, FiBarChart, FiAlertTriangle } from 'react-icons/fi';
import { expenseCategories, spendingInsights } from '@/app/lib/categories';
import { ApiClient } from '@/app/lib/api';

const ExpensesPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: 'monthly'
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  // Load transactions from API
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await ApiClient.getExpenseTransactions();
        setTransactions(response.transactions || []);
      } catch (error) {
        console.error('Error loading expense transactions:', error);
        // Fallback to localStorage for development
        const savedTransactions = localStorage.getItem('expenseTransactions');
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        } else {
          // Load sample transactions only if no saved data exists
          const sampleTransactions = [
            { id: 1, amount: 2500, description: 'Monthly Groceries', category: 'Food & Dining', subcategory: 'Groceries', date: '2024-01-20', recurring: true },
            { id: 2, amount: 800, description: 'Gas for the month', category: 'Transportation', subcategory: 'Gas/Fuel', date: '2024-01-18', recurring: true },
            { id: 3, amount: 150, description: 'Coffee with friends', category: 'Food & Dining', subcategory: 'Coffee & Snacks', date: '2024-01-19', recurring: false },
            { id: 4, amount: 1200, description: 'Netflix & Spotify', category: 'Entertainment', subcategory: 'Streaming Services', date: '2024-01-15', recurring: true }
          ];
          setTransactions(sampleTransactions);
          localStorage.setItem('expenseTransactions', JSON.stringify(sampleTransactions));
        }
      }
    };

    loadTransactions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'category') {
      const category = expenseCategories.find(cat => cat.name === value);
      setSelectedCategory(category);
      setFormData({
        ...formData,
        [name]: value,
        subcategory: '' // Reset subcategory when category changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ApiClient.addExpenseTransaction(formData);
      const newTransaction = response.transaction;
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      // Also update localStorage as fallback
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Expense added successfully!');
      
      setFormData({
        amount: '',
        description: '',
        category: '',
        subcategory: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        frequency: 'monthly'
      });
      setSelectedCategory(null);
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const monthlyExpenses = transactions.filter(t => t.recurring).reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Calculate spending insights
  const getSpendingInsight = () => {
    const avgMonthly = spendingInsights.averageMonthlyExpenses['26-35'].total;
    if (totalExpenses > avgMonthly * 1.2) {
      return { type: 'warning', message: 'Your spending is above average for your age group' };
    } else if (totalExpenses < avgMonthly * 0.8) {
      return { type: 'success', message: 'Great job! You\'re spending below average' };
    } else {
      return { type: 'info', message: 'Your spending is within normal range' };
    }
  };

  const insight = getSpendingInsight();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="apple-fade-in">
          <h1 className="text-display text-4xl font-semibold text-white mb-2 tracking-tight">
            Add Expense
          </h1>
          <p className="text-body text-white/60 text-lg">
            Track your spending and manage your expenses.
          </p>
        </div>

        {/* Expense Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl apple-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                <FiDollarSign size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-2xl font-semibold text-white">₱{totalExpenses.toLocaleString()}</h3>
                <p className="text-white/60 text-sm">Total Expenses</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl apple-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <FiTarget size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-2xl font-semibold text-white">₱{monthlyExpenses.toLocaleString()}</h3>
                <p className="text-white/60 text-sm">Monthly Recurring</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl apple-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <FiBarChart size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-2xl font-semibold text-white">{transactions.length}</h3>
                <p className="text-white/60 text-sm">Transactions</p>
              </div>
            </div>
          </div>
          <div className={`glass-card p-6 rounded-2xl apple-fade-in ${
            insight.type === 'warning' ? 'border-red-500/50' : 
            insight.type === 'success' ? 'border-green-500/50' : 'border-blue-500/50'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                insight.type === 'warning' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                insight.type === 'success' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                'bg-gradient-to-br from-blue-500 to-cyan-600'
              }`}>
                <FiAlertTriangle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-lg font-semibold text-white">Spending</h3>
                <p className="text-white/60 text-xs">{insight.type}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-8 rounded-2xl apple-slide-up">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="amount" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                      Amount (₱)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg resize-none"
                    placeholder="Describe your expense..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg"
                    >
                      <option value="">Select a category</option>
                      {expenseCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="subcategory" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      required
                      disabled={!selectedCategory}
                      className="glass-input w-full px-6 py-4 rounded-2xl focus:outline-none text-lg disabled:opacity-50"
                    >
                      <option value="">Select subcategory</option>
                      {selectedCategory?.subcategories.map((sub: any) => (
                        <option key={sub.name} value={sub.name}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="recurring"
                      checked={formData.recurring}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-blue-500"
                    />
                    <span className="text-white/80">Recurring Expense</span>
                  </label>
                  {formData.recurring && (
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="glass-input px-4 py-2 rounded-xl focus:outline-none"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full glass-button text-white py-4 px-6 rounded-2xl font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed apple-shimmer"
                >
                  {loading ? "Adding Expense..." : "Add Expense"}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Expenses & Insights */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl apple-fade-in">
              <h3 className="text-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiTrendingDown size={20} />
                Recent Expenses
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-white/60 text-sm">{transaction.subcategory} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-red-400 font-semibold">-₱{transaction.amount.toLocaleString()}</span>
                      {transaction.recurring && (
                        <p className="text-white/50 text-xs">Recurring</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl apple-fade-in">
              <h3 className="text-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiTag size={20} />
                Spending by Category
              </h3>
              <div className="space-y-3">
                {expenseCategories.slice(0, 6).map((category) => {
                  const categoryTotal = transactions
                    .filter(t => t.category === category.name)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = totalExpenses > 0 ? (categoryTotal / totalExpenses * 100) : 0;
                  
                  return (
                    <div key={category.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 font-medium">{category.icon} {category.name}</span>
                        <span className="text-white/60 text-sm">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-white/60 text-xs mt-1">₱{categoryTotal.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl apple-fade-in">
              <h3 className="text-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiTarget size={20} />
                Spending Insights
              </h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-xl ${
                  insight.type === 'warning' ? 'bg-red-500/10 border border-red-500/20' :
                  insight.type === 'success' ? 'bg-green-500/10 border border-green-500/20' :
                  'bg-blue-500/10 border border-blue-500/20'
                }`}>
                  <h4 className="text-white font-medium mb-2">📊 Spending Analysis</h4>
                  <p className="text-white/70 text-sm">{insight.message}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <h4 className="text-white font-medium mb-2">💡 Money Saving Tip</h4>
                  <p className="text-white/70 text-sm">
                    {spendingInsights.moneySavingTips[Math.floor(Math.random() * spendingInsights.moneySavingTips.length)]}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <h4 className="text-white font-medium mb-2">🎯 Budget Recommendation</h4>
                  <p className="text-white/70 text-sm">
                    Try the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and debt repayment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExpensesPage;

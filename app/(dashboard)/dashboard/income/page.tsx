'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { toast } from 'react-hot-toast';
import { FiTrendingUp, FiPlus, FiCalendar, FiTag, FiDollarSign, FiTarget, FiBarChart } from 'react-icons/fi';
import { incomeCategories, spendingInsights } from '@/app/lib/categories';

const IncomePage = () => {
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

  // Load sample transactions
  useEffect(() => {
    const sampleTransactions = [
      { id: 1, amount: 25000, description: 'Monthly Salary', category: 'Salary & Wages', subcategory: 'Primary Job', date: '2024-01-15', recurring: true },
      { id: 2, amount: 5000, description: 'Freelance Web Development', category: 'Freelance & Contract', subcategory: 'Web Development', date: '2024-01-10', recurring: false },
      { id: 3, amount: 1200, description: 'Investment Dividends', category: 'Investment Income', subcategory: 'Dividends', date: '2024-01-05', recurring: true }
    ];
    setTransactions(sampleTransactions);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'category') {
      const category = incomeCategories.find(cat => cat.name === value);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTransaction = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      toast.success('Income added successfully!');
      
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
      toast.error('Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const monthlyIncome = transactions.filter(t => t.recurring).reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="apple-fade-in">
          <h1 className="text-display text-4xl font-semibold text-white mb-2 tracking-tight">
            Add Income
          </h1>
          <p className="text-body text-white/60 text-lg">
            Record your earnings and track your income sources.
          </p>
        </div>

        {/* Income Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl apple-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <FiDollarSign size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-2xl font-semibold text-white">₱{totalIncome.toLocaleString()}</h3>
                <p className="text-white/60 text-sm">Total Income</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl apple-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FiTarget size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-2xl font-semibold text-white">₱{monthlyIncome.toLocaleString()}</h3>
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
                    placeholder="Describe your income source..."
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
                      {incomeCategories.map((category) => (
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
                    <span className="text-white/80">Recurring Income</span>
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
                  {loading ? "Adding Income..." : "Add Income"}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Income & Insights */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl apple-fade-in">
              <h3 className="text-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiTrendingUp size={20} />
                Recent Income
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-white/60 text-sm">{transaction.subcategory} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-semibold">+₱{transaction.amount.toLocaleString()}</span>
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
                Income Categories
              </h3>
              <div className="space-y-3">
                {incomeCategories.map((category) => {
                  const categoryTotal = transactions
                    .filter(t => t.category === category.name)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = totalIncome > 0 ? (categoryTotal / totalIncome * 100) : 0;
                  
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
                Income Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <h4 className="text-white font-medium mb-2">💡 Financial Tip</h4>
                  <p className="text-white/70 text-sm">
                    {spendingInsights.moneySavingTips[Math.floor(Math.random() * spendingInsights.moneySavingTips.length)]}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <h4 className="text-white font-medium mb-2">📊 Recommended Split</h4>
                  <p className="text-white/70 text-sm">
                    Consider the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and debt repayment.
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

export default IncomePage;

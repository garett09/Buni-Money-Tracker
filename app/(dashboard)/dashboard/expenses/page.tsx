'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import EditTransactionModal from '@/app/components/EditTransactionModal';
import { toast } from 'react-hot-toast';
import { FiTrendingDown, FiPlus, FiCalendar, FiTag, FiDollarSign, FiTarget, FiBarChart, FiAlertTriangle, FiEdit3, FiTrash2 } from 'react-icons/fi';
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
    frequency: 'monthly',
    billingDate: new Date().toISOString().split('T')[0],
    totalInstallments: 1,
    currentInstallment: 1,
    paidAmount: 0,
    remainingAmount: 0,
    nextBillingDate: '',
    accountId: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);

  // Load accounts from API
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await ApiClient.getAccounts();
        setAccounts(response.accounts || []);
      } catch (error) {
        console.log('Failed to load accounts, using empty array');
        setAccounts([]);
      }
    };

    loadAccounts();
  }, []);

  // Load transactions from API
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await ApiClient.getExpenseTransactions();
        setTransactions(response.transactions || []);
      } catch (error) {
        console.log('API not available, using localStorage fallback');
        // Fallback to localStorage for development or when API is not available
        const savedTransactions = localStorage.getItem('expenseTransactions');
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        } else {
          // Load sample transactions only if no saved data exists
          const sampleTransactions = [
            { id: 1, amount: 2500, description: 'Monthly Groceries', category: 'Food & Dining', subcategory: 'Groceries', date: '2024-01-20', recurring: true, billingDate: '2024-01-20', totalInstallments: 12, currentInstallment: 3, paidAmount: 7500, remainingAmount: 22500 },
            { id: 2, amount: 800, description: 'Gas for the month', category: 'Transportation', subcategory: 'Gas/Fuel', date: '2024-01-18', recurring: true, billingDate: '2024-01-18', totalInstallments: 12, currentInstallment: 2, paidAmount: 1600, remainingAmount: 8000 },
            { id: 3, amount: 150, description: 'Coffee with friends', category: 'Food & Dining', subcategory: 'Coffee & Snacks', date: '2024-01-19', recurring: false },
            { id: 4, amount: 1200, description: 'Netflix & Spotify', category: 'Entertainment', subcategory: 'Streaming Services', date: '2024-01-15', recurring: true, billingDate: '2024-01-15', totalInstallments: 12, currentInstallment: 1, paidAmount: 1200, remainingAmount: 13200 }
          ];
          setTransactions(sampleTransactions);
          localStorage.setItem('expenseTransactions', JSON.stringify(sampleTransactions));
        }
      }
    };

    loadTransactions();
  }, []);

  // Load sharing status
  useEffect(() => {
    const loadSharingStatus = async () => {
      try {
        const response = await ApiClient.getSharedExpenses();
        setSharingEnabled(response.sharingEnabled);
        setPartnerInfo(response.partnerInfo);
      } catch (error) {
        // Fallback to localStorage
        const savedSharing = localStorage.getItem('expenseSharing');
        if (savedSharing) {
          const sharingData = JSON.parse(savedSharing);
          setSharingEnabled(sharingData.enabled);
          setPartnerInfo(sharingData.partnerInfo);
        }
      }
    };

    loadSharingStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'category') {
      const category = expenseCategories.find(cat => cat.name === value);
      setSelectedCategory(category);
      setFormData({
        ...formData,
        [name]: value,
        subcategory: '', // Reset subcategory when category changes
        accountId: formData.accountId // Preserve accountId
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
      // Always try API first to save to database
      const response = await ApiClient.addExpenseTransaction(formData);
      const newTransaction = response.transaction;
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      // Also update localStorage as backup
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Expense added successfully and saved to database!');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      // Fallback to localStorage for development
      const newTransaction = {
        id: Date.now(),
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Expense added successfully (saved locally)!');
    } finally {
      setFormData({
        amount: '',
        description: '',
        category: '',
        subcategory: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        frequency: 'monthly',
        billingDate: new Date().toISOString().split('T')[0],
        totalInstallments: 1,
        currentInstallment: 1,
        paidAmount: 0,
        remainingAmount: 0,
        nextBillingDate: '',
        accountId: ''
      });
      setSelectedCategory(null);
      setLoading(false);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleUpdateTransaction = async (updatedTransaction: any) => {
    try {
      // Try API first
      await ApiClient.updateExpenseTransaction(updatedTransaction.id, updatedTransaction);
      
      // Update local state
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      setTransactions(updatedTransactions);
      
      // Update localStorage as backup
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Expense updated successfully and saved to database!');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      // Fallback to localStorage
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      setTransactions(updatedTransactions);
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Expense updated successfully (saved locally)!');
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      // Try API first
      await ApiClient.deleteExpenseTransaction(transactionId);
      
      // Update local state
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      
      // Update localStorage as backup
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Expense deleted successfully and removed from database!');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      // Fallback to localStorage
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Expense deleted successfully (removed locally)!');
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
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-xl">
              <FiTrendingDown size={36} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-6xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Add Expenses
                </h1>
                {sharingEnabled && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-green-400 text-sm font-medium">
                      Sharing with {partnerInfo?.name || 'Partner'}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>
                Track your spending and manage your expenses
                {sharingEnabled && (
                  <span className="text-green-400/80"> • Your expenses are shared with your partner.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Expense Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiDollarSign size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Expenses</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>₱{totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiTrendingDown size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Monthly Recurring</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>₱{monthlyExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiBarChart size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Transactions</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>{transactions.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`liquid-card p-6 apple-fade-in ${
            insight.type === 'warning' ? 'border-red-500/50' : 
            insight.type === 'success' ? 'border-green-500/50' : 'border-blue-500/50'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center liquid-shape ${
                insight.type === 'warning' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                insight.type === 'success' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                'bg-gradient-to-br from-blue-500 to-cyan-600'
              }`}>
                <FiAlertTriangle size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Spending</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{insight.type}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="liquid-card p-8 apple-slide-up">
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
                      className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
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
                      className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
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
                                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg resize-none"
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
                      className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
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
                      className="w-full px-6 py-4 rounded-2xl focus:outline-none text-lg disabled:opacity-50 bg-white/10 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-white/30 transition-all duration-300"
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

                <div>
                  <label htmlFor="accountId" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                    Account
                  </label>
                  <select
                    id="accountId"
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    required
                    className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.accountName} - ₱{account.currentBalance?.toLocaleString() || '0'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="recurring"
                        checked={formData.recurring}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-blue-500"
                      />
                      <span style={{ color: 'var(--text-primary)' }}>Recurring Expense</span>
                    </label>
                    {formData.recurring && (
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="liquid-input px-4 py-2 rounded-xl focus:outline-none"
                      >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                      </select>
                    )}
                  </div>

                  {formData.recurring && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label htmlFor="billingDate" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Billing Date
                        </label>
                        <input
                          type="date"
                          id="billingDate"
                          name="billingDate"
                          value={formData.billingDate}
                          onChange={handleChange}
                          required
                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="totalInstallments" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Total Installments
                        </label>
                        <input
                          type="number"
                          id="totalInstallments"
                          name="totalInstallments"
                          value={formData.totalInstallments}
                          onChange={handleChange}
                          min="1"
                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                          placeholder="e.g., 12 for monthly payments"
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="currentInstallment" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Current Installment
                        </label>
                        <input
                          type="number"
                          id="currentInstallment"
                          name="currentInstallment"
                          value={formData.currentInstallment}
                          onChange={handleChange}
                          min="1"
                          max={formData.totalInstallments}
                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                          placeholder="Which payment is this?"
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="paidAmount" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Amount Already Paid
                        </label>
                        <input
                          type="number"
                          id="paidAmount"
                          name="paidAmount"
                          value={formData.paidAmount}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                          placeholder="₱0.00"
                        />
                      </div>
                    </div>
                  )}

                  {formData.recurring && (
                    <div className="liquid-card p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                      <h4 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                        📊 Installment Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Amount</p>
                          <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                            ₱{(parseFloat(formData.amount) || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Paid So Far</p>
                          <p className="font-bold text-lg" style={{ color: '#10B981' }}>
                            ₱{(formData.paidAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Remaining</p>
                          <p className="font-bold text-lg" style={{ color: '#EF4444' }}>
                            ₱{Math.max(0, (parseFloat(formData.amount) || 0) - (formData.paidAmount || 0)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Progress</p>
                          <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                            {formData.totalInstallments > 0 ? Math.round((formData.currentInstallment / formData.totalInstallments) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${formData.totalInstallments > 0 ? (formData.currentInstallment / formData.totalInstallments) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                          Installment {formData.currentInstallment} of {formData.totalInstallments}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full liquid-button text-white py-4 px-6 font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed apple-shimmer"
                >
                  {loading ? "Adding Expense..." : "Add Expense"}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Expenses & Insights */}
          <div className="space-y-6">
            <div className="liquid-card p-6 rounded-2xl apple-fade-in">
              <h3 className="text-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FiTrendingDown size={20} />
                Recent Expenses
              </h3>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex-1">
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-white/60 text-sm">{transaction.subcategory} • {new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-red-400 font-semibold">-₱{transaction.amount.toLocaleString()}</span>
                        {transaction.recurring && (
                          <div className="text-white/50 text-xs">
                            <p>Recurring</p>
                            {transaction.currentInstallment && transaction.totalInstallments && (
                              <p>Installment {transaction.currentInstallment}/{transaction.totalInstallments}</p>
                            )}
                            {transaction.paidAmount && transaction.amount && (
                              <p>Paid: ₱{transaction.paidAmount.toLocaleString()}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                          title="Edit transaction"
                        >
                          <FiEdit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                          title="Delete transaction"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="liquid-card p-6 rounded-2xl apple-fade-in">
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

            <div className="liquid-card p-6 rounded-2xl apple-fade-in">
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

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingTransaction(null);
        }}
        transaction={editingTransaction}
        type="expense"
        onUpdate={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
      />
    </DashboardLayout>
  );
};

export default ExpensesPage;

'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import EditTransactionModal from '@/app/components/EditTransactionModal';
import { toast } from 'react-hot-toast';
import { FiTrendingUp, FiPlus, FiCalendar, FiTag, FiDollarSign, FiTarget, FiBarChart, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { incomeCategories, spendingInsights } from '@/app/lib/categories';
import { ApiClient } from '@/app/lib/api';

const IncomePage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: 'monthly',
    paymentDate: new Date().toISOString().split('T')[0],
    totalPayments: 1,
    currentPayment: 1,
    receivedAmount: 0,
    pendingAmount: 0,
    nextPaymentDate: '',
    accountId: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
        const response = await ApiClient.getIncomeTransactions();
        setTransactions(response.transactions || []);
      } catch (error) {
        console.log('API not available, using localStorage fallback');
        // Fallback to localStorage for development or when API is not available
        const savedTransactions = localStorage.getItem('incomeTransactions');
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        } else {
          // Load sample transactions only if no saved data exists
          const sampleTransactions = [
            { id: 1, amount: 25000, description: 'Monthly Salary', category: 'Salary & Wages', subcategory: 'Primary Job', date: '2024-01-15', recurring: true, paymentDate: '2024-01-15', totalPayments: 12, currentPayment: 3, receivedAmount: 75000, pendingAmount: 225000 },
            { id: 2, amount: 5000, description: 'Freelance Web Development', category: 'Freelance & Contract', subcategory: 'Web Development', date: '2024-01-10', recurring: false },
            { id: 3, amount: 1200, description: 'Investment Dividends', category: 'Investment Income', subcategory: 'Dividends', date: '2024-01-05', recurring: true, paymentDate: '2024-01-05', totalPayments: 4, currentPayment: 1, receivedAmount: 1200, pendingAmount: 3600 }
          ];
          setTransactions(sampleTransactions);
          localStorage.setItem('incomeTransactions', JSON.stringify(sampleTransactions));
        }
      }
    };

    loadTransactions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'category') {
      const category = incomeCategories.find(cat => cat.name === value);
      setSelectedCategory(category);
      setFormData({
        ...formData,
        [name]: value,
        subcategory: '', // Reset subcategory when category changes
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
      const response = await ApiClient.addIncomeTransaction(formData);
      const newTransaction = response.transaction;
      
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      // Also update localStorage as backup
      localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Income added successfully and saved to database!');
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
      localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Income added successfully (saved locally)!');
    } finally {
      setFormData({
        amount: '',
        description: '',
        category: '',
        subcategory: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        frequency: 'monthly',
        paymentDate: new Date().toISOString().split('T')[0],
        totalPayments: 1,
        currentPayment: 1,
        receivedAmount: 0,
        pendingAmount: 0,
        nextPaymentDate: '',
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
      await ApiClient.updateIncomeTransaction(updatedTransaction.id, updatedTransaction);
      
      // Update local state
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      setTransactions(updatedTransactions);
      
      // Update localStorage as backup
      localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Income updated successfully and saved to database!');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      // Fallback to localStorage
      const updatedTransactions = transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      );
      setTransactions(updatedTransactions);
      localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Income updated successfully (saved locally)!');
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      // Try API first
      await ApiClient.deleteIncomeTransaction(transactionId);
      
      // Update local state
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      
      // Update localStorage as backup
      localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Income deleted successfully and removed from database!');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      // Fallback to localStorage
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
      
      toast.success('Income deleted successfully (removed locally)!');
    }
  };

  const totalIncome = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const monthlyIncome = transactions.filter(t => t.recurring).reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
              <FiTrendingUp size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Add Income
              </h1>
              <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>
                Record your earnings and track your income sources
              </p>
            </div>
          </div>
        </div>

        {/* Income Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiDollarSign size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Income</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>₱{totalIncome.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiTrendingUp size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Monthly Recurring</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>₱{monthlyIncome.toLocaleString()}</p>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="liquid-card p-10 rounded-3xl apple-slide-up">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Transaction Details</h2>
                <p style={{ color: 'var(--text-muted)' }}>Fill in the details of your income transaction</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="amount" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Amount (₱)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      className="liquid-input w-full px-8 py-6 focus:outline-none text-2xl font-medium rounded-2xl"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="date" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="description" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium resize-none rounded-2xl"
                    placeholder="Describe your income source..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="category" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl"
                    >
                      <option value="">Select a category</option>
                      {incomeCategories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="subcategory" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Subcategory
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      required
                      disabled={!selectedCategory}
                      className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl disabled:opacity-50"
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

                <div className="space-y-3">
                  <label htmlFor="accountId" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Account
                  </label>
                  <select
                    id="accountId"
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleChange}
                    required
                    className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl"
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
                  <div className="flex items-center gap-8">
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="recurring"
                        checked={formData.recurring}
                        onChange={handleChange}
                        className="w-6 h-6 rounded-lg border-2 border-white/30 bg-transparent checked:bg-green-500 checked:border-green-500 transition-all duration-200"
                      />
                      <span className="text-lg font-medium transition-colors" style={{ color: 'var(--text-primary)' }}>Recurring Income</span>
                    </label>
                    {formData.recurring && (
                      <select
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        className="liquid-input px-6 py-3 rounded-xl focus:outline-none text-lg font-medium"
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
                        <label htmlFor="paymentDate" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Payment Date
                        </label>
                        <input
                          type="date"
                          id="paymentDate"
                          name="paymentDate"
                          value={formData.paymentDate}
                          onChange={handleChange}
                          required
                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="totalPayments" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Total Payments
                        </label>
                        <input
                          type="number"
                          id="totalPayments"
                          name="totalPayments"
                          value={formData.totalPayments}
                          onChange={handleChange}
                          min="1"
                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                          placeholder="e.g., 12 for monthly payments"
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="currentPayment" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Current Payment
                        </label>
                        <input
                          type="number"
                          id="currentPayment"
                          name="currentPayment"
                          value={formData.currentPayment}
                          onChange={handleChange}
                          min="1"
                          max={formData.totalPayments}
                          className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                          placeholder="Which payment is this?"
                        />
                      </div>

                      <div className="space-y-3">
                        <label htmlFor="receivedAmount" className="block text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                          Amount Already Received
                        </label>
                        <input
                          type="number"
                          id="receivedAmount"
                          name="receivedAmount"
                          value={formData.receivedAmount}
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
                    <div className="liquid-card p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                        📊 Payment Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Amount</p>
                          <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                            ₱{(parseFloat(formData.amount) || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Received So Far</p>
                          <p className="font-bold text-lg" style={{ color: '#10B981' }}>
                            ₱{(parseFloat(formData.receivedAmount.toString()) || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pending</p>
                          <p className="font-bold text-lg" style={{ color: '#F59E0B' }}>
                            ₱{Math.max(0, (parseFloat(formData.amount) || 0) - (parseFloat(formData.receivedAmount.toString()) || 0)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Progress</p>
                          <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                            {formData.totalPayments > 0 ? Math.round((formData.currentPayment / formData.totalPayments) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="w-full bg-white/10 rounded-full h-3">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${formData.totalPayments > 0 ? (formData.currentPayment / formData.totalPayments) * 100 : 0}%` 
                            }}
                          />
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                          Payment {formData.currentPayment} of {formData.totalPayments}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full liquid-button py-6 px-8 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl hover:scale-105 transition-all duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {loading ? "Adding Income..." : "Add Income"}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Income & Insights */}
          <div className="space-y-8">
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <FiTrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Income</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your latest transactions</p>
                </div>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="group relative overflow-hidden">
                    <div className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-102">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>{transaction.description}</p>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{transaction.subcategory} • {new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-green-400 font-bold text-lg">+₱{transaction.amount.toLocaleString()}</span>
                            {transaction.recurring && (
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                <p>Recurring</p>
                                {transaction.currentPayment && transaction.totalPayments && (
                                  <p>Payment {transaction.currentPayment}/{transaction.totalPayments}</p>
                                )}
                                {transaction.receivedAmount && transaction.amount && (
                                  <p>Received: ₱{transaction.receivedAmount.toLocaleString()}</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className="p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                              title="Edit transaction"
                            >
                              <FiEdit3 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                              title="Delete transaction"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <FiTag size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Income Categories</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Breakdown by category</p>
                </div>
              </div>
              <div className="space-y-4">
                {incomeCategories.map((category) => {
                  const categoryTotal = transactions
                    .filter(t => t.category === category.name)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = totalIncome > 0 ? (categoryTotal / totalIncome * 100) : 0;
                  
                  return (
                    <div key={category.id} className="group relative overflow-hidden">
                      <div className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-102 cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{category.icon} {category.name}</span>
                          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="relative mb-2">
                          <div className="w-full bg-white/10 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full bg-gradient-to-r ${category.color} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          {/* Progress glow effect */}
                          <div 
                            className="absolute top-0 h-3 bg-gradient-to-r from-white/20 to-transparent rounded-full blur-sm transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>₱{categoryTotal.toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="liquid-card p-6 rounded-2xl apple-fade-in">
              <h3 className="text-display text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FiTarget size={20} />
                Income Insights
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5">
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>💡 Financial Tip</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {spendingInsights.moneySavingTips[Math.floor(Math.random() * spendingInsights.moneySavingTips.length)]}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>📊 Recommended Split</h4>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Consider the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and debt repayment.
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
        type="income"
        onUpdate={handleUpdateTransaction}
        onDelete={handleDeleteTransaction}
      />
    </DashboardLayout>
  );
};

export default IncomePage;

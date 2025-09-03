'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import EditTransactionModal from '@/app/components/EditTransactionModal';
import { toast } from 'react-hot-toast';
import { 
  FiTrendingUp, 
  FiPlus, 
  FiCalendar, 
  FiTag, 
  FiDollarSign, 
  FiTarget, 
  FiBarChart, 
  FiEdit3, 
  FiTrash2,
  FiArrowRight,
  FiRefreshCw,
  FiFilter,
  FiSearch,
  FiDownload,
  FiUpload,
  FiEye,
  FiEyeOff,
  FiZap,
  FiStar,
  FiAward,
  FiTrendingDown,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiX
} from 'react-icons/fi';
import { incomeCategories, spendingInsights } from '@/app/lib/categories';
import { ApiClient } from '@/app/lib/api';
import { updateAccountBalance } from '@/app/lib/accounts';
import { requireAuth } from '@/app/lib/auth';

const IncomePage = () => {
  // Check authentication on component mount
  useEffect(() => {
    requireAuth();
  }, []);

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
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  // Load accounts from API
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await ApiClient.getAccounts();
        setAccounts(response.accounts || []);
      } catch (error) {
        // Fallback to localStorage
        const savedAccounts = localStorage.getItem('userAccounts');
        if (savedAccounts) {
          setAccounts(JSON.parse(savedAccounts));
        } else {
          setAccounts([]);
        }
      }
    };

    loadAccounts();

    // Listen for localStorage changes to refresh accounts
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userAccounts') {
        if (e.newValue) {
          setAccounts(JSON.parse(e.newValue));
        } else {
          setAccounts([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load transactions from API
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await ApiClient.getIncomeTransactions();
        setTransactions(response.transactions || []);
      } catch (error) {
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    // Auto-select subcategory when category changes
    if (name === 'category') {
      const category = incomeCategories.find(cat => cat.name === value);
      setSelectedCategory(category);
      if (category && category.subcategories.length > 0) {
        setFormData(prev => ({
          ...prev,
          subcategory: (category.subcategories[0] as any).name || category.subcategories[0]
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        id: Date.now(),
        type: 'income'
      };

      // Try API first
      try {
        await ApiClient.addIncomeTransaction(transactionData);
        toast.success('Income transaction added successfully! 💰');
      } catch (apiError) {
        // Fallback to localStorage
        const existingTransactions = JSON.parse(localStorage.getItem('incomeTransactions') || '[]');
        const updatedTransactions = [transactionData, ...existingTransactions];
        localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
        toast.success('Income transaction saved locally! 💰');
      }

      // Update account balance if account is selected
      if (formData.accountId) {
        try {
          await updateAccountBalance(formData.accountId, 'income', parseFloat(formData.amount), 'add');
        } catch (error) {
          // Failed to update account balance
        }
      }

      setTransactions(prev => [transactionData, ...prev]);
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
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      // Try API first
      try {
        await ApiClient.deleteIncomeTransaction(transactionId);
        toast.success('Transaction deleted successfully! 🗑️');
      } catch (apiError) {
        // Fallback to localStorage
        const existingTransactions = JSON.parse(localStorage.getItem('incomeTransactions') || '[]');
        const updatedTransactions = existingTransactions.filter((t: any) => t.id !== transactionId);
        localStorage.setItem('incomeTransactions', JSON.stringify(updatedTransactions));
        toast.success('Transaction deleted from local storage! 🗑️');
      }

      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (error) {
      toast.error('Failed to delete transaction. Please try again.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await ApiClient.getIncomeTransactions();
      setTransactions(response.transactions || []);
      toast.success('Data refreshed successfully! 🔄');
    } catch (error) {
      toast.error('Failed to refresh data. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || transaction.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'amount':
          comparison = b.amount - a.amount;
          break;
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  // Calculate statistics
  const totalIncome = transactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyIncome = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);
  const recurringIncome = transactions
    .filter(t => t.recurring)
    .reduce((sum, t) => sum + t.amount, 0);

  const insights = [
    {
      icon: FiTrendingUp,
      title: 'Total Income',
      value: `₱${totalIncome.toLocaleString()}`,
      description: 'All time earnings',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: FiCalendar,
      title: 'This Month',
      value: `₱${monthlyIncome.toLocaleString()}`,
      description: 'Current month earnings',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FiZap,
      title: 'Recurring Income',
      value: `₱${recurringIncome.toLocaleString()}`,
      description: 'Monthly recurring income',
      color: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Income Management</h1>
            <p className="text-white/60">Track and manage your income sources</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
            >
              <FiRefreshCw size={20} className={`text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:scale-105 transition-all duration-300"
            >
              <FiPlus size={20} />
              Add Income
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <div key={insight.title} className="liquid-card p-6 rounded-2xl backdrop-blur-lg border border-white/10">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${insight.color} flex items-center justify-center`}>
                  <insight.icon size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{insight.title}</p>
                  <p className="text-2xl font-bold text-white">{insight.value}</p>
                  <p className="text-white/40 text-xs">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Income Form */}
        {showForm && (
          <div className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Income</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                <FiX size={20} className="text-white/60" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Amount (₱)</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="e.g., Monthly Salary, Freelance Payment"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  >
                    <option value="">Select Category</option>
                    {incomeCategories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Subcategory</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  >
                    <option value="">Select Subcategory</option>
                                         {selectedCategory?.subcategories.map((sub: any) => (
                       <option key={sub.name || sub} value={sub.name || sub}>{sub.name || sub}</option>
                     ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    name="recurring"
                    checked={formData.recurring}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-500 bg-white/5 border-white/10 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                  <span>Recurring Income</span>
                </label>
              </div>

              {formData.recurring && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Frequency</label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Total Payments</label>
                    <input
                      type="number"
                      name="totalPayments"
                      value={formData.totalPayments}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="12"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Current Payment</label>
                    <input
                      type="number"
                      name="currentPayment"
                      value={formData.currentPayment}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="1"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding...' : 'Add Income'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="liquid-card p-6 rounded-2xl backdrop-blur-lg border border-white/10">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
              >
                <option value="">All Categories</option>
                {incomeCategories.map(category => (
                  <option key={category.name} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="description">Description</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                {sortOrder === 'desc' ? <FiTrendingDown size={20} className="text-white/60" /> : <FiTrendingUp size={20} className="text-white/60" />}
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="liquid-card rounded-2xl backdrop-blur-lg border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Income Transactions</h2>
            <p className="text-white/60 text-sm">{filteredTransactions.length} transactions found</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white/60 font-medium">Description</th>
                  <th className="px-6 py-4 text-left text-white/60 font-medium">Category</th>
                  <th className="px-6 py-4 text-left text-white/60 font-medium">Amount</th>
                  <th className="px-6 py-4 text-left text-white/60 font-medium">Date</th>
                  <th className="px-6 py-4 text-left text-white/60 font-medium">Status</th>
                  <th className="px-6 py-4 text-center text-white/60 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-white/5 transition-colors duration-300">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{transaction.description}</p>
                          {transaction.subcategory && (
                            <p className="text-white/60 text-sm">{transaction.subcategory}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-emerald-400 font-bold">₱{transaction.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white">{new Date(transaction.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        {transaction.recurring ? (
                          <span className="flex items-center gap-2 text-blue-400">
                            <FiRefreshCw size={16} />
                            <span className="text-sm">Recurring</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2 text-green-400">
                            <FiCheckCircle size={16} />
                            <span className="text-sm">One-time</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTransaction(transaction);
                              setShowEditModal(true);
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                          >
                            <FiEdit3 size={16} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                          >
                            <FiTrash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <FiTrendingUp size={48} className="mx-auto mb-4 text-white/40" />
                      <p className="text-white/60 mb-4">No income transactions found</p>
                      <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-colors duration-300"
                      >
                        <FiPlus size={16} />
                        Add Your First Income
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Transaction Modal */}
        {showEditModal && editingTransaction && (
          <EditTransactionModal
            isOpen={showEditModal}
            transaction={editingTransaction}
            onClose={() => {
              setShowEditModal(false);
              setEditingTransaction(null);
            }}
            onUpdate={(updatedTransaction: any) => {
              setTransactions(prev => 
                prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
              );
              setShowEditModal(false);
              setEditingTransaction(null);
              toast.success('Transaction updated successfully! ✏️');
            }}
            onDelete={(transactionId: number) => {
              handleDelete(transactionId);
              setShowEditModal(false);
              setEditingTransaction(null);
            }}
            type="income"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default IncomePage;

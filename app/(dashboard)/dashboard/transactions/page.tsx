'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';
import { 
  FiArrowLeft,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDollarSign,
  FiTag,
  FiCreditCard,
  FiRefreshCw,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiArrowUp,
  FiArrowDown,
  FiSettings
} from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  account?: string;
  tags?: string[];
  recurring?: boolean;
  merchant?: string;
}

const TransactionsPage = () => {
  const [incomeTransactions, setIncomeTransactions] = useState<Transaction[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<number>>(new Set());

  // Load all transactions
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const [incomeResponse, expenseResponse] = await Promise.allSettled([
        ApiClient.getIncomeTransactions(),
        ApiClient.getExpenseTransactions()
      ]);

      if (incomeResponse.status === 'fulfilled') {
        const transactions = incomeResponse.value.transactions || [];
        const validTransactions = transactions
          .filter((t: any) => t && typeof t.amount === 'number' && t.amount > 0 && t.date)
          .map((t: any) => ({
            ...t,
            type: 'income' as const,
            amount: Math.abs(t.amount)
          }));
        setIncomeTransactions(validTransactions);
      }

      if (expenseResponse.status === 'fulfilled') {
        const transactions = expenseResponse.value.transactions || [];
        const validTransactions = transactions
          .filter((t: any) => t && typeof t.amount === 'number' && t.amount > 0 && t.date)
          .map((t: any) => ({
            ...t,
            type: 'expense' as const,
            amount: Math.abs(t.amount)
          }));
        setExpenseTransactions(validTransactions);
      }
    } catch (error) {
      toast.error('Failed to load transactions');
      
      // Fallback to localStorage
      try {
        const savedIncome = localStorage.getItem('incomeTransactions');
        const savedExpenses = localStorage.getItem('expenseTransactions');
        
        if (savedIncome) {
          const parsed = JSON.parse(savedIncome);
          setIncomeTransactions(parsed.map((t: any) => ({ ...t, type: 'income' as const })));
        }
        
        if (savedExpenses) {
          const parsed = JSON.parse(savedExpenses);
          setExpenseTransactions(parsed.map((t: any) => ({ ...t, type: 'expense' as const })));
        }
      } catch (localStorageError) {
        // Failed to load from localStorage
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // Combine and filter transactions
  const allTransactions = useMemo(() => {
    let combined = [...incomeTransactions, ...expenseTransactions];

    // Filter by type
    if (selectedType !== 'all') {
      combined = combined.filter(t => t.type === selectedType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      combined = combined.filter(t => 
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        (t.merchant && t.merchant.toLowerCase().includes(term)) ||
        t.amount.toString().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      combined = combined.filter(t => t.category === selectedCategory);
    }

    // Filter by period
    if (selectedPeriod !== 'all-time') {
      const now = new Date();
      const startDate = new Date();
      
      switch (selectedPeriod) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      combined = combined.filter(t => new Date(t.date) >= startDate);
    }

    // Sort transactions
    combined.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'amount':
          comparison = b.amount - a.amount;
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return combined;
  }, [incomeTransactions, expenseTransactions, selectedType, searchTerm, selectedCategory, selectedPeriod, sortBy, sortOrder]);

  // Get unique categories
  const categories = useMemo(() => {
    const allCategories = new Set([
      ...incomeTransactions.map(t => t.category),
      ...expenseTransactions.map(t => t.category)
    ]);
    return Array.from(allCategories).sort();
  }, [incomeTransactions, expenseTransactions]);

  // Calculate totals
  const totals = useMemo(() => {
    const totalIncome = allTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = allTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netBalance = totalIncome - totalExpenses;
    
    return { totalIncome, totalExpenses, netBalance };
  }, [allTransactions]);

  // Handle bulk selection
  const toggleTransactionSelection = (id: number) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTransactions(newSelected);
  };

  const selectAll = () => {
    if (selectedTransactions.size === allTransactions.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(allTransactions.map(t => t.id)));
    }
  };

  // Export transactions
  const exportTransactions = () => {
    if (allTransactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    try {
      const csvContent = [
        ['Date', 'Type', 'Description', 'Category', 'Amount', 'Account', 'Merchant', 'Tags'],
        ...allTransactions.map(t => [
          t.date,
          t.type,
          t.description,
          t.category,
          t.amount.toString(),
          t.account || '',
          t.merchant || '',
          (t.tags || []).join(', ')
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success(`Successfully exported ${allTransactions.length} transactions`);
    } catch (error) {
      toast.error('Failed to export transactions');
    }
  };

  // Settings functionality
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 30,
    defaultSort: 'date',
    defaultSortOrder: 'desc',
    showMerchant: true,
    showTags: true,
    itemsPerPage: 50
  });

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // Save to localStorage
    localStorage.setItem('transactionSettings', JSON.stringify({ ...settings, [key]: value }));
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('transactionSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        // Failed to load settings
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `₱${amount.toLocaleString()}`;
  };

  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? (
      <FiTrendingUp size={16} className="text-green-400" />
    ) : (
      <FiTrendingDown size={16} className="text-red-400" />
    );
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300">
              <FiArrowLeft size={20} style={{ color: 'var(--text-muted)' }} />
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              All Transactions
            </h1>
          </div>
          
          <div className="liquid-card p-8 rounded-3xl">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                  <div className="w-4 h-4 bg-white/10 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-1/3"></div>
                    <div className="h-3 bg-white/10 rounded w-1/4"></div>
                  </div>
                  <div className="h-4 bg-white/10 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300">
              <FiArrowLeft size={20} style={{ color: 'var(--text-muted)' }} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                All Transactions
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {allTransactions.length} transactions • {formatAmount(totals.totalIncome)} income • {formatAmount(totals.totalExpenses)} expenses
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={loadTransactions}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              title="Refresh"
            >
              <FiRefreshCw size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
            <button
              onClick={exportTransactions}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              title="Export CSV"
            >
              <FiDownload size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              title="Settings"
            >
              <FiSettings size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <FiTrendingUp size={20} className="text-green-400" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Income</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {formatAmount(totals.totalIncome)}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {allTransactions.filter(t => t.type === 'income').length} transactions
            </div>
          </div>
          
          <div className="liquid-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <FiTrendingDown size={20} className="text-red-400" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Expenses</span>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {formatAmount(totals.totalExpenses)}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {allTransactions.filter(t => t.type === 'expense').length} transactions
            </div>
          </div>
          
          <div className="liquid-card p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <FiDollarSign size={20} className="text-blue-400" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Net Balance</span>
            </div>
            <div className={`text-2xl font-bold ${totals.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totals.netBalance >= 0 ? '+' : ''}{formatAmount(totals.netBalance)}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {allTransactions.length} total transactions
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="liquid-card p-6 rounded-2xl">
          <div className="flex items-center gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 rounded-xl border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
            >
              <FiFilter size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as 'all' | 'income' | 'expense')}
                  className="w-full p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Period */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  Period
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <option value="all-time">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('all');
                    setSelectedCategory('all');
                    setSelectedPeriod('all-time');
                  }}
                  className="w-full p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="liquid-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Transactions ({allTransactions.length})
            </h2>
            
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300 text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="description">Description</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                {sortOrder === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />}
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 rounded-xl bg-white/5 mb-4 font-medium text-sm" style={{ color: 'var(--text-muted)' }}>
            <div className="col-span-1">Type</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Actions</div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FiDollarSign size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-muted)' }}>No transactions found</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                  Try adjusting your filters or add some transactions
                </p>
              </div>
            ) : (
              allTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="grid grid-cols-12 gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                >
                  {/* Type */}
                  <div className="col-span-1 flex items-center">
                    {getTransactionIcon(transaction.type)}
                  </div>

                  {/* Description */}
                  <div className="col-span-3">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {transaction.description}
                    </div>
                    {transaction.merchant && (
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {transaction.merchant}
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div className="col-span-2 flex items-center">
                    <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white/10" style={{ color: 'var(--text-primary)' }}>
                      {transaction.category}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2">
                    <div className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center gap-2">
                      <FiCalendar size={14} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center gap-2">
                    <button
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                      title="View Details"
                    >
                      <FiEye size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-white/10 transition-colors"
                      title="Edit"
                    >
                      <FiEdit size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-red-500/20 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="liquid-card p-8 rounded-3xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Transaction Settings
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  <FiX size={20} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Auto Refresh */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Auto Refresh
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.autoRefresh}
                      onChange={(e) => handleSettingsChange('autoRefresh', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Automatically refresh transactions every {settings.refreshInterval} seconds
                  </p>
                </div>

                {/* Refresh Interval */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="300"
                    value={settings.refreshInterval}
                    onChange={(e) => handleSettingsChange('refreshInterval', parseInt(e.target.value))}
                    className="w-full p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Default Sort */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Default Sort
                  </label>
                  <select
                    value={settings.defaultSort}
                    onChange={(e) => handleSettingsChange('defaultSort', e.target.value)}
                    className="w-full p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="description">Description</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                {/* Default Sort Order */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Default Sort Order
                  </label>
                  <select
                    value={settings.defaultSortOrder}
                    onChange={(e) => handleSettingsChange('defaultSortOrder', e.target.value)}
                    className="w-full p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value="desc">Descending (Newest First)</option>
                    <option value="asc">Ascending (Oldest First)</option>
                  </select>
                </div>

                {/* Display Options */}
                <div>
                  <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                    Display Options
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Show Merchant Info
                      </label>
                      <input
                        type="checkbox"
                        checked={settings.showMerchant}
                        onChange={(e) => handleSettingsChange('showMerchant', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Show Tags
                      </label>
                      <input
                        type="checkbox"
                        checked={settings.showTags}
                        onChange={(e) => handleSettingsChange('showTags', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Items Per Page */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                    Items Per Page
                  </label>
                  <select
                    value={settings.itemsPerPage}
                    onChange={(e) => handleSettingsChange('itemsPerPage', parseInt(e.target.value))}
                    className="w-full p-2 bg-white/10 rounded-lg border border-white/20 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Reset to defaults
                    const defaults = {
                      autoRefresh: true,
                      refreshInterval: 30,
                      defaultSort: 'date',
                      defaultSortOrder: 'desc',
                      showMerchant: true,
                      showTags: true,
                      itemsPerPage: 50
                    };
                    setSettings(defaults);
                    localStorage.setItem('transactionSettings', JSON.stringify(defaults));
                    toast.success('Settings reset to defaults');
                  }}
                  className="py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-all duration-300"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;

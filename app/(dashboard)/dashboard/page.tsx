'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget, FiDatabase, FiUpload } from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';
import { DataMigration } from '@/app/lib/dataMigration';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [incomeTransactions, setIncomeTransactions] = useState<any[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<any[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [migrating, setMigrating] = useState(false);

  const loadData = async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    try {
      // Always try to load from API/database first
      const incomeResponse = await ApiClient.getIncomeTransactions();
      setIncomeTransactions(incomeResponse.transactions || []);

      const expenseResponse = await ApiClient.getExpenseTransactions();
      setExpenseTransactions(expenseResponse.transactions || []);

      const savingsResponse = await ApiClient.getSavingsGoals();
      setSavingsGoals(savingsResponse.goals || []);
      
      console.log('Data loaded from database successfully');
    } catch (error) {
      console.log('API not available, using localStorage fallback');
      // Fallback to localStorage for development or when API is not available
      const savedIncome = localStorage.getItem('incomeTransactions');
      if (savedIncome) {
        setIncomeTransactions(JSON.parse(savedIncome));
      }
      const savedExpenses = localStorage.getItem('expenseTransactions');
      if (savedExpenses) {
        setExpenseTransactions(JSON.parse(savedExpenses));
      }
      const savedGoals = localStorage.getItem('savingsGoals');
      if (savedGoals) {
        setSavingsGoals(JSON.parse(savedGoals));
      }
      
      // Check if user has localStorage data that could be migrated
      if (DataMigration.hasLocalDataToMigrate()) {
        setShowMigrationPrompt(true);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Refresh data when the page becomes visible (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle data migration
  const handleMigration = async () => {
    setMigrating(true);
    try {
      const result = await DataMigration.migrateLocalDataToDatabase();
      if (result.success) {
        toast.success(`Successfully migrated ${result.migratedCount} transactions to database!`);
        DataMigration.clearLocalData();
        setShowMigrationPrompt(false);
        // Reload data from database
        await loadData();
      } else {
        toast.error('Migration failed. Please try again.');
      }
    } catch (error) {
      toast.error('Migration failed. Please try again.');
    } finally {
      setMigrating(false);
    }
  };

  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  
  // Calculate savings goals totals
  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const savingsProgress = totalSavingsTarget > 0 ? Math.min((totalSavingsCurrent / totalSavingsTarget) * 100, 100) : 0;
  
  // Calculate transaction counts
  const incomeCount = incomeTransactions.length;
  const expenseCount = expenseTransactions.length;
  const totalTransactions = incomeCount + expenseCount;

  const stats = [
    {
      title: 'Total Income',
      value: `₱${totalIncome.toLocaleString()}`,
      change: incomeCount > 0 ? `${incomeCount} transactions` : 'No data yet',
      changeType: incomeCount > 0 ? 'positive' : 'neutral',
      icon: FiTrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Expenses',
      value: `₱${totalExpenses.toLocaleString()}`,
      change: expenseCount > 0 ? `${expenseCount} transactions` : 'No data yet',
      changeType: expenseCount > 0 ? 'negative' : 'neutral',
      icon: FiTrendingDown,
      color: 'from-red-500 to-rose-600'
    },
    {
      title: 'Net Balance',
      value: `₱${netBalance.toLocaleString()}`,
      change: totalTransactions > 0 ? (netBalance >= 0 ? 'In profit' : 'In deficit') : 'No data yet',
      changeType: totalTransactions > 0 ? (netBalance >= 0 ? 'positive' : 'negative') : 'neutral',
      icon: FiDollarSign,
      color: totalTransactions > 0 ? (netBalance >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-500 to-rose-600') : 'from-gray-500 to-gray-600'
    },
    {
      title: 'Savings Goals',
      value: `₱${totalSavingsTarget.toLocaleString()}`,
      change: savingsGoals.length > 0 ? `${savingsProgress.toFixed(0)}% complete` : 'No goals set',
      changeType: savingsGoals.length > 0 ? 'neutral' : 'neutral',
      icon: FiTarget,
      color: savingsGoals.length > 0 ? 'from-purple-500 to-violet-600' : 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Migration Prompt */}
        {showMigrationPrompt && (
          <div className="glass-card p-6 rounded-2xl apple-fade-in border border-blue-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FiDatabase size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-display text-xl font-semibold text-white mb-2">
                  Migrate Your Data to Database
                </h3>
                <p className="text-white/70 text-sm">
                  You have local data that can be migrated to the database for better persistence and multi-device access.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleMigration}
                  disabled={migrating}
                  className="glass-button text-white py-2 px-4 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FiUpload size={16} />
                  {migrating ? 'Migrating...' : 'Migrate Now'}
                </button>
                <button
                  onClick={() => setShowMigrationPrompt(false)}
                  className="glass-button text-white/60 py-2 px-4 rounded-xl font-medium text-sm hover:text-white transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="apple-fade-in">
          <h1 className="text-display text-4xl font-semibold text-white mb-2 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-body text-white/60 text-lg">
            Here's your financial overview for today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="glass-card p-6 rounded-2xl apple-slide-up apple-shimmer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' ? 'text-green-400 bg-green-400/20' :
                    stat.changeType === 'negative' ? 'text-red-400 bg-red-400/20' :
                    'text-blue-400 bg-blue-400/20'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-display text-2xl font-semibold text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-body text-white/60 text-sm">
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-2xl apple-fade-in">
            <h2 className="text-display text-2xl font-semibold text-white mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link
                href="/dashboard/income"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <FiTrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Add Income</h3>
                  <p className="text-white/60 text-sm">Record your earnings</p>
                </div>
              </Link>
              <Link
                href="/dashboard/expenses"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                  <FiTrendingDown size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Add Expense</h3>
                  <p className="text-white/60 text-sm">Track your spending</p>
                </div>
              </Link>
              <Link
                href="/dashboard/savings"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <FiTarget size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Set Savings Goals</h3>
                  <p className="text-white/60 text-sm">Plan for your future</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl apple-fade-in">
            <h2 className="text-display text-2xl font-semibold text-white mb-6">
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {(() => {
                // Combine and sort all transactions by date (most recent first)
                const allTransactions = [
                  ...incomeTransactions.map(t => ({ ...t, type: 'income' })),
                  ...expenseTransactions.map(t => ({ ...t, type: 'expense' }))
                ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

                if (allTransactions.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-white/60">No transactions yet</p>
                      <p className="text-white/40 text-sm mt-2">Add some income or expenses to see them here</p>
                    </div>
                  );
                }

                return allTransactions.map((transaction) => (
                  <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                        transaction.type === 'income' 
                          ? 'from-green-500 to-emerald-600' 
                          : 'from-red-500 to-rose-600'
                      } flex items-center justify-center`}>
                        {transaction.type === 'income' ? (
                          <FiTrendingUp size={16} className="text-white" />
                        ) : (
                          <FiTrendingDown size={16} className="text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₱{transaction.amount.toLocaleString()}
                    </span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

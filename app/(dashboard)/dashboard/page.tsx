'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget } from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [incomeTransactions, setIncomeTransactions] = useState<any[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<any[]>([]);

  const loadData = async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    try {
      // Load income transactions from API
      const incomeResponse = await ApiClient.getIncomeTransactions();
      setIncomeTransactions(incomeResponse.transactions || []);

      // Load expense transactions from API
      const expenseResponse = await ApiClient.getExpenseTransactions();
      setExpenseTransactions(expenseResponse.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
      // Fallback to localStorage for development
      const savedIncome = localStorage.getItem('incomeTransactions');
      if (savedIncome) {
        setIncomeTransactions(JSON.parse(savedIncome));
      }
      const savedExpenses = localStorage.getItem('expenseTransactions');
      if (savedExpenses) {
        setExpenseTransactions(JSON.parse(savedExpenses));
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

  // Calculate totals
  const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  const savingsGoal = 15000; // You can make this configurable later
  const savingsProgress = Math.min((netBalance / savingsGoal) * 100, 100);

  const stats = [
    {
      title: 'Total Income',
      value: `₱${totalIncome.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive',
      icon: FiTrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Expenses',
      value: `₱${totalExpenses.toLocaleString()}`,
      change: '+5%',
      changeType: 'negative',
      icon: FiTrendingDown,
      color: 'from-red-500 to-rose-600'
    },
    {
      title: 'Net Balance',
      value: `₱${netBalance.toLocaleString()}`,
      change: netBalance >= 0 ? '+8%' : '-5%',
      changeType: netBalance >= 0 ? 'positive' : 'negative',
      icon: FiDollarSign,
      color: netBalance >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-500 to-rose-600'
    },
    {
      title: 'Savings Goal',
      value: `₱${savingsGoal.toLocaleString()}`,
      change: `${savingsProgress.toFixed(0)}%`,
      changeType: 'neutral',
      icon: FiTarget,
      color: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
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

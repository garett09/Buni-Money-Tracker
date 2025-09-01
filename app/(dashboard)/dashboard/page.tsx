'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget, FiDatabase, FiUpload } from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';
import { DataMigration } from '@/app/lib/dataMigration';
import { toast } from 'react-hot-toast';
import { SavingsCalculator } from '@/app/lib/savingsCalculator';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [incomeTransactions, setIncomeTransactions] = useState<any[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<any[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);

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

      // Load deposit history
      const history = SavingsCalculator.getDepositHistory();
      setDepositHistory(history);
      
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
          <div className="liquid-card p-6 rounded-2xl apple-fade-in border border-blue-500/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                <FiDatabase size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-display text-xl font-semibold mb-2">
                  Migrate Your Data to Database
                </h3>
                <p className="text-sm opacity-70">
                  You have local data that can be migrated to the database for better persistence and multi-device access.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleMigration}
                  disabled={migrating}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-white py-2 px-4 rounded-xl font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-300"
                >
                  <FiUpload size={16} />
                  {migrating ? 'Migrating...' : 'Migrate Now'}
                </button>
                <button
                  onClick={() => setShowMigrationPrompt(false)}
                  className="bg-white/10 hover:bg-white/20 text-white/60 py-2 px-4 rounded-xl font-medium text-sm hover:text-white transition-all duration-300"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl">
              <FiDollarSign size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>
                Here's your financial overview for today
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="liquid-card p-6 apple-slide-up apple-shimmer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center liquid-shape`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    stat.changeType === 'positive' ? 'bg-green-400/20' :
                    stat.changeType === 'negative' ? 'bg-red-400/20' :
                    'bg-blue-400/20'
                  }`}
                  style={{
                    color: stat.changeType === 'positive' ? '#10B981' :
                           stat.changeType === 'negative' ? '#EF4444' :
                           '#3B82F6'
                  }}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-display text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {stat.value}
                </h3>
                <p className="text-body text-sm" style={{ color: 'var(--text-muted)' }}>
                  {stat.title}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="liquid-card p-8 apple-fade-in">
            <h2 className="text-display text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
              Quick Actions
            </h2>
            <div className="space-y-6">
              <Link
                href="/dashboard/income"
                className="group relative overflow-hidden"
              >
                <div className="liquid-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center liquid-shape shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiTrendingUp size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Add Income</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Record your earnings</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl font-medium text-sm border border-green-500/30 group-hover:from-green-500/30 group-hover:to-emerald-600/30 transition-all duration-300"
                             style={{ color: '#10B981' }}>
                          <FiTrendingUp size={16} />
                          Add Income
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/expenses"
                className="group relative overflow-hidden"
              >
                <div className="liquid-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center liquid-shape-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiTrendingDown size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Add Expense</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Track your spending</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-rose-600/20 rounded-xl font-medium text-sm border border-red-500/30 group-hover:from-red-500/30 group-hover:to-rose-600/30 transition-all duration-300"
                             style={{ color: '#EF4444' }}>
                          <FiTrendingDown size={16} />
                          Add Expense
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/savings"
                className="group relative overflow-hidden"
              >
                <div className="liquid-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
                  <div className="relative">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="flex items-center gap-6 relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center liquid-shape-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <FiTarget size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Set Savings Goals</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Plan for your future</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-violet-600/20 rounded-xl font-medium text-sm border border-purple-500/30 group-hover:from-purple-500/30 group-hover:to-violet-600/30 transition-all duration-300"
                             style={{ color: '#8B5CF6' }}>
                          <FiTarget size={16} />
                          Set Goals
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Savings Section */}
          {savingsGoals.length > 0 && (
            <div className="liquid-card p-8 apple-fade-in">
              <h2 className="text-display text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
                Quick Savings
              </h2>
              <div className="space-y-4">
                {savingsGoals.slice(0, 3).map((goal) => {
                  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                  return (
                    <div key={goal.id} className="liquid-card p-6 rounded-2xl hover:scale-102 transition-all duration-300 group">
                      <div className="relative">
                        {/* Animated background gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                                <FiTarget size={20} className="text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{goal.name}</h3>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                  ₱{goal.currentAmount.toLocaleString()} / ₱{goal.targetAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{progress.toFixed(0)}%</span>
                              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Complete</div>
                            </div>
                          </div>
                          
                          <div className="relative mb-4">
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            {/* Progress glow effect */}
                            <div 
                              className="absolute top-0 h-3 bg-gradient-to-r from-purple-400/50 to-violet-500/50 rounded-full blur-sm transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Timeline info */}
                      {(() => {
                        const timeline = SavingsCalculator.calculateTimeline(
                          parseFloat(goal.targetAmount),
                          parseFloat(goal.currentAmount),
                          depositHistory,
                          goal.id
                        );
                        
                        return (
                          <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                            {timeline.days !== Infinity && timeline.days > 0 ? (
                              <span>⏱️ {SavingsCalculator.formatTimeline(timeline)} to goal</span>
                            ) : (
                              <span>📊 No deposit history yet</span>
                            )}
                          </div>
                        );
                      })()}
                      
                      <div className="flex gap-2">
                        {[100, 500, 1000].map((amount) => (
                          <button
                            key={amount}
                            onClick={async () => {
                              try {
                                const updatedGoal = {
                                  ...goal,
                                  currentAmount: (parseFloat(goal.currentAmount) + amount).toString()
                                };
                                
                                await ApiClient.updateSavingsGoal(goal.id, updatedGoal);
                                setSavingsGoals(savingsGoals.map(g => 
                                  g.id === goal.id ? updatedGoal : g
                                ));
                                
                                // Track deposit in history
                                SavingsCalculator.addDepositToHistory(amount, goal.id);
                                const updatedHistory = SavingsCalculator.getDepositHistory();
                                setDepositHistory(updatedHistory);
                                
                                toast.success(`₱${amount.toLocaleString()} added to ${goal.name}!`);
                              } catch (error) {
                                console.log('API not available, using localStorage fallback');
                                const updatedGoal = {
                                  ...goal,
                                  currentAmount: (parseFloat(goal.currentAmount) + amount).toString()
                                };
                                
                                const updatedGoals = savingsGoals.map(g => 
                                  g.id === goal.id ? updatedGoal : g
                                );
                                
                                setSavingsGoals(updatedGoals);
                                localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
                                
                                // Track deposit in history
                                SavingsCalculator.addDepositToHistory(amount, goal.id);
                                const updatedHistory = SavingsCalculator.getDepositHistory();
                                setDepositHistory(updatedHistory);
                                
                                toast.success(`₱${amount.toLocaleString()} added to ${goal.name}!`);
                              }
                            }}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors"
                            style={{ color: '#10B981' }}
                          >
                            +₱{amount}
                          </button>
                        ))}
                        <Link
                          href="/dashboard/savings"
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          More
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="liquid-card p-8 apple-fade-in">
            <h2 className="text-display text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
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
                      <p style={{ color: 'var(--text-muted)' }}>No transactions yet</p>
                      <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Add some income or expenses to see them here</p>
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
                        <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{transaction.description}</p>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold"
                          style={{
                            color: transaction.type === 'income' ? '#10B981' : '#EF4444'
                          }}>
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

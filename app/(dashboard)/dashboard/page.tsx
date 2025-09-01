'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';
import AnalyticsDashboard from '@/app/components/AnalyticsDashboard';
import EnhancedDashboard from '@/app/components/EnhancedDashboard';
import SmartNotifications from '@/app/components/SmartNotifications';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiTarget, 
  FiDatabase, 
  FiUpload,
  FiPieChart,
  FiBarChart,
  FiCalendar,
  FiCreditCard,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiZap,
  FiEye,
  FiDollarSign as FiDollar,
  FiShoppingBag,
  FiHome,
  FiTruck,
  FiWifi,
  FiCoffee,
  FiGift,
  FiBook,
  FiHeart,
  FiPlus,
  FiArrowRight,
  FiRefreshCw,
  FiStar,
  FiAward,
  FiUsers,
  FiShield,
  FiActivity,
  FiX
} from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';
import { DataMigration } from '@/app/lib/dataMigration';
import { toast } from 'react-hot-toast';
import { SavingsCalculator } from '@/app/lib/savingsCalculator';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [incomeTransactions, setIncomeTransactions] = useState<any[]>([]);
  const [expenseTransactions, setExpenseTransactions] = useState<any[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [depositHistory, setDepositHistory] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // week, month, quarter, year
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    }

    try {
      // Enhanced data loading with better error handling and validation
      const [incomeResponse, expenseResponse, savingsResponse, accountsResponse] = await Promise.allSettled([
        ApiClient.getIncomeTransactions(),
        ApiClient.getExpenseTransactions(),
        ApiClient.getSavingsGoals(),
        ApiClient.getAccounts()
      ]);

      // Handle income transactions
      if (incomeResponse.status === 'fulfilled') {
        const transactions = incomeResponse.value.transactions || [];
        // Validate and clean transaction data
        const validTransactions = transactions.filter((t: any) => 
          t && typeof t.amount === 'number' && t.amount > 0 && t.date
        );
        setIncomeTransactions(validTransactions);
        console.log(`Loaded ${validTransactions.length} income transactions from database`);
      } else {
        console.warn('Failed to load income transactions from API:', incomeResponse.reason);
        throw new Error('Income API failed');
      }

      // Handle expense transactions
      if (expenseResponse.status === 'fulfilled') {
        const transactions = expenseResponse.value.transactions || [];
        // Validate and clean transaction data
        const validTransactions = transactions.filter((t: any) => 
          t && typeof t.amount === 'number' && t.amount > 0 && t.date
        );
        setExpenseTransactions(validTransactions);
        console.log(`Loaded ${validTransactions.length} expense transactions from database`);
      } else {
        console.warn('Failed to load expense transactions from API:', expenseResponse.reason);
        throw new Error('Expense API failed');
      }

      // Handle savings goals
      if (savingsResponse.status === 'fulfilled') {
        const goals = savingsResponse.value.goals || [];
        const validGoals = goals.filter((g: any) => 
          g && typeof g.targetAmount === 'number' && g.targetAmount > 0
        );
        setSavingsGoals(validGoals);
        console.log(`Loaded ${validGoals.length} savings goals from database`);
      } else {
        console.warn('Failed to load savings goals from API:', savingsResponse.reason);
        // Don't throw error for savings goals as they're optional
      }

      // Handle accounts
      if (accountsResponse.status === 'fulfilled') {
        const accountsData = accountsResponse.value.accounts || [];
        const validAccounts = accountsData.filter((a: any) => 
          a && typeof a.currentBalance === 'number' && a.isActive
        );
        setAccounts(validAccounts);
        console.log(`Loaded ${validAccounts.length} accounts from database`);
      } else {
        console.warn('Failed to load accounts from API:', accountsResponse.reason);
        // Don't throw error for accounts as they're optional
      }

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load some data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast.success('Data refreshed successfully! 🔄');
  };

  const handleMigration = async () => {
    setMigrating(true);
    try {
      await DataMigration.migrateLocalDataToDatabase();
      await loadData();
      setShowMigrationPrompt(false);
      toast.success('Data migration completed successfully! 🎉');
    } catch (error) {
      console.error('Migration failed:', error);
      toast.error('Migration failed. Please try again.');
    } finally {
      setMigrating(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Check for data migration
    const hasMigrated = localStorage.getItem('dataMigrated');
    if (!hasMigrated && (incomeTransactions.length > 0 || expenseTransactions.length > 0)) {
      setShowMigrationPrompt(true);
    }
  }, []);

  // Calculate financial metrics
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
  const totalAccountBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);

  // Get recent transactions
  const recentTransactions = [...incomeTransactions, ...expenseTransactions]
    .sort((a, b) => new Date((b as any).date).getTime() - new Date((a as any).date).getTime())
    .slice(0, 5);

  // Get top spending categories
  const categorySpending = expenseTransactions.reduce((acc, t) => {
    const category = t.category || 'Other';
    acc[category] = (acc[category] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categorySpending)
    .map(([category, amount]) => ({ category, amount: amount as number }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const quickActions = [
    {
      title: 'Add Income',
      description: 'Record new income',
      icon: FiTrendingUp,
      href: '/dashboard/income',
      color: 'from-emerald-500 to-green-600',
      gradient: 'bg-gradient-to-br from-emerald-500/20 to-green-600/20'
    },
    {
      title: 'Add Expense',
      description: 'Track spending',
      icon: FiTrendingDown,
      href: '/dashboard/expenses',
      color: 'from-red-500 to-rose-600',
      gradient: 'bg-gradient-to-br from-red-500/20 to-rose-600/20'
    },
    {
      title: 'Set Goal',
      description: 'Create savings goal',
      icon: FiTarget,
      href: '/dashboard/savings',
      color: 'from-purple-500 to-violet-600',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-violet-600/20'
    },
    {
      title: 'Add Account',
      description: 'Link bank account',
      icon: FiCreditCard,
      href: '/dashboard/accounts',
      color: 'from-blue-500 to-cyan-600',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20'
    }
  ];

  const insights = [
    {
      type: 'success',
      icon: FiCheckCircle,
      title: 'Great Progress!',
      message: `You've saved ${savingsRate.toFixed(1)}% of your income this month.`,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      type: 'info',
      icon: FiActivity,
      title: 'Spending Insights',
      message: `Your top spending category is ${topCategories[0]?.category || 'General'} at ₱${topCategories[0]?.amount.toLocaleString() || '0'}.`,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      type: 'warning',
      icon: FiAlertCircle,
      title: 'Budget Alert',
      message: 'You\'re approaching your monthly budget limit. Consider reviewing your expenses.',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Loading your financial dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        {showWelcome && (
          <div className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.name || 'Adrian'}! 👋
                </h1>
                <p className="text-white/70 text-lg">
                  Here's your financial overview for {selectedPeriod === 'month' ? 'this month' : selectedPeriod}
                </p>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                <FiX size={20} className="text-white/60" />
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className="group liquid-card p-6 rounded-2xl backdrop-blur-lg border border-white/10 hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <action.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
              <p className="text-white/60 text-sm">{action.description}</p>
              <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm font-medium">
                <span>Get Started</span>
                <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                  <FiTrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Income</h3>
                  <p className="text-white/60 text-sm">This {selectedPeriod}</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 disabled:opacity-50"
              >
                <FiRefreshCw size={16} className={`text-white/60 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-3xl font-bold text-emerald-400 mb-2">
              ₱{totalIncome.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <FiArrowRight size={16} />
              <span>{incomeTransactions.length} transactions</span>
            </div>
          </div>

          <div className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                  <FiTrendingDown size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Total Expenses</h3>
                  <p className="text-white/60 text-sm">This {selectedPeriod}</p>
                </div>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-400 mb-2">
              ₱{totalExpenses.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <FiArrowRight size={16} />
              <span>{expenseTransactions.length} transactions</span>
            </div>
          </div>

          <div className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <FiDollarSign size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Net Balance</h3>
                  <p className="text-white/60 text-sm">This {selectedPeriod}</p>
                </div>
              </div>
            </div>
            <p className={`text-3xl font-bold mb-2 ${netBalance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ₱{netBalance.toLocaleString()}
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <FiArrowRight size={16} />
              <span>{savingsRate.toFixed(1)}% savings rate</span>
            </div>
          </div>
        </div>

        {/* Enhanced Dashboard Components */}
        <div className="space-y-8">
          <EnhancedDashboard
            incomeTransactions={incomeTransactions}
            expenseTransactions={expenseTransactions}
            selectedPeriod={selectedPeriod}
            loading={loading}
          />
        </div>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <div key={insight.title} className={`liquid-card p-6 rounded-2xl backdrop-blur-lg border border-white/10 ${insight.bgColor}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl ${insight.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <insight.icon size={20} className={insight.color} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">{insight.title}</h4>
                  <p className="text-white/70 text-sm">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            <Link
              href="/dashboard/transactions"
              className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
            >
              <span>View All</span>
              <FiArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-500/20' 
                        : 'bg-red-500/20'
                    }`}>
                      {transaction.type === 'income' ? (
                        <FiTrendingUp size={20} className="text-emerald-400" />
                      ) : (
                        <FiTrendingDown size={20} className="text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{transaction.description}</p>
                      <p className="text-white/60 text-sm">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₱{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-white/60 text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FiActivity size={48} className="mx-auto mb-4 text-white/40" />
                <p className="text-white/60 mb-4">No recent transactions</p>
                <Link
                  href="/dashboard/income"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-colors duration-300"
                >
                  <FiPlus size={16} />
                  Add Your First Transaction
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Data Migration Prompt */}
        {showMigrationPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10 max-w-md w-full">
              <div className="text-center">
                <FiDatabase size={48} className="mx-auto mb-4 text-emerald-400" />
                <h3 className="text-xl font-bold text-white mb-2">Data Migration Available</h3>
                <p className="text-white/70 mb-6">
                  We found existing data that can be migrated to our new system. This will improve your experience and data reliability.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleMigration}
                    disabled={migrating}
                    className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-colors duration-300 disabled:opacity-50"
                  >
                    {migrating ? 'Migrating...' : 'Migrate Now'}
                  </button>
                  <button
                    onClick={() => setShowMigrationPrompt(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-colors duration-300"
                  >
                    Later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

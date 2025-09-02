'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import BudgetSettings from './BudgetSettings';
import { IntelligentBudget } from '@/app/lib/intelligentBudget';
import { getUserMonthlyBudget } from '@/app/lib/currency';
import { HistoricalDataManager } from '@/app/lib/historicalData';
import { NotificationManager } from '@/app/lib/notificationManager';
import SmartNotifications from './SmartNotifications';
import LoadingStates from './LoadingStates';
import MobileResponsivenessTest from './MobileResponsivenessTest';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiTarget, 
  FiPieChart,
  FiBarChart,
  FiCalendar,
  FiActivity,
  FiEye,
  FiZap,
  FiAlertTriangle,
  FiCheckCircle,
  FiStar,
  FiShield,
  FiClock,
  FiCreditCard,
  FiAlertCircle,
  FiInfo,
  FiRefreshCw,
  FiSettings,
  FiDownload,
  FiUpload,
  FiFilter,
  FiSearch,
  FiX,
  FiSmartphone
} from 'react-icons/fi';

interface EnhancedDashboardProps {
  incomeTransactions: any[];
  expenseTransactions: any[];
  selectedPeriod: string;
  setSelectedPeriod?: React.Dispatch<React.SetStateAction<string>>;
  loading?: boolean;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({
  incomeTransactions,
  expenseTransactions,
  selectedPeriod,
  setSelectedPeriod,
  loading = false
}) => {
  // Utility functions - defined at the top to avoid hoisting issues
  const getCategoryColor = (index: number) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
    return colors[index % colors.length];
  };

  // Safe percentage calculation utility
  const safePercentage = (value: number, total: number, decimals: number = 1): string => {
    if (!total || total <= 0 || !value || value <= 0) return '0';
    const percentage = (value / total) * 100;
    return Math.min(100, Math.max(0, percentage)).toFixed(decimals);
  };

  // Safe division utility
  const safeDivide = (numerator: number, denominator: number, defaultValue: number = 0): number => {
    if (!denominator || denominator <= 0) return defaultValue;
    return numerator / denominator;
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [intelligentBudget, setIntelligentBudget] = useState<IntelligentBudget | null>(null);
  const [budgetForecast, setBudgetForecast] = useState<any>(null);
  const [showHistoricalData, setShowHistoricalData] = useState(false);
  const [userId, setUserId] = useState<string>('default-user');
  const [showMobileTest, setShowMobileTest] = useState(false);



  // Memoized calculations for better performance
  const analytics = useMemo(() => {
    if (loading || (incomeTransactions.length === 0 && expenseTransactions.length === 0)) {
      return null;
    }

    try {
      const allTransactions = [
        ...incomeTransactions.map(t => ({ ...t, type: 'income' as const })),
        ...expenseTransactions.map(t => ({ ...t, type: 'expense' as const }))
      ];

      const filteredTransactions = allTransactions.filter(t => {
        // Ensure transaction has valid data
        if (!t || !t.date || typeof t.amount !== 'number' || isNaN(t.amount)) {
          return false;
        }

        try {
          const transactionDate = new Date(t.date);
          if (isNaN(transactionDate.getTime())) {
            return false;
          }

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
            case 'all-time':
              return true;
            default:
              startDate.setMonth(now.getMonth() - 1);
          }
          
          const isInRange = transactionDate >= startDate;
          
          return isInRange;
        } catch (error) {
          return false;
        }
      });

      const income = filteredTransactions.filter(t => t.type === 'income');
      const expenses = filteredTransactions.filter(t => t.type === 'expense');
      
      const totalIncome = income.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const netBalance = totalIncome - totalExpenses;
      
      // Enhanced financial health calculation with safety checks
      const savingsRate = totalIncome > 0 ? Math.max(0, Math.min(100, (netBalance / totalIncome) * 100)) : 0;
      
      // Get budget from intelligent system or use default
      const savedSettings = localStorage.getItem('budgetSettings');
      const budgetSettings = savedSettings ? JSON.parse(savedSettings) : { monthlyBudget: getUserMonthlyBudget() };
      const monthlyBudget = budgetSettings.monthlyBudget || getUserMonthlyBudget();
      
      // Safe budget usage calculation
      const budgetUsagePercent = selectedPeriod === 'all-time' || monthlyBudget <= 0 ? 0 : 
        Math.min(100, Math.max(0, (totalExpenses / monthlyBudget) * 100));
      
      // Calculate financial health score with safety checks
      let healthScore = 0;
      
      // Savings rate (30% weight) - capped at 100%
      healthScore += Math.min(savingsRate / 20, 1) * 30;
      
      // Budget adherence (25% weight) - capped at 100%
      healthScore += selectedPeriod === 'all-time' ? 25 : Math.max(0, (100 - budgetUsagePercent) / 100) * 25;
      
      // Income stability (20% weight) - simplified but safe
      healthScore += 20;
      
      // Emergency fund (15% weight) - safe calculation
      if (totalExpenses > 0) {
        healthScore += Math.min(netBalance / (totalExpenses * 3), 1) * 15;
      } else {
        healthScore += 15; // Full points if no expenses
      }
      
      // Debt ratio (10% weight) - safe calculation
      if (totalIncome > 0) {
        healthScore += Math.max(0, (1 - (totalExpenses / totalIncome))) * 10;
      } else {
        healthScore += 10; // Full points if no income
      }
      
      // Category analysis
      const categoryBreakdown: { [key: string]: number } = {};
      expenses.forEach(t => {
        // Ensure we have valid transaction data
        if (t && typeof t.amount === 'number' && !isNaN(t.amount)) {
          const category = t.category || 'Other';
          categoryBreakdown[category] = (categoryBreakdown[category] || 0) + Math.abs(t.amount);
        }
      });
      
      const topCategories = Object.entries(categoryBreakdown)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      // Spending velocity with safe calculations
      const totalExpenseAmount = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const dailySpending = safeDivide(totalExpenseAmount, 30, 0);
      const weeklySpending = dailySpending * 7;
      const monthlyProjection = dailySpending * 30;

      // Anomaly detection
      const amounts = expenses.map(t => Math.abs(t.amount));
      const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
      const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
      const standardDeviation = Math.sqrt(variance);
      const unusualSpending = expenses.filter(t => Math.abs(t.amount) > mean + (2 * standardDeviation));

      const result = {
        totalIncome,
        totalExpenses,
        netBalance,
        savingsRate: Math.max(0, Math.min(100, savingsRate)), // Ensure savings rate is between 0-100%
        budgetUsagePercent: Math.max(0, Math.min(100, budgetUsagePercent)), // Ensure budget usage is between 0-100%
        healthScore: Math.max(0, Math.min(100, Math.round(healthScore))), // Ensure health score is between 0-100%
        topCategories,
        dailySpending,
        weeklySpending,
        monthlyProjection,
        unusualSpending,
        transactionCount: allTransactions.length,
        incomeCount: income.length,
        expenseCount: expenses.length
      };

      return result;
    } catch (error) {
      return null;
    }
  }, [incomeTransactions, expenseTransactions, selectedPeriod, loading]);

  // Chart data helper functions
  const getDailySpendingData = () => {
    const daily: { [key: string]: number } = {};
    const expenses = expenseTransactions.filter(t => {
      const transactionDate = new Date(t.date);
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
        case 'all-time':
          return true;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }
      
      return transactionDate >= startDate;
    });

    expenses.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      daily[date] = (daily[date] || 0) + Math.abs(t.amount);
    });

    const result = Object.entries(daily)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Show last 10 days

    // If no data, provide sample data for demonstration
    if (result.length === 0) {
      const today = new Date();
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString(),
          amount: Math.floor(Math.random() * 5000) + 1000 // Random spending between ₱1,000-₱6,000
        };
      });
    }

    return result;
  };

  const getCategoryPieData = () => {
    if (!analytics?.topCategories || analytics.topCategories.length === 0) {
      // Provide sample data if no categories exist
      return [
        { name: 'Food & Dining', value: 2500 },
        { name: 'Transportation', value: 1800 },
        { name: 'Shopping', value: 1200 },
        { name: 'Entertainment', value: 800 },
        { name: 'Utilities', value: 600 }
      ];
    }
    
    return analytics.topCategories.map(category => ({
      name: category.category,
      value: category.amount
    }));
  };

  const getIncomeExpenseData = () => {
    const income = incomeTransactions.filter(t => {
      const transactionDate = new Date(t.date);
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
        case 'all-time':
          return true;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }
      
      return transactionDate >= startDate;
    });

    const expenses = expenseTransactions.filter(t => {
      const transactionDate = new Date(t.date);
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
        case 'all-time':
          return true;
        default:
          startDate.setMonth(now.getMonth() - 1);
      }
      
      return transactionDate >= startDate;
    });

    const totalIncome = income.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // If no data, provide sample data
    if (totalIncome === 0 && totalExpenses === 0) {
      return [
        {
          category: 'Income',
          income: getUserMonthlyBudget(), // User's current budget
          expenses: 0
        },
        {
          category: 'Expenses',
          income: 0,
          expenses: 35000
        }
      ];
    }

    return [
      {
        category: 'Income',
        income: totalIncome,
        expenses: 0
      },
      {
        category: 'Expenses',
        income: 0,
        expenses: totalExpenses
      }
    ];
  };

  // Prediction chart helper functions
  const getForecastData = () => {
    if (!analytics) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const isCurrentOrFuture = index >= currentMonth;
      const currentTrend = isCurrentOrFuture ? analytics.monthlyProjection : analytics.totalExpenses;
      const recommendedBudget = budgetForecast?.recommendedBudget || getUserMonthlyBudget(); // User's current budget
      
      return {
        month,
        current: currentTrend,
        recommended: recommendedBudget
      };
    });
  };

  const getSpendingPredictionData = () => {
    if (!analytics) return [];
    
    return analytics.topCategories.slice(0, 5).map(category => {
      const currentAmount = category.amount;
      const predictedAmount = currentAmount * 1.1; // Simple prediction: 10% increase
      
      return {
        category: category.category,
        current: currentAmount,
        predicted: predictedAmount
      };
    });
  };

  // Enhanced prediction helper functions
  const getSpendingTrendsData = () => {
    if (!analytics) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const isCurrentOrFuture = index >= currentMonth;
      const actualSpending = isCurrentOrFuture ? analytics.monthlyProjection : analytics.totalExpenses;
      const predictedSpending = actualSpending * (1 + (index - currentMonth) * 0.05); // 5% monthly growth
      const budgetLimit = getUserMonthlyBudget(); // User's current budget
      
      return {
        month,
        actual: actualSpending,
        predicted: predictedSpending,
        budget: budgetLimit
      };
    });
  };

  const getCategoryPredictionData = () => {
    if (!analytics) return [];
    
    return analytics.topCategories.slice(0, 6).map(category => {
      const currentAmount = category.amount;
      const predictedAmount = currentAmount * (1 + Math.random() * 0.2 - 0.1); // ±10% variation
      
      return {
        category: category.category,
        current: currentAmount,
        predicted: predictedAmount
      };
    });
  };

  const getCategoryInsights = () => {
    if (!analytics) return [];
    
    return analytics.topCategories.slice(0, 4).map(category => {
      const currentAmount = category.amount;
      const predictedAmount = currentAmount * (1 + Math.random() * 0.2 - 0.1);
      const trend = predictedAmount > currentAmount ? 'up' : 'down';
      const change = Math.abs(predictedAmount - currentAmount);
      
      return {
        category: category.category,
        current: currentAmount,
        predicted: predictedAmount,
        trend,
        message: trend === 'up' 
          ? `Expected to increase by ₱${change.toLocaleString()} next month`
          : `Expected to decrease by ₱${change.toLocaleString()} next month`
      };
    });
  };

  const getSavingsProjectionData = () => {
    if (!analytics) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const isCurrentOrFuture = index >= currentMonth;
      const baseSavings = analytics.netBalance;
      const monthlySavings = isCurrentOrFuture ? baseSavings * (1 + index - currentMonth) : baseSavings;
      const investmentGrowth = monthlySavings * 0.1; // 10% investment return
      
      return {
        month,
        savings: monthlySavings,
        investment: investmentGrowth
      };
    });
  };

  const getSavingsGoalsProgress = () => {
    // Sample savings goals - in a real app, this would come from user data
    return [
      { name: 'Emergency Fund', progress: 75 },
      { name: 'Vacation Fund', progress: 45 },
      { name: 'Investment Portfolio', progress: 30 },
      { name: 'Home Down Payment', progress: 15 }
    ];
  };

  // Initialize intelligent budget system
  useEffect(() => {
    if (incomeTransactions.length > 0 || expenseTransactions.length > 0) {
      const allTransactions = [
        ...incomeTransactions.map(t => ({ ...t, type: 'income' as const })),
        ...expenseTransactions.map(t => ({ ...t, type: 'expense' as const }))
      ];

      const savedSettings = localStorage.getItem('budgetSettings');
      const initialSettings = savedSettings ? JSON.parse(savedSettings) : null;

      const ib = new IntelligentBudget(allTransactions, initialSettings);
      setIntelligentBudget(ib);
      
      const forecast = ib.generateForecast();
      setBudgetForecast(forecast);

      // Archive current month's data for historical analysis
      if (analytics) {
        const currentData = {
          budgetPerformance: {
            monthlyBudget: getUserMonthlyBudget(),
            totalExpenses: analytics.totalExpenses,
            totalIncome: analytics.totalIncome,
            netBalance: analytics.netBalance,
            budgetUsagePercent: analytics.budgetUsagePercent,
            savingsRate: analytics.savingsRate,
            financialHealthScore: analytics.healthScore,
            status: analytics.budgetUsagePercent > 100 ? 'over-budget' :
                   analytics.budgetUsagePercent > 90 ? 'critical' :
                   analytics.budgetUsagePercent > 80 ? 'on-track' : 'under-budget',
            categoryBreakdown: analytics.topCategories.reduce((acc, cat) => {
              acc[cat.category] = cat.amount;
              return acc;
            }, {} as { [key: string]: number }),
            unusualTransactions: analytics.unusualSpending.length,
            recommendations: []
          },
          spendingTrends: {
            dailyAverage: analytics.dailySpending,
            weeklyAverage: analytics.weeklySpending,
            monthlyTotal: analytics.totalExpenses,
            topCategories: analytics.topCategories,
            spendingVelocity: analytics.dailySpending,
            seasonalFactor: 1
          },
          financialHealth: {
            overallScore: analytics.healthScore,
            savingsScore: analytics.savingsRate,
            budgetScore: 100 - analytics.budgetUsagePercent,
            incomeStabilityScore: 20,
            emergencyFundScore: Math.min(analytics.netBalance / (analytics.totalExpenses * 3), 1) * 15,
            debtScore: Math.max(0, (1 - (analytics.totalExpenses / analytics.totalIncome))) * 10,
            cashFlowScore: analytics.netBalance > 0 ? 20 : 10,
            insights: []
          }
        };

        // Archive data in background for historical analysis
        HistoricalDataManager.archiveMonthlyData(userId, currentData).catch(console.error);

        // Generate persistent notifications
        generateNotifications(userId, analytics, currentData);
      }
    }
  }, [incomeTransactions, expenseTransactions, analytics, userId]);

  // Generate persistent notifications
  const generateNotifications = async (userId: string, analytics: any, currentData: any) => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const currentYear = new Date().getFullYear();

      // Generate budget notifications
      await NotificationManager.generateBudgetNotifications(userId, {
        monthlyBudget: getUserMonthlyBudget(),
        totalExpenses: analytics.totalExpenses,
        budgetUsagePercent: analytics.budgetUsagePercent,
        month: currentMonth,
        year: currentYear
      });

      // Generate spending notifications
      await NotificationManager.generateSpendingNotifications(userId, {
        totalExpenses: analytics.totalExpenses,
        dailyAverage: analytics.dailySpending,
        unusualTransactions: analytics.unusualSpending.length,
        topCategories: analytics.topCategories,
        month: currentMonth,
        year: currentYear
      });

      // Generate savings notifications
      await NotificationManager.generateSavingsNotifications(userId, {
        totalIncome: analytics.totalIncome,
        netBalance: analytics.netBalance,
        savingsRate: analytics.savingsRate,
        month: currentMonth,
        year: currentYear
      });

      // Generate historical notifications if we have historical data
      try {
        const historicalData = await HistoricalDataManager.getHistoricalBudgetPerformance(userId, 2);
        if (historicalData.length >= 2) {
          const currentMonthData = historicalData[0];
          const previousMonthData = historicalData[1];
          
          const budgetAdherenceChange = (100 - currentMonthData.budgetUsagePercent) - (100 - previousMonthData.budgetUsagePercent);
          
          await NotificationManager.generateHistoricalNotifications(userId, {
            month: currentMonth,
            year: currentYear,
            budgetAdherenceChange,
            savingsTrend: currentMonthData.savingsRate > previousMonthData.savingsRate ? 'increasing' : 'decreasing',
            spendingTrend: currentMonthData.totalExpenses < previousMonthData.totalExpenses ? 'decreasing' : 'increasing',
            insights: []
          });
        }
      } catch (error) {
        // Historical notifications are optional, don't fail if they can't be generated
        console.log('Could not generate historical notifications:', error);
      }
    } catch (error) {
      console.error('Failed to generate notifications:', error);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      setRefreshKey(prev => prev + 1);
      toast.success('Data refreshed successfully! 🔄');
    } catch (error) {
      toast.error('Refresh failed. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      // Create CSV data for export
      const csvData = [
        ['Category', 'Amount', 'Type', 'Date'],
        ...incomeTransactions.map(t => [t.category || 'Income', t.amount, 'Income', t.date]),
        ...expenseTransactions.map(t => [t.category || 'Expense', t.amount, 'Expense', t.date])
      ];
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `financial-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully! 📊');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSettings = () => {
    setShowBudgetSettings(true);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="liquid-card p-8 rounded-3xl">
            <div className="animate-pulse">
              <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="liquid-card p-8 rounded-3xl text-center">
        <FiBarChart size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
        <p style={{ color: 'var(--text-muted)' }}>No data available for analytics</p>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Add some transactions to see detailed insights
        </p>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  // Helper functions for enhanced overview data
  const getDaysLeftInMonth = () => {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.getDate() - today.getDate();
  };

  const getRemainingBudget = () => {
    const monthlyBudget = getUserMonthlyBudget();
    const remaining = monthlyBudget - analytics.totalExpenses;
    return Math.max(0, remaining); // Ensure we don't show negative remaining budget
  };

  const getDailyBudgetLimit = () => {
    const remainingBudget = getRemainingBudget();
    const daysLeft = getDaysLeftInMonth();
    
    // Handle edge cases
    if (daysLeft <= 0) return 0;
    if (remainingBudget <= 0) return 0;
    
    return Math.round(remainingBudget / daysLeft);
  };

  const getOverspendingRisk = () => {
    const monthlyBudget = getUserMonthlyBudget();
    const budgetUsage = analytics.budgetUsagePercent;
    const daysLeft = getDaysLeftInMonth();
    
    if (budgetUsage > 100) return true;
    if (budgetUsage > 80 && daysLeft < 7) return true;
    if (budgetUsage > 70 && daysLeft < 14) return true;
    return false;
  };

  const getIncomeFrequency = () => {
    if (analytics.incomeCount === 0) return 'None';
    if (analytics.incomeCount === 1) return 'Once this month';
    if (analytics.incomeCount <= 3) return 'Few times';
    if (analytics.incomeCount <= 8) return 'Weekly';
    return 'Multiple times per week';
  };

  const getExpenseFrequency = () => {
    if (analytics.expenseCount === 0) return 'None';
    if (analytics.expenseCount <= 5) return 'Low';
    if (analytics.expenseCount <= 15) return 'Moderate';
    if (analytics.expenseCount <= 30) return 'High';
    return 'Very High';
  };

  const getCashFlowTrend = () => {
    if (analytics.netBalance > 0) return 'positive';
    return 'negative';
  };

  const getEmergencyFundStatus = () => {
    const monthlyExpenses = analytics.totalExpenses;
    const savings = analytics.netBalance > 0 ? analytics.netBalance : 0;
    
    if (savings >= monthlyExpenses * 3) return 'healthy';
    if (savings >= monthlyExpenses * 1) return 'building';
    return 'needs attention';
  };

  const getPeakSpendingDay = () => {
    // Calculate based on available data - using daily spending average
    const today = new Date();
    const dayOfWeek = today.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    // Simple logic: assume weekends have higher spending
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'Weekend';
    return days[dayOfWeek];
  };

  const getMostExpensiveWeek = () => {
    // Calculate current week number
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const days = Math.floor((today.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);
    return weekNumber;
  };

  const getSpendingMomentum = () => {
    // Simple momentum calculation based on budget usage
    const budgetUsage = analytics.budgetUsagePercent;
    const daysLeft = getDaysLeftInMonth();
    
    if (budgetUsage > 100) return 'increasing';
    if (budgetUsage > 80 && daysLeft < 7) return 'increasing';
    if (budgetUsage < 50 && daysLeft > 15) return 'slowing';
    return 'stable';
  };

  const getSavingsGoalProgress = () => {
    const monthlyBudget = getUserMonthlyBudget();
    const savings = analytics.netBalance > 0 ? analytics.netBalance : 0;
    const goal = monthlyBudget * 0.2; // 20% savings goal
    
    // Handle edge cases
    if (goal <= 0) return 0;
    if (savings <= 0) return 0;
    
    const progress = Math.min(100, Math.round((savings / goal) * 100));
    return Math.max(0, progress); // Ensure progress is not negative
  };

  const getBudgetGoalProgress = () => {
    const monthlyBudget = getUserMonthlyBudget();
    const used = analytics.totalExpenses;
    
    return Math.min(100, Math.round((used / monthlyBudget) * 100));
  };

  const getDebtReductionProgress = () => {
    // This is a placeholder - you can implement actual debt tracking logic
    const monthlyIncome = analytics.totalIncome;
    const monthlyExpenses = analytics.totalExpenses;
    const savings = monthlyIncome - monthlyExpenses;
    
    if (savings <= 0) return 0;
    if (savings >= monthlyIncome * 0.3) return 100;
    return Math.round((savings / (monthlyIncome * 0.3)) * 100);
  };

  const getInvestmentReadiness = () => {
    const emergencyFund = getEmergencyFundStatus();
    const savingsRate = analytics.savingsRate;
    const budgetAdherence = 100 - analytics.budgetUsagePercent;
    
    if (emergencyFund === 'healthy' && savingsRate >= 20 && budgetAdherence >= 80) {
      return 'ready';
    }
    return 'building';
  };

  // Show loading state while data is being processed
  if (loading) {
    return <LoadingStates type="dashboard" size="large" message="Loading your financial dashboard..." />;
  }

  return (
    <div className="space-y-8" key={refreshKey}>
      {/* Enhanced Header with Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Financial Analytics
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg liquid-button transition-all duration-300 disabled:opacity-50"
              title="Refresh data"
            >
              <FiRefreshCw 
                size={16} 
                className={`${isRefreshing ? 'animate-spin' : ''}`}
                style={{ color: 'var(--text-muted)' }} 
              />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg liquid-button transition-all duration-300"
              title="Show filters"
            >
              <FiFilter size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <SmartNotifications 
            incomeTransactions={incomeTransactions}
            expenseTransactions={expenseTransactions}
            savingsGoals={[]}
            selectedPeriod={selectedPeriod}
          />
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="p-2 rounded-lg liquid-button transition-all duration-300 disabled:opacity-50" 
            title="Export data"
          >
            <FiDownload 
              size={16} 
              className={`${isDownloading ? 'animate-pulse' : ''}`}
              style={{ color: 'var(--text-muted)' }} 
            />
          </button>
          <button 
            onClick={handleSettings}
            className="p-2 rounded-lg liquid-button transition-all duration-300" 
            title="Settings"
          >
            <FiSettings size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
          <button 
            onClick={() => setShowMobileTest(!showMobileTest)}
            className="p-2 rounded-lg liquid-button transition-all duration-300" 
            title="Mobile Responsiveness Test"
          >
            <FiSmartphone size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      {/* Enhanced Analytics Tabs */}
      <div className="flex items-center gap-1 sm:gap-2 liquid-card rounded-xl p-1 h-12">
        {[
          { id: 'overview', label: 'Overview', icon: FiEye },
          { id: 'trends', label: 'Trends', icon: FiTrendingUp },
          { id: 'insights', label: 'Insights', icon: FiZap },
          { id: 'budget', label: 'Budget', icon: FiShield },
          { id: 'predictions', label: 'Predictions', icon: FiTarget },
          { id: 'historical', label: 'Historical', icon: FiCalendar }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'liquid-button text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} className="sm:text-base" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.charAt(0)}</span>
          </button>
        ))}
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="liquid-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Data Filters
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiX size={16} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Date Range
              </label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod?.(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="all-time">All Time</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Transaction Type
              </label>
              <select 
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expenses">Expenses Only</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                Category
              </label>
              <select 
                className="w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              >
                <option value="all">All Categories</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transportation</option>
                <option value="entertainment">Entertainment</option>
                <option value="shopping">Shopping</option>
                <option value="utilities">Utilities</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setSelectedPeriod?.('month');
                setShowFilters(false);
              }}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Enhanced Financial Health Score */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Financial Health Score
              </h3>
              <div className="flex items-center gap-2">
                <FiActivity size={24} style={{ color: 'var(--text-muted)' }} />
                <span className={`text-sm font-medium ${getHealthColor(analytics.healthScore)}`}>
                  {getHealthStatus(analytics.healthScore)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="var(--text-muted)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={analytics.healthScore >= 80 ? 'var(--accent-green)' : 
                             analytics.healthScore >= 60 ? 'var(--accent-orange)' : 'var(--accent-red)'}
                      strokeWidth="8"
                      strokeDasharray={((analytics.healthScore / 100) * 339.292) + ' 339.292'}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getHealthColor(analytics.healthScore)}`}>
                        {analytics.healthScore}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        /100
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {getHealthStatus(analytics.healthScore)}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--overlay-light)' }}>
                  <div className="flex items-center gap-2">
                    <FiTrendingUp size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Savings Rate</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.savingsRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--overlay-light)' }}>
                  <div className="flex items-center gap-2">
                    <FiShield size={16} className="text-blue-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Budget Adherence</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {(100 - analytics.budgetUsagePercent).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--overlay-light)' }}>
                  <div className="flex items-center gap-2">
                    <FiActivity size={16} className="text-purple-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Cash Flow</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.netBalance.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl liquid-card">
                  <div className="flex items-center gap-2">
                    <FiCreditCard size={16} className="text-yellow-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Total Transactions</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.transactionCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl liquid-card">
                  <div className="flex items-center gap-2">
                    <FiClock size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Income Count</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.incomeCount}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl liquid-card">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle size={16} className="text-red-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Expense Count</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.expenseCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Income vs Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Income vs Expenses
                </h3>
                <FiBarChart size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10">
                  <div className="flex items-center gap-3">
                    <FiTrendingUp size={20} className="text-green-400" />
                    <span style={{ color: 'var(--text-primary)' }}>Total Income</span>
                  </div>
                  <span className="font-bold text-green-400">
                    ₱{analytics.totalIncome.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10">
                  <div className="flex items-center gap-3">
                    <FiTrendingDown size={20} className="text-red-400" />
                    <span style={{ color: 'var(--text-primary)' }}>Total Expenses</span>
                  </div>
                  <span className="font-bold text-red-400">
                    ₱{analytics.totalExpenses.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10">
                  <div className="flex items-center gap-3">
                    <FiDollarSign size={20} className="text-blue-400" />
                    <span style={{ color: 'var(--text-primary)' }}>Net Balance</span>
                  </div>
                  <span className={`font-bold ${analytics.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.netBalance >= 0 ? '+' : ''}₱{analytics.netBalance.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10">
                  <div className="flex items-center gap-3">
                    <FiTarget size={20} className="text-purple-400" />
                    <span style={{ color: 'var(--text-primary)' }}>Savings Rate</span>
                  </div>
                  <span className="font-bold text-purple-400">
                    {analytics.savingsRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Spending Velocity */}
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Spending Velocity
                </h3>
                <FiActivity size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl liquid-card">
                  <span style={{ color: 'var(--text-muted)' }}>Daily Average</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.dailySpending.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl liquid-card">
                  <span style={{ color: 'var(--text-muted)' }}>Weekly Average</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.weeklySpending.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl liquid-card">
                  <span style={{ color: 'var(--text-muted)' }}>Monthly Projection</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.monthlyProjection.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl liquid-card">
                  <span style={{ color: 'var(--text-muted)' }}>Unusual Transactions</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.unusualSpending.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Budget Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Budget Insights
                </h3>
                <FiTarget size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiCalendar size={16} className="text-blue-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Days Left in Month</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getDaysLeftInMonth()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiTrendingUp size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Remaining Budget</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{getRemainingBudget().toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiClock size={16} className="text-yellow-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Daily Budget Limit</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{getDailyBudgetLimit().toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiAlertCircle size={16} className="text-red-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Overspending Risk</span>
                  </div>
                  <span className={`font-semibold ${getOverspendingRisk() ? 'text-red-400' : 'text-green-400'}`}>
                    {getOverspendingRisk() ? 'High' : 'Low'}
                  </span>
                </div>
              </div>
            </div>

            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Cash Flow Analysis
                </h3>
                <FiDollarSign size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiTrendingUp size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Income Frequency</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getIncomeFrequency()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiTrendingDown size={16} className="text-red-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Expense Frequency</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getExpenseFrequency()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiActivity size={16} className="text-purple-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Cash Flow Trend</span>
                  </div>
                  <span className={`font-semibold ${getCashFlowTrend() === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                    {getCashFlowTrend() === 'positive' ? '↗ Improving' : '↘ Declining'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiTarget size={16} className="text-blue-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Emergency Fund Status</span>
                  </div>
                  <span className={`font-semibold ${getEmergencyFundStatus() === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {getEmergencyFundStatus() === 'healthy' ? 'Healthy' : 'Needs Attention'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Spending Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Spending Patterns
                </h3>
                <FiBarChart size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiClock size={16} className="text-blue-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Peak Spending Day</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getPeakSpendingDay()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiCalendar size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Most Expensive Week</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Week {getMostExpensiveWeek()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiTrendingUp size={16} className="text-purple-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Spending Momentum</span>
                  </div>
                  <span className={`font-semibold ${getSpendingMomentum() === 'increasing' ? 'text-red-400' : 'text-green-400'}`}>
                    {getSpendingMomentum() === 'increasing' ? '↗ Accelerating' : '↘ Slowing'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiAlertCircle size={16} className="text-yellow-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Unusual Spending</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.unusualSpending.length} transactions
                  </span>
                </div>
              </div>
            </div>

            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Financial Goals Progress
                </h3>
                <FiTarget size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiTrendingUp size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Savings Goal Progress</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getSavingsGoalProgress()}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiShield size={16} className="text-blue-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Budget Goal Progress</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getBudgetGoalProgress()}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiActivity size={16} className="text-purple-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Debt Reduction</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {getDebtReductionProgress()}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <div className="flex items-center gap-3">
                    <FiTarget size={16} className="text-yellow-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Investment Readiness</span>
                  </div>
                  <span className={`font-semibold ${getInvestmentReadiness() === 'ready' ? 'text-green-400' : 'text-blue-400'}`}>
                    {getInvestmentReadiness() === 'ready' ? 'Ready' : 'Building'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Insights */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Quick Actions & Insights
              </h3>
              <FiZap size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <FiTrendingUp size={20} className="text-blue-400" />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Spending Alert
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                  {getOverspendingRisk() ? 'You\'re at risk of overspending this month' : 'Your spending is on track'}
                </p>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  View Details →
                </button>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <FiTarget size={20} className="text-green-400" />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Savings Goal
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                  {getSavingsGoalProgress()}% of your monthly savings goal achieved
                </p>
                <button className="text-xs text-green-400 hover:text-green-300 transition-colors">
                  Set Goals →
                </button>
              </div>
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <FiCalendar size={20} className="text-yellow-400" />
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Budget Timeline
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
                  {getDaysLeftInMonth()} days left with ₱{getDailyBudgetLimit().toLocaleString()} daily limit
                </p>
                <button className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors">
                  Adjust Budget →
                </button>
              </div>
            </div>
          </div>

          {/* Top Spending Categories */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Top Spending Categories
              </h3>
              <FiPieChart size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            {analytics && analytics.topCategories && analytics.topCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.topCategories.map((category, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {category.category}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {analytics.totalExpenses > 0 ? ((category.amount / analytics.totalExpenses) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="text-lg font-bold text-blue-400">
                      ₱{category.amount.toLocaleString()}
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${analytics.totalExpenses > 0 ? (category.amount / analytics.totalExpenses) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center">
                  <FiPieChart size={32} className="text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {loading ? 'Loading spending data...' : 'Start Tracking Your Spending'}
                </h4>
                <p className="text-base mb-4" style={{ color: 'var(--text-muted)' }}>
                  {loading ? 'Please wait while we process your transactions' : 
                   'Add your first expense transaction to see your spending breakdown and insights'}
                </p>
                {!loading && (
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('expenses')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      Add Your First Expense
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-8">
          {/* Spending Trends Chart */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Spending Trends
              </h3>
              <FiTrendingUp size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getDailySpendingData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₱${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Spending']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--accent-blue)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--accent-blue)', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: 'var(--accent-blue)', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Analysis Chart */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Category Analysis
              </h3>
              <FiPieChart size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Pie Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getCategoryPieData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getCategoryPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--card-bg)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        boxShadow: 'var(--shadow-lg)'
                      }}
                      formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Amount']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span style={{ color: 'var(--text-primary)' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

                              {/* Category Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Category Breakdown
                  </h4>
                  {(analytics?.topCategories && analytics.topCategories.length > 0 ? analytics.topCategories : [
                    { category: 'Food & Dining', amount: 2500 },
                    { category: 'Transportation', amount: 1800 },
                    { category: 'Shopping', amount: 1200 },
                    { category: 'Entertainment', amount: 800 },
                    { category: 'Utilities', amount: 600 }
                  ]).map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl liquid-card">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getCategoryColor(index) }}
                        />
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {category.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          ₱{category.amount.toLocaleString()}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {analytics?.totalExpenses && analytics.totalExpenses > 0 ? 
                            ((category.amount / analytics.totalExpenses) * 100).toFixed(1) : '0'}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>

          {/* Income vs Expenses Comparison */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Income vs Expenses
              </h3>
              <FiBarChart size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getIncomeExpenseData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" />
                  <XAxis 
                    dataKey="category" 
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₱${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="income" fill="var(--accent-green)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="var(--accent-red)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-8">
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Smart Insights
              </h3>
              <FiZap size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="space-y-4">
              {analytics.savingsRate < 10 && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiAlertTriangle size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Low Savings Rate
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Your savings rate is {analytics.savingsRate.toFixed(1)}%. Consider increasing it to at least 20% for better financial security.
                    </p>
                  </div>
                </div>
              )}
              
              {analytics.budgetUsagePercent > 90 && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiAlertCircle size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Budget Alert
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      You've used {analytics.budgetUsagePercent.toFixed(1)}% of your budget. Consider reducing non-essential expenses.
                    </p>
                  </div>
                </div>
              )}
              
              {analytics.unusualSpending.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiInfo size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Unusual Spending Detected
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {analytics.unusualSpending.length} transaction(s) are significantly higher than your average. Review these for potential savings.
                    </p>
                  </div>
                </div>
              )}
              
              {analytics.netBalance > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <FiCheckCircle size={16} className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Great Job!
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      You're spending less than you earn. Keep up the good work!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-8">
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Budget Overview
              </h3>
              <FiShield size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  ₱{getUserMonthlyBudget().toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Monthly Budget</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-red-400 mb-2">
                  ₱{analytics.totalExpenses.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Spent</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/5">
                <div className={`text-2xl font-bold mb-2 ${
                  (getUserMonthlyBudget() - analytics.totalExpenses) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ₱{(getUserMonthlyBudget() - analytics.totalExpenses).toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Remaining</div>
              </div>
            </div>
            
            {/* Budget Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-muted)' }}>Budget Usage</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {((analytics.totalExpenses / getUserMonthlyBudget()) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    (analytics.totalExpenses / getUserMonthlyBudget()) > 1 ? 'bg-red-500' :
                    (analytics.totalExpenses / getUserMonthlyBudget()) > 0.9 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min((analytics.totalExpenses / getUserMonthlyBudget()) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-8">
          {/* Financial Forecast Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="liquid-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingUp size={24} className="text-green-400" />
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Next Month Income
                </h3>
              </div>
              <p className="text-3xl font-bold text-green-400 mb-2">
                ₱{analytics.totalIncome.toLocaleString()}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Based on current patterns
              </p>
            </div>

            <div className="liquid-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingDown size={24} className="text-red-400" />
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Next Month Expenses
                </h3>
              </div>
              <p className="text-3xl font-bold text-red-400 mb-2">
                ₱{analytics.monthlyProjection.toLocaleString()}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Predicted spending
              </p>
            </div>

            <div className="liquid-card p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <FiTarget size={24} className="text-blue-400" />
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Net Prediction
                </h3>
              </div>
              <p className={`text-3xl font-bold mb-2 ${analytics.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₱{analytics.netBalance.toLocaleString()}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {analytics.netBalance >= 0 ? 'Expected profit' : 'Expected deficit'}
              </p>
            </div>
          </div>

          {/* Spending Trends Forecast */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Spending Trends Forecast
              </h3>
              <FiActivity size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getSpendingTrendsData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₱${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                    formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Amount']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                    name="Actual Spending"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    name="Predicted Spending"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: '#F59E0B', strokeWidth: 2 }}
                    name="Budget Limit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Spending Predictions */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Category Spending Predictions
              </h3>
              <FiPieChart size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryPredictionData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="category" 
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₱${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'var(--text-primary)'
                      }}
                      formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Amount']}
                    />
                    <Bar dataKey="current" fill="#EF4444" radius={[4, 4, 0, 0]} name="Current Month" />
                    <Bar dataKey="predicted" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Next Month" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Category Insights */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Category Insights
                </h4>
                {getCategoryInsights().map((insight, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${insight.trend === 'up' ? 'bg-red-400' : 'bg-green-400'}`} />
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {insight.category}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {insight.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Current: ₱{insight.current.toLocaleString()}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Predicted: ₱{insight.predicted.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Savings & Investment Predictions */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Savings & Investment Predictions
              </h3>
              <FiTrendingUp size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Savings Projection Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getSavingsProjectionData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="var(--text-muted)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₱${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'var(--text-primary)'
                      }}
                      formatter={(value: any) => [`₱${value.toLocaleString()}`, 'Savings']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="savings" 
                      stroke="#10B981" 
                      fill="#10B981"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="investment" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Savings Insights */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTrendingUp size={20} className="text-green-400" />
                      <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Monthly Savings
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-green-400 mb-2">
                      ₱{analytics.netBalance.toLocaleString()}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Based on current trends
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTarget size={20} className="text-purple-400" />
                      <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Savings Rate
                      </h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-400 mb-2">
                      {analytics.savingsRate.toFixed(1)}%
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Of total income
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white/5">
                  <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Savings Goals Progress
                  </h4>
                  <div className="space-y-3">
                    {getSavingsGoalsProgress().map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                            {goal.name}
                          </span>
                          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {goal.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Budget Recommendations */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                AI Budget Recommendations
              </h3>
              <div className="flex items-center gap-3">
                <FiZap size={24} style={{ color: 'var(--text-muted)' }} />
                <button
                  onClick={() => setShowBudgetSettings(true)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  title="Configure Budget Settings"
                >
                  <FiSettings size={20} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>
            
            {budgetForecast && budgetForecast.recommendedBudget ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Forecast */}
                <div className="space-y-6">
                  <div className="p-6 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <FiTarget size={20} className="text-blue-400" />
                      <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        AI Recommended Budget
                      </h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-400 mb-2">
                      ₱{budgetForecast.recommendedBudget.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {budgetForecast.confidence || 0}% confidence
                      </p>
                    </div>
                  </div>
                  
                  {budgetForecast?.reasoning && (
                    <div className="p-6 rounded-xl bg-white/5">
                      <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                        AI Reasoning
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {budgetForecast.reasoning}
                      </p>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Smart Recommendations
                  </h4>
                  
                  {budgetForecast?.opportunities && budgetForecast.opportunities.length > 0 && (
                    <div className="p-4 rounded-xl bg-green-500/10">
                      <h5 className="font-semibold mb-3 text-green-400">Opportunities</h5>
                      <ul className="space-y-2">
                        {budgetForecast.opportunities.map((opportunity: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                            <FiCheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {budgetForecast?.optimizationSuggestions && budgetForecast.optimizationSuggestions.length > 0 && (
                    <div className="p-4 rounded-xl bg-blue-500/10">
                      <h5 className="font-semibold mb-3 text-blue-400">Optimization Tips</h5>
                      <ul className="space-y-2">
                        {budgetForecast.optimizationSuggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                            <FiInfo size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FiZap size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Enable AI Budget Forecasting
                </p>
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                  Configure your budget settings to get personalized AI recommendations
                </p>
                <button
                  onClick={() => setShowBudgetSettings(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                >
                  Configure Settings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Data Tab */}
      {activeTab === 'historical' && (
        <div className="space-y-8">
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Historical Data Analysis
              </h3>
              <FiCalendar size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="text-center py-12">
              <FiCalendar size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Historical Data Features
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                This system automatically archives your monthly financial data for long-term analysis.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5">
                  <FiTrendingUp size={24} className="mx-auto mb-2 text-green-400" />
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Budget Performance</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Track monthly budget adherence over time</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <FiBarChart size={24} className="mx-auto mb-2 text-blue-400" />
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Year-over-Year</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Compare performance across years</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5">
                  <FiTarget size={24} className="mx-auto mb-2 text-purple-400" />
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Trend Analysis</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Identify long-term spending patterns</p>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-green-500/10">
                <p className="text-sm text-green-400">
                  <strong>Auto-archiving enabled:</strong> Your data is automatically saved monthly for comprehensive analysis.
                  Historical data is retained for 3 years to provide insights into your financial journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsiveness Test */}
      {showMobileTest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MobileResponsivenessTest />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowMobileTest(false)}
                className="liquid-button px-6 py-3 rounded-xl"
              >
                Close Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Settings Modal */}
      <BudgetSettings
        isOpen={showBudgetSettings}
        onClose={() => setShowBudgetSettings(false)}
        incomeTransactions={incomeTransactions}
        expenseTransactions={expenseTransactions}
      />
    </div>
  );
};

export default EnhancedDashboard;

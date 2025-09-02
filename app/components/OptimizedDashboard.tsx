'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { OptimizedApiClient } from '@/app/lib/optimizedApi';
import { toast } from 'react-hot-toast';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiTarget, 
  FiRefreshCw,
  FiSettings,
  FiBell,
  FiDownload,
  FiUpload,
  FiFilter,
  FiSearch,
  FiX
} from 'react-icons/fi';

// Lazy load heavy components
const SmartNotifications = lazy(() => import('./SmartNotifications'));
const BudgetSettings = lazy(() => import('./BudgetSettings'));
const EnhancedDashboard = lazy(() => import('./EnhancedDashboard'));

// Loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className="space-y-6">
    <div className="skeleton h-8 w-48 rounded-lg"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton h-32 rounded-xl"></div>
      ))}
    </div>
    <div className="skeleton h-96 rounded-xl"></div>
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Optimized stats card component
const StatsCard = React.memo(({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue' 
}: {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<any>;
  color?: string;
}) => (
  <div className="liquid-card p-6 content-visibility-auto">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
));

StatsCard.displayName = 'StatsCard';

// Optimized filter component
const FilterBar = React.memo(({ 
  selectedPeriod, 
  onPeriodChange, 
  showFilters, 
  onToggleFilters 
}: {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center space-x-4">
      <button
        onClick={onToggleFilters}
        className="liquid-button flex items-center space-x-2 px-4 py-2"
      >
        <FiFilter className="w-4 h-4" />
        <span>Filters</span>
      </button>
      
      {showFilters && (
        <div className="flex items-center space-x-2">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary text-white'
                  : 'bg-card text-muted-foreground hover:bg-accent'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
));

FilterBar.displayName = 'FilterBar';

// Main optimized dashboard component
const OptimizedDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<{
    income: any[];
    expenses: any[];
    accounts: any[];
    savings: any[];
    shared: any[];
  }>({
    income: [],
    expenses: [],
    accounts: [],
    savings: [],
    shared: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized data loading function
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      // Use batch operation for better performance
      const batchData = await OptimizedApiClient.batchGetAllData();
      setData(batchData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized refresh function
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(false);
    setRefreshing(false);
    toast.success('Data refreshed successfully');
  }, [loadData]);

  // Memoized period change handler
  const handlePeriodChange = useCallback((period: string) => {
    setSelectedPeriod(period);
  }, []);

  // Memoized filter toggle
  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  // Memoized budget settings toggle
  const handleToggleBudgetSettings = useCallback(() => {
    setShowBudgetSettings(prev => !prev);
  }, []);

  // Memoized analytics calculations
  const analytics = useMemo(() => {
    if (loading || (data.income.length === 0 && data.expenses.length === 0)) {
      return null;
    }

    try {
      const allTransactions = [
        ...data.income.map(t => ({ ...t, type: 'income' as const })),
        ...data.expenses.map(t => ({ ...t, type: 'expense' as const }))
      ];

      const filteredTransactions = allTransactions.filter(t => {
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
          default:
            startDate.setMonth(now.getMonth() - 1);
        }
        
        return transactionDate >= startDate;
      });

      const income = filteredTransactions.filter(t => t.type === 'income');
      const expenses = filteredTransactions.filter(t => t.type === 'expense');

      const totalIncome = income.reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalExpenses = expenses.reduce((sum, t) => sum + (t.amount || 0), 0);
      const netIncome = totalIncome - totalExpenses;

      // Calculate percentage changes
      const previousPeriodStart = new Date();
      switch (selectedPeriod) {
        case 'week':
          previousPeriodStart.setDate(previousPeriodStart.getDate() - 14);
          break;
        case 'month':
          previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 2);
          break;
        case 'quarter':
          previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 6);
          break;
        case 'year':
          previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 2);
          break;
      }

      const previousPeriodTransactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        const periodStart = new Date();
        switch (selectedPeriod) {
          case 'week':
            periodStart.setDate(periodStart.getDate() - 7);
            break;
          case 'month':
            periodStart.setMonth(periodStart.getMonth() - 1);
            break;
          case 'quarter':
            periodStart.setMonth(periodStart.getMonth() - 3);
            break;
          case 'year':
            periodStart.setFullYear(periodStart.getFullYear() - 1);
            break;
        }
        return transactionDate >= previousPeriodStart && transactionDate < periodStart;
      });

      const previousIncome = previousPeriodTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
      const previousExpenses = previousPeriodTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      const incomeChangeValue = previousIncome > 0 
        ? ((totalIncome - previousIncome) / previousIncome * 100)
        : 0;
      const expenseChangeValue = previousExpenses > 0
        ? ((totalExpenses - previousExpenses) / previousExpenses * 100)
        : 0;

      return {
        totalIncome,
        totalExpenses,
        netIncome,
        incomeChange: incomeChangeValue > 0 ? `+${incomeChangeValue.toFixed(1)}%` : `${incomeChangeValue.toFixed(1)}%`,
        expenseChange: expenseChangeValue > 0 ? `+${expenseChangeValue.toFixed(1)}%` : `${expenseChangeValue.toFixed(1)}%`,
        transactionCount: filteredTransactions.length,
        incomeCount: income.length,
        expenseCount: expenses.length,
      };
    } catch (error) {
      console.error('Error calculating analytics:', error);
      return null;
    }
  }, [data.income, data.expenses, selectedPeriod, loading]);

  // Load user data on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => loadData()}
            className="liquid-button px-6 py-2"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="liquid-button flex items-center space-x-2 px-4 py-2"
          >
            <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={handleToggleBudgetSettings}
            className="liquid-button flex items-center space-x-2 px-4 py-2"
          >
            <FiSettings className="w-4 h-4" />
            <span>Budget</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        showFilters={showFilters}
        onToggleFilters={handleToggleFilters}
      />

      {/* Stats Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Income"
            value={`$${analytics.totalIncome.toLocaleString()}`}
            change={analytics.incomeChange}
            icon={FiTrendingUp}
            color="green"
          />
          <StatsCard
            title="Total Expenses"
            value={`$${analytics.totalExpenses.toLocaleString()}`}
            change={analytics.expenseChange}
            icon={FiTrendingDown}
            color="red"
          />
          <StatsCard
            title="Net Income"
            value={`$${analytics.netIncome.toLocaleString()}`}
            icon={FiDollarSign}
            color="blue"
          />
          <StatsCard
            title="Transactions"
            value={analytics.transactionCount.toString()}
            icon={FiTarget}
            color="purple"
          />
        </div>
      )}

      {/* Main Dashboard Content */}
      <Suspense fallback={<LoadingSkeleton />}>
        <EnhancedDashboard
          incomeTransactions={data.income}
          expenseTransactions={data.expenses}
          selectedPeriod={selectedPeriod}
          loading={loading}
        />
      </Suspense>

      {/* Budget Settings Modal */}
      {showBudgetSettings && (
        <Suspense fallback={<div>Loading...</div>}>
          <BudgetSettings
            isOpen={showBudgetSettings}
            onClose={handleToggleBudgetSettings}
            incomeTransactions={data.income}
            expenseTransactions={data.expenses}
          />
        </Suspense>
      )}

      {/* Smart Notifications */}
      <Suspense fallback={<div>Loading notifications...</div>}>
        <SmartNotifications
          incomeTransactions={data.income}
          expenseTransactions={data.expenses}
          savingsGoals={data.savings}
          selectedPeriod={selectedPeriod}
        />
      </Suspense>
    </div>
  );
};

export default React.memo(OptimizedDashboard);

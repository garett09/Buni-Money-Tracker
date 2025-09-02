'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { OptimizedApiClient } from '@/app/lib/optimizedApi';
import { toast } from 'react-hot-toast';
import { formatPeso, getUserMonthlyBudget, setUserMonthlyBudget } from '@/app/lib/currency';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiTarget, 
  FiRefreshCw,
  FiSettings,
  FiDownload,
  FiUpload,
  FiFilter,
  FiSearch,
  FiX
} from 'react-icons/fi';

// Lazy load heavy components

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
          <p 
            className="text-sm mt-1" 
            style={{ 
              color: change.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-red)' 
            }}
          >
            {change}
          </p>
        )}
      </div>
      <div 
        className="p-3 rounded-full" 
        style={{
          background: `var(--accent-${color === 'green' ? 'green' : color === 'red' ? 'red' : color === 'blue' ? 'blue' : 'purple'})`,
          color: 'white'
        }}
      >
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
    income: { transactions: any[] };
    expenses: { transactions: any[] };
    accounts: { accounts: any[] };
    savings: { goals: any[] };
    shared: { expenses: any[] };
  }>({
    income: { transactions: [] },
    expenses: { transactions: [] },
    accounts: { accounts: [] },
    savings: { goals: [] },
    shared: { expenses: [] },
  });
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBudgetSettings, setShowBudgetSettings] = useState(false);
  const [showQuickBudgetAdjust, setShowQuickBudgetAdjust] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized data loading function
  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);

    try {
      // Use batch operation for better performance
      const batchData = await OptimizedApiClient.batchGetAllData();
      
      // Ensure we have the expected data structure
      const safeData = {
        income: { transactions: batchData.income?.transactions || [] },
        expenses: { transactions: batchData.expenses?.transactions || [] },
        accounts: { accounts: batchData.accounts?.accounts || [] },
        savings: { goals: batchData.savings?.goals || [] },
        shared: { expenses: batchData.shared?.expenses || [] },
      };
      

      
      setData(safeData);
    } catch (err) {
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

  // Quick budget adjustment
  const handleQuickBudgetAdjust = useCallback((newBudget: number) => {
    setUserMonthlyBudget(newBudget);
    toast.success(`Monthly budget updated to ${formatPeso(newBudget)}`);
    setShowQuickBudgetAdjust(false);
  }, []);

  // Memoized analytics calculations
  const analytics = useMemo(() => {
    // Ensure we have valid data structures
    const incomeTransactions = data.income?.transactions || [];
    const expenseTransactions = data.expenses?.transactions || [];
    
    if (loading || (incomeTransactions.length === 0 && expenseTransactions.length === 0)) {
      return null;
    }

    try {
      const allTransactions = [
        ...incomeTransactions.map(t => ({ ...t, type: 'income' as const })),
        ...expenseTransactions.map(t => ({ ...t, type: 'expense' as const }))
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
          <p className="mb-4" style={{ color: 'var(--accent-red)' }}>{error}</p>
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
          {/* Current Budget Display */}
          <button
            onClick={() => setShowQuickBudgetAdjust(true)}
            className="flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-105"
            style={{
              background: 'var(--card-bg)',
              borderColor: 'var(--card-border)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--overlay-light)';
              e.currentTarget.style.borderColor = 'var(--accent-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card-bg)';
              e.currentTarget.style.borderColor = 'var(--card-border)';
            }}
            title="Click to adjust budget"
          >
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monthly Budget:</span>
            <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>{formatPeso(getUserMonthlyBudget())}</span>
          </button>
          
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
            value={formatPeso(analytics.totalIncome)}
            change={analytics.incomeChange}
            icon={FiTrendingUp}
            color="green"
          />
          <StatsCard
            title="Total Expenses"
            value={formatPeso(analytics.totalExpenses)}
            change={analytics.expenseChange}
            icon={FiTrendingDown}
            color="red"
          />
          <StatsCard
            title="Net Income"
            value={formatPeso(analytics.netIncome)}
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
          incomeTransactions={data.income.transactions || []}
          expenseTransactions={data.expenses.transactions || []}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          loading={loading}
        />
      </Suspense>

      {/* Budget Settings Modal */}
      {showBudgetSettings && (
        <Suspense fallback={<div>Loading...</div>}>
                  <BudgetSettings
          isOpen={showBudgetSettings}
          onClose={handleToggleBudgetSettings}
          incomeTransactions={data.income.transactions || []}
          expenseTransactions={data.expenses.transactions || []}
        />
        </Suspense>
      )}



      {/* Quick Budget Adjustment Modal */}
      {showQuickBudgetAdjust && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="quick-budget-modal backdrop-blur-lg rounded-2xl border p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold quick-budget-title">
                Quick Budget Adjustment
              </h3>
              <button
                onClick={() => setShowQuickBudgetAdjust(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--overlay-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <FiX size={20} className="quick-budget-close-icon" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm quick-budget-description">
                Choose a preset budget or enter your own amount:
              </p>
              
              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-2">
                {[20000, 30000, 40000, 50000, 60000, 80000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleQuickBudgetAdjust(preset)}
                    className="quick-budget-preset-btn"
                  >
                    <div className="font-semibold quick-budget-amount">
                      ₱{preset.toLocaleString()}
                    </div>
                    <div className="text-xs quick-budget-label">
                      {preset === 20000 ? 'Starter' : 
                       preset === 30000 ? 'Basic' : 
                       preset === 40000 ? 'Standard' : 
                       preset === 50000 ? 'Comfortable' : 
                       preset === 60000 ? 'Premium' : 'Luxury'}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Custom Amount */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1000"
                  max="1000000"
                  step="1000"
                  placeholder="Custom amount"
                  className="flex-1 p-2 quick-budget-input rounded-lg border focus:outline-none transition-all duration-300"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = parseInt(e.currentTarget.value);
                      if (value >= 1000) {
                        handleQuickBudgetAdjust(value);
                      }
                    }
                  }}
                />
                <span className="text-sm quick-budget-currency">₱</span>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowQuickBudgetAdjust(false)}
                  className="flex-1 p-2 rounded-lg quick-budget-cancel-btn transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowQuickBudgetAdjust(false)}
                  className="flex-1 p-2 rounded-lg quick-budget-close-btn transition-all duration-300 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedDashboard);

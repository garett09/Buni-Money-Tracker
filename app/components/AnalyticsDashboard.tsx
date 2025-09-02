'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  FiTrendingUp as FiTrendingUpIcon,
  FiClock,
  FiDollarSign as FiDollarIcon,
  FiCreditCard,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { AnalyticsEngine, Transaction } from '@/app/lib/analytics';

interface AnalyticsDashboardProps {
  incomeTransactions: any[];
  expenseTransactions: any[];
  selectedPeriod: string;
  loading?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  incomeTransactions,
  expenseTransactions,
  selectedPeriod,
  loading = false
}) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  // Memoized analytics calculation for better performance
  const calculatedAnalytics = useMemo(() => {
    if (incomeTransactions.length === 0 && expenseTransactions.length === 0) {
      return null;
    }

    try {
      const allTransactions: Transaction[] = [
        ...incomeTransactions.map(t => ({
          id: t.id || Math.random(),
          amount: Math.abs(t.amount),
          description: t.description || 'No description',
          category: t.category || 'Other',
          date: t.date,
          type: 'income' as const,
          account: t.account,
          tags: t.tags || [],
          recurring: t.recurring || false,
          merchant: t.merchant || 'Unknown'
        })),
        ...expenseTransactions.map(t => ({
          id: t.id || Math.random(),
          amount: Math.abs(t.amount),
          description: t.description || 'No description',
          category: t.category || 'Other',
          date: t.date,
          type: 'expense' as const,
          account: t.account,
          tags: t.tags || [],
          recurring: t.recurring || false,
          merchant: t.merchant || 'Unknown'
        }))
      ];

      const analyticsEngine = new AnalyticsEngine(allTransactions);
      
      return {
        financialHealth: analyticsEngine.getFinancialHealth(selectedPeriod),
        incomeExpenseAnalysis: analyticsEngine.getIncomeExpenseAnalysis(selectedPeriod),
        spendingVelocity: analyticsEngine.getSpendingVelocity(selectedPeriod),
        categoryAnalysis: analyticsEngine.getCategoryAnalysis(selectedPeriod),
        spendingInsights: analyticsEngine.getSpendingInsights(selectedPeriod),
        predictiveAnalytics: analyticsEngine.getPredictiveAnalytics(selectedPeriod),
        budgetPerformance: analyticsEngine.getBudgetPerformance(selectedPeriod),
        recurringTransactions: analyticsEngine.getRecurringTransactions(),
        merchantAnalysis: analyticsEngine.getMerchantAnalysis(selectedPeriod)
      };
    } catch (err) {
      setError('Failed to calculate analytics. Please try again.');
      return null;
    }
  }, [incomeTransactions, expenseTransactions, selectedPeriod]);

  useEffect(() => {
    setAnalytics(calculatedAnalytics);
    setError(null);
  }, [calculatedAnalytics]);

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

  if (error) {
    return (
      <div className="liquid-card p-8 rounded-3xl text-center">
        <FiAlertCircle size={48} className="mx-auto mb-4 text-red-400" />
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-white rounded-xl font-medium transition-all duration-300"
        >
          Retry
        </button>
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

  return (
    <div className="space-y-8">
      {/* Enhanced Analytics Tabs */}
      <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview', icon: FiEye },
          { id: 'trends', label: 'Trends', icon: FiTrendingUp },
          { id: 'insights', label: 'Insights', icon: FiZap },
          { id: 'predictions', label: 'Predictions', icon: FiTarget },
          { id: 'budget', label: 'Budget', icon: FiShield }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

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
                <span className={`text-sm font-medium ${getHealthColor(analytics.financialHealth.overallScore)}`}>
                  {getHealthStatus(analytics.financialHealth.overallScore)}
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
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={analytics.financialHealth.overallScore >= 80 ? '#10b981' : 
                             analytics.financialHealth.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                      strokeWidth="8"
                      strokeDasharray={((analytics.financialHealth.overallScore / 100) * 339.292) + ' 339.292'}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getHealthColor(analytics.financialHealth.overallScore)}`}>
                        {analytics.financialHealth.overallScore}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        /100
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {getHealthStatus(analytics.financialHealth.overallScore)}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Risk Level: {analytics.financialHealth.riskLevel}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <FiTrendingUp size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Savings Rate</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.financialHealth.savingsRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <FiShield size={16} className="text-blue-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Budget Adherence</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.financialHealth.budgetAdherence.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <FiActivity size={16} className="text-purple-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Income Stability</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.financialHealth.incomeStability.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle size={16} className="text-yellow-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Emergency Fund</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.financialHealth.emergencyFundRatio.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <FiCreditCard size={16} className="text-red-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Debt Ratio</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {analytics.financialHealth.debtRatio.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2">
                    <FiDollarIcon size={16} className="text-green-400" />
                    <span style={{ color: 'var(--text-muted)' }}>Cash Flow</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.financialHealth.cashFlow.toLocaleString()}
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
                    ₱{analytics.incomeExpenseAnalysis.totalIncome.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10">
                  <div className="flex items-center gap-3">
                    <FiTrendingDown size={20} className="text-red-400" />
                    <span style={{ color: 'var(--text-primary)' }}>Total Expenses</span>
                  </div>
                  <span className="font-bold text-red-400">
                    ₱{analytics.incomeExpenseAnalysis.totalExpenses.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10">
                  <div className="flex items-center gap-3">
                    <FiDollarSign size={20} className="text-blue-400" />
                    <span style={{ color: 'var(--text-primary)' }}>Net Balance</span>
                  </div>
                  <span className={`font-bold ${analytics.incomeExpenseAnalysis.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {analytics.incomeExpenseAnalysis.netBalance >= 0 ? '+' : ''}₱{analytics.incomeExpenseAnalysis.netBalance.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10">
                  <div className="flex items-center gap-3">
                    <FiTarget size={20} className="text-purple-400" />
                    <span style={{ color: 'var(--text-primary)' }}>Savings Rate</span>
                  </div>
                  <span className="font-bold text-purple-400">
                    {analytics.incomeExpenseAnalysis.savingsRate.toFixed(1)}%
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
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <span style={{ color: 'var(--text-muted)' }}>Daily Average</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.spendingVelocity.dailyAverage.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <span style={{ color: 'var(--text-muted)' }}>Weekly Average</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.spendingVelocity.weeklyAverage.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <span style={{ color: 'var(--text-muted)' }}>Monthly Projection</span>
                  <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    ₱{analytics.spendingVelocity.monthlyProjection.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                  <span style={{ color: 'var(--text-muted)' }}>Trend</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                      {analytics.spendingVelocity.trend}
                    </span>
                    {analytics.spendingVelocity.trend === 'increasing' && (
                      <FiTrendingUpIcon size={16} className="text-red-400" />
                    )}
                    {analytics.spendingVelocity.trend === 'decreasing' && (
                      <FiTrendingDown size={16} className="text-green-400" />
                    )}
                    {analytics.spendingVelocity.trend === 'stable' && (
                      <FiActivity size={16} className="text-blue-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-8">
          {/* Budget Performance Overview */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Budget Performance
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                analytics.budgetPerformance.status === 'under-budget' ? 'bg-green-500/20 text-green-400' :
                analytics.budgetPerformance.status === 'on-track' ? 'bg-yellow-500/20 text-yellow-400' :
                analytics.budgetPerformance.status === 'over-budget' ? 'bg-red-500/20 text-red-400' :
                'bg-gray-500/20 text-gray-400'
              }`}>
                {analytics.budgetPerformance.status.replace('-', ' ').toUpperCase()}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-green-400 mb-2">
                  ₱{analytics.budgetPerformance.totalBudget.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Budget</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-red-400 mb-2">
                  ₱{analytics.budgetPerformance.spent.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Spent</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/5">
                <div className={`text-2xl font-bold mb-2 ${
                  analytics.budgetPerformance.remaining >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  ₱{analytics.budgetPerformance.remaining.toLocaleString()}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Remaining</div>
              </div>
            </div>
            
            {/* Budget Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-muted)' }}>Budget Usage</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {((analytics.budgetPerformance.spent / analytics.budgetPerformance.totalBudget) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    analytics.budgetPerformance.status === 'under-budget' ? 'bg-green-500' :
                    analytics.budgetPerformance.status === 'on-track' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min((analytics.budgetPerformance.spent / analytics.budgetPerformance.totalBudget) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Budget Recommendations */}
          {analytics.budgetPerformance.recommendations.length > 0 && (
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Budget Recommendations
                </h3>
                <FiInfo size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                {analytics.budgetPerformance.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiInfo size={16} className="text-blue-400" />
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-8">
          {/* Enhanced Key Insights */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Key Insights
              </h3>
              <FiZap size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FiBarChart size={20} className="text-blue-400" />
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Top Spending Category
                  </h4>
                </div>
                <p className="text-2xl font-bold text-blue-400 mb-2">
                  {analytics.spendingInsights.topSpendingCategory}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  This category accounts for the largest portion of your expenses
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FiDollarSign size={20} className="text-green-400" />
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Largest Transaction
                  </h4>
                </div>
                <p className="text-2xl font-bold text-green-400 mb-2">
                  ₱{analytics.spendingInsights.largestTransaction.amount?.toLocaleString() || '0'}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {analytics.spendingInsights.largestTransaction.description || 'No data'}
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FiActivity size={20} className="text-purple-400" />
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Daily Spending Velocity
                  </h4>
                </div>
                <p className="text-2xl font-bold text-purple-400 mb-2">
                  ₱{analytics.spendingInsights.spendingVelocity.toLocaleString()}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Average daily spending amount
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FiAlertTriangle size={20} className="text-red-400" />
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Budget Variance
                  </h4>
                </div>
                <p className={`text-2xl font-bold mb-2 ${analytics.spendingInsights.budgetVariance > 0 ? 'text-red-400' : 'text-green-400'}`}>
                  {analytics.spendingInsights.budgetVariance > 0 ? '+' : ''}{analytics.spendingInsights.budgetVariance.toFixed(1)}%
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {analytics.spendingInsights.budgetVariance > 0 ? 'Over budget' : 'Under budget'}
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Financial Health Recommendations */}
          {analytics.financialHealth.recommendations.length > 0 && (
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Recommendations
                </h3>
                <FiCheckCircle size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                {analytics.financialHealth.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiCheckCircle size={16} className="text-green-400" />
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div className="space-y-8">
          {/* Enhanced Predictive Analytics */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Next Month Forecast
              </h3>
              <FiTarget size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingDown size={20} className="text-red-400" />
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Projected Spending
                  </h4>
                </div>
                <p className="text-2xl font-bold text-red-400 mb-2">
                  ₱{analytics.predictiveAnalytics.nextMonthSpending.toLocaleString()}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Based on current trends
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FiTarget size={20} className="text-blue-400" />
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Budget Forecast
                  </h4>
                </div>
                <p className={`text-2xl font-bold mb-2 ${analytics.predictiveAnalytics.budgetForecast >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₱{analytics.predictiveAnalytics.budgetForecast.toLocaleString()}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Remaining budget
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <FiTrendingUp size={20} className="text-green-400" />
                  <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Savings Projection
                  </h4>
                </div>
                <p className={`text-2xl font-bold mb-2 ${analytics.predictiveAnalytics.savingsProjection >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₱{analytics.predictiveAnalytics.savingsProjection.toLocaleString()}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Potential monthly savings
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Opportunities */}
          {analytics.predictiveAnalytics.opportunities.length > 0 && (
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Opportunities
                </h3>
                <FiStar size={24} style={{ color: 'var(--text-muted)' }} />
              </div>
              
              <div className="space-y-4">
                {analytics.predictiveAnalytics.opportunities.map((opportunity: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-green-500/10">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <FiStar size={16} className="text-green-400" />
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {opportunity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

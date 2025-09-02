'use client';

import React, { useState, useEffect } from 'react';
import { HistoricalDataManager } from '@/app/lib/historicalData';
import { EnhancedBudgetTracker } from '@/app/lib/enhancedBudgetTracker';

interface HistoricalAnalyticsProps {
  userId: string;
  incomeTransactions: any[];
  expenseTransactions: any[];
  monthlyBudget: number;
  categoryBudgets: { [key: string]: number };
}

const HistoricalAnalytics: React.FC<HistoricalAnalyticsProps> = ({
  userId,
  incomeTransactions,
  expenseTransactions,
  monthlyBudget,
  categoryBudgets
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState('12');
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [budgetTracker, setBudgetTracker] = useState<EnhancedBudgetTracker | null>(null);

  // Initialize budget tracker
  useEffect(() => {
    if (userId && monthlyBudget) {
      const tracker = new EnhancedBudgetTracker(userId, monthlyBudget, categoryBudgets);
      setBudgetTracker(tracker);
    }
  }, [userId, monthlyBudget, categoryBudgets]);

  // Load historical data
  useEffect(() => {
    if (budgetTracker) {
      loadHistoricalData();
    }
  }, [budgetTracker, selectedYear, selectedPeriod]);

  const loadHistoricalData = async () => {
    if (!budgetTracker) return;
    
    setLoading(true);
    try {
      // Store current month's data
      await budgetTracker.storeMonthlyData(expenseTransactions, incomeTransactions);
      
      // Get comprehensive insights
      const insights = await budgetTracker.getComprehensiveInsights(expenseTransactions, incomeTransactions);
      
      // Get historical data for the selected period
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - parseInt(selectedPeriod));
      
      const startMonth = startDate.toISOString().slice(0, 7);
      const endMonth = endDate.toISOString().slice(0, 7);
      
      const budgetPerformance = await HistoricalDataManager.getHistoricalBudgetPerformance(userId, parseInt(selectedPeriod));
      const spendingTrends = await HistoricalDataManager.getHistoricalSpendingTrends(userId, parseInt(selectedPeriod));
      const financialHealth = await HistoricalDataManager.getHistoricalFinancialHealth(userId, parseInt(selectedPeriod));
      
      // Get year-over-year comparison
      const yearOverYear = await HistoricalDataManager.generateYearOverYearComparison(userId, selectedYear);
      
      // Get long-term trends instead of budget insights
      const longTermTrends = await HistoricalDataManager.generateLongTermTrends(userId, parseInt(selectedPeriod));
      
      setHistoricalData({
        insights,
        budgetPerformance,
        spendingTrends,
        financialHealth,
        yearOverYear,
        longTermTrends
      });
    } catch (error) {
      console.error('Failed to load historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="liquid-card p-8 rounded-3xl">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!historicalData) {
    return (
      <div className="liquid-card p-8 rounded-3xl text-center">
        <p style={{ color: 'var(--text-muted)' }}>No historical data available</p>
        <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
          Start tracking your finances to see historical trends and insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Historical Analytics
        </h2>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg liquid-button text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            <option value="6">Last 6 months</option>
            <option value="12">Last 12 months</option>
            <option value="24">Last 2 years</option>
            <option value="36">Last 3 years</option>
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg liquid-button text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="flex items-center gap-2 liquid-card rounded-xl p-1">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'trends', label: 'Trends' },
          { id: 'performance', label: 'Performance' },
          { id: 'comparison', label: 'Year-over-Year' },
          { id: 'insights', label: 'Insights' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'liquid-button text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="liquid-card p-6 rounded-3xl text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {historicalData.budgetInsights?.averageBudgetUsage || 0}%
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Avg Budget Usage
              </div>
            </div>
            
            <div className="liquid-card p-6 rounded-3xl text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {historicalData.budgetInsights?.monthsOverBudget || 0}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Months Over Budget
              </div>
            </div>
            
            <div className="liquid-card p-6 rounded-3xl text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">
                {historicalData.budgetInsights?.improvementTrend ? 'Yes' : 'No'}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Improving Trend
              </div>
            </div>
            
            <div className="liquid-card p-6 rounded-3xl text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                ₱{historicalData.yearOverYear?.netSavings?.toLocaleString() || '0'}
              </div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Net Savings ({selectedYear})
              </div>
            </div>
          </div>

          {/* Budget Performance Overview */}
          <div className="liquid-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Budget Performance Overview
            </h3>
            
            <div className="space-y-4">
              {historicalData.budgetPerformance?.map((perf: any, index: number) => (
                <div key={index} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {perf.month}
                    </h4>
                    <span className={`text-sm font-medium ${
                      perf.status === 'under-budget' ? 'text-green-400' :
                      perf.status === 'on-track' ? 'text-yellow-400' :
                      perf.status === 'over-budget' ? 'text-orange-400' :
                      'text-red-400'
                    }`}>
                      {perf.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        ₱{perf.budget.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Spent:</span>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        ₱{perf.spent.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Usage:</span>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {perf.usagePercentage.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Health Score:</span>
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {perf.healthScore}/100
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          perf.usagePercentage > 100 ? 'bg-red-500' :
                          perf.usagePercentage > 90 ? 'bg-orange-500' :
                          perf.usagePercentage > 80 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(perf.usagePercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-8">
          {/* Budget Insights */}
          <div className="liquid-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Budget Performance Insights
            </h3>
            
            <div className="space-y-6">
              {historicalData.budgetInsights?.recommendations?.map((recommendation: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-white/5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Comparison */}
          <div className="liquid-card p-8 rounded-3xl">
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Historical Comparison
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* vs Last Month */}
              <div className="p-6 rounded-xl bg-white/5">
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  vs Last Month
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Spending:</span>
                    <span className={`font-semibold ${
                      historicalData.insights?.historicalComparison?.vsLastMonth?.spending > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {historicalData.insights?.historicalComparison?.vsLastMonth?.spending > 0 ? '+' : ''}
                      ₱{historicalData.insights?.historicalComparison?.vsLastMonth?.spending?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                    <span className={`font-semibold ${
                      historicalData.insights?.historicalComparison?.vsLastMonth?.budget > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {historicalData.insights?.historicalComparison?.vsLastMonth?.budget > 0 ? '+' : ''}
                      ₱{historicalData.insights?.historicalComparison?.vsLastMonth?.budget?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Health Score:</span>
                    <span className={`font-semibold ${
                      historicalData.insights?.historicalComparison?.vsLastMonth?.health > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {historicalData.insights?.historicalComparison?.vsLastMonth?.health > 0 ? '+' : ''}
                      {historicalData.insights?.historicalComparison?.vsLastMonth?.health || '0'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* vs Last Year */}
              <div className="p-6 rounded-xl bg-white/5">
                <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                  vs Last Year
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Spending:</span>
                    <span className={`font-semibold ${
                      historicalData.insights?.historicalComparison?.vsLastYear?.spending > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {historicalData.insights?.historicalComparison?.vsLastYear?.spending > 0 ? '+' : ''}
                      ₱{historicalData.insights?.historicalComparison?.vsLastYear?.spending?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                    <span className={`font-semibold ${
                      historicalData.insights?.historicalComparison?.vsLastYear?.budget > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {historicalData.insights?.historicalComparison?.vsLastYear?.budget > 0 ? '+' : ''}
                      ₱{historicalData.insights?.historicalComparison?.vsLastYear?.budget?.toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Health Score:</span>
                    <span className={`font-semibold ${
                      historicalData.insights?.historicalComparison?.vsLastYear?.health > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {historicalData.insights?.historicalComparison?.vsLastYear?.health > 0 ? '+' : ''}
                      {historicalData.insights?.historicalComparison?.vsLastYear?.health || '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalAnalytics;

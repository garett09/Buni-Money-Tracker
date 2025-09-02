'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiBarChart,
  FiPieChart,
  FiActivity,
  FiTarget,
  FiShield,
  FiDollarSign,
  FiInfo,
  FiRefreshCw,
  FiDownload,
  FiFilter
} from 'react-icons/fi';
import { HistoricalDataManager, HistoricalBudgetPerformance, YearOverYearComparison } from '@/app/lib/historicalData';

interface HistoricalDataViewProps {
  userId: string;
  currentData: any;
}

const HistoricalDataView: React.FC<HistoricalDataViewProps> = ({
  userId,
  currentData
}) => {
  const [activeTab, setActiveTab] = useState('budget-performance');
  const [timeRange, setTimeRange] = useState(12);
  const [loading, setLoading] = useState(false);
  const [historicalData, setHistoricalData] = useState<{
    budgetPerformance: HistoricalBudgetPerformance[];
    yearOverYear: YearOverYearComparison | null;
    longTermTrends: any;
  }>({
    budgetPerformance: [],
    yearOverYear: null,
    longTermTrends: null
  });

  // Load historical data
  useEffect(() => {
    loadHistoricalData();
  }, [userId, timeRange]);

  const loadHistoricalData = async () => {
    setLoading(true);
    try {
      const [budgetPerformance, yearOverYear, longTermTrends] = await Promise.all([
        HistoricalDataManager.getHistoricalBudgetPerformance(userId, timeRange),
        HistoricalDataManager.generateYearOverYearComparison(userId, new Date().getFullYear()),
        HistoricalDataManager.generateLongTermTrends(userId, timeRange)
      ]);

      setHistoricalData({
        budgetPerformance,
        yearOverYear,
        longTermTrends
      });
    } catch (error) {
      console.error('Failed to load historical data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Archive current month's data
  const archiveCurrentData = async () => {
    try {
      await HistoricalDataManager.archiveMonthlyData(userId, currentData);
      await loadHistoricalData(); // Reload data
    } catch (error) {
      console.error('Failed to archive current data:', error);
    }
  };

  // Chart data helpers
  const getBudgetPerformanceChartData = () => {
    return historicalData.budgetPerformance.map(item => ({
      month: item.month,
      budget: item.monthlyBudget,
      spent: item.totalExpenses,
      remaining: item.monthlyBudget - item.totalExpenses,
      usagePercent: item.budgetUsagePercent,
      healthScore: item.financialHealthScore
    }));
  };

  const getSpendingTrendsChartData = () => {
    return historicalData.budgetPerformance.map(item => ({
      month: item.month,
      expenses: item.totalExpenses,
      income: item.totalIncome,
      netBalance: item.netBalance,
      savingsRate: item.savingsRate
    }));
  };

  const getHealthScoreChartData = () => {
    return historicalData.budgetPerformance.map(item => ({
      month: item.month,
      overallScore: item.financialHealthScore,
      budgetScore: 100 - item.budgetUsagePercent,
      savingsScore: item.savingsRate
    }));
  };

  const getCategoryBreakdownData = () => {
    if (historicalData.budgetPerformance.length === 0) return [];
    
    const latestData = historicalData.budgetPerformance[0];
    return Object.entries(latestData.categoryBreakdown).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / latestData.totalExpenses) * 100
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under-budget': return '#10B981';
      case 'on-track': return '#F59E0B';
      case 'over-budget': return '#EF4444';
      case 'critical': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
      case 'improving':
        return <FiTrendingUp className="text-green-400" />;
      case 'decreasing':
      case 'declining':
        return <FiTrendingDown className="text-red-400" />;
      default:
        return <FiActivity className="text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Historical Data Analysis
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={archiveCurrentData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center gap-2"
          >
            <FiCalendar size={16} />
            Archive Current Month
          </button>
          <button
            onClick={loadHistoricalData}
            className="p-2 rounded-lg liquid-button transition-all duration-300"
            title="Refresh data"
          >
            <FiRefreshCw size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="liquid-card p-4 rounded-xl">
        <div className="flex items-center gap-4">
          <span style={{ color: 'var(--text-muted)' }}>Time Range:</span>
          <div className="flex gap-2">
            {[6, 12, 24, 36].map((months) => (
              <button
                key={months}
                onClick={() => setTimeRange(months)}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                  timeRange === months
                    ? 'liquid-button text-white'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {months} months
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 liquid-card rounded-xl p-1">
        {[
          { id: 'budget-performance', label: 'Budget Performance', icon: FiShield },
          { id: 'spending-trends', label: 'Spending Trends', icon: FiTrendingDown },
          { id: 'health-scores', label: 'Health Scores', icon: FiTarget },
          { id: 'year-comparison', label: 'Year Comparison', icon: FiBarChart },
          { id: 'long-term-trends', label: 'Long-term Trends', icon: FiActivity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'liquid-button text-white'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Budget Performance Tab */}
      {activeTab === 'budget-performance' && (
        <div className="space-y-8">
          {/* Budget Performance Chart */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Budget Performance Over Time
              </h3>
              <FiShield size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getBudgetPerformanceChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" />
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
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    formatter={(value: any, name: string) => [
                      `₱${value.toLocaleString()}`,
                      name === 'budget' ? 'Budget' : 
                      name === 'spent' ? 'Spent' : 
                      name === 'remaining' ? 'Remaining' : name
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Monthly Budget"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="spent" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                    name="Total Spent"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="remaining" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Remaining Budget"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {historicalData.budgetPerformance.slice(0, 4).map((item, index) => (
              <div key={index} className="liquid-card p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {item.month}
                  </span>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(item.status) }}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ₱{item.monthlyBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Spent:</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      ₱{item.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Usage:</span>
                    <span className={`font-semibold ${
                      item.budgetUsagePercent > 100 ? 'text-red-400' :
                      item.budgetUsagePercent > 90 ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {item.budgetUsagePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Health:</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {item.financialHealthScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Trends Tab */}
      {activeTab === 'spending-trends' && (
        <div className="space-y-8">
          {/* Spending Trends Chart */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Spending Trends Analysis
              </h3>
              <FiTrendingDown size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getSpendingTrendsChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" />
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
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    formatter={(value: any, name: string) => [
                      `₱${value.toLocaleString()}`,
                      name === 'expenses' ? 'Expenses' : 
                      name === 'income' ? 'Income' : 
                      name === 'netBalance' ? 'Net Balance' : name
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#EF4444" 
                    fill="#EF4444"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Expenses"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10B981" 
                    fill="#10B981"
                    fillOpacity={0.3}
                    strokeWidth={3}
                    name="Income"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netBalance" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    name="Net Balance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Latest Category Breakdown
              </h3>
              <FiPieChart size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCategoryBreakdownData()}>
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
                    <Bar dataKey="amount" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Category Analysis
                </h4>
                {getCategoryBreakdownData().map((category, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {category.category}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-lg font-bold text-blue-400">
                      ₱{category.amount.toLocaleString()}
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Scores Tab */}
      {activeTab === 'health-scores' && (
        <div className="space-y-8">
          {/* Health Scores Chart */}
          <div className="liquid-card p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Financial Health Score Trends
              </h3>
              <FiTarget size={24} style={{ color: 'var(--text-muted)' }} />
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getHealthScoreChartData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--text-muted)" />
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
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      boxShadow: 'var(--shadow-lg)'
                    }}
                    formatter={(value: any, name: string) => [
                      value,
                      name === 'overallScore' ? 'Overall Score' : 
                      name === 'budgetScore' ? 'Budget Score' : 
                      name === 'savingsScore' ? 'Savings Score' : name
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="overallScore" 
                    stroke="#8B5CF6" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    name="Overall Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budgetScore" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    name="Budget Score"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savingsScore" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    name="Savings Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Health Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {historicalData.budgetPerformance.slice(0, 3).map((item, index) => (
              <div key={index} className="liquid-card p-6 rounded-3xl text-center">
                <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                  {item.month}
                </div>
                <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {item.financialHealthScore}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Overall Score
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {100 - item.budgetUsagePercent}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--text-muted)' }}>Savings:</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {item.savingsRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Year Comparison Tab */}
      {activeTab === 'year-comparison' && (
        <div className="space-y-8">
          {historicalData.yearOverYear ? (
            <>
              {/* Year-over-Year Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="liquid-card p-6 rounded-3xl text-center">
                  <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    Income Change
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${
                    historicalData.yearOverYear.incomeChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {historicalData.yearOverYear.incomeChange >= 0 ? '+' : ''}
                    ₱{historicalData.yearOverYear.incomeChange.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    vs {historicalData.yearOverYear.previousYear}
                  </div>
                </div>

                <div className="liquid-card p-6 rounded-3xl text-center">
                  <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    Expense Change
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${
                    historicalData.yearOverYear.expenseChange <= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {historicalData.yearOverYear.expenseChange >= 0 ? '+' : ''}
                    ₱{historicalData.yearOverYear.expenseChange.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    vs {historicalData.yearOverYear.previousYear}
                  </div>
                </div>

                <div className="liquid-card p-6 rounded-3xl text-center">
                  <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    Savings Change
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${
                    historicalData.yearOverYear.savingsChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {historicalData.yearOverYear.savingsChange >= 0 ? '+' : ''}
                    ₱{historicalData.yearOverYear.savingsChange.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    vs {historicalData.yearOverYear.previousYear}
                  </div>
                </div>

                <div className="liquid-card p-6 rounded-3xl text-center">
                  <div className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    Budget Adherence
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${
                    historicalData.yearOverYear.budgetAdherenceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {historicalData.yearOverYear.budgetAdherenceChange >= 0 ? '+' : ''}
                    {historicalData.yearOverYear.budgetAdherenceChange.toFixed(1)}%
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    vs {historicalData.yearOverYear.previousYear}
                  </div>
                </div>
              </div>

              {/* Top Spending Changes */}
              <div className="liquid-card p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Top Spending Category Changes
                  </h3>
                  <FiBarChart size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
                
                <div className="space-y-4">
                  {historicalData.yearOverYear.topSpendingChanges.map((change, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {change.category}
                        </span>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(change.change >= 0 ? 'increasing' : 'decreasing')}
                          <span className={`font-semibold ${
                            change.change >= 0 ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {change.change >= 0 ? '+' : ''}₱{change.change.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {change.percentage.toFixed(1)}% change from {historicalData.yearOverYear?.previousYear || 'previous year'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="liquid-card p-8 rounded-3xl text-center">
              <FiInfo size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)' }}>
                Not enough historical data for year-over-year comparison. 
                Archive more monthly data to see this analysis.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Long-term Trends Tab */}
      {activeTab === 'long-term-trends' && (
        <div className="space-y-8">
          {historicalData.longTermTrends ? (
            <>
              {/* Trends Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="liquid-card p-6 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    {getTrendIcon(historicalData.longTermTrends.spendingTrends.trend)}
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Spending Trend
                    </h4>
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {historicalData.longTermTrends.spendingTrends.trend}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {historicalData.longTermTrends.spendingTrends.rate.toFixed(1)}% change rate
                  </div>
                </div>

                <div className="liquid-card p-6 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    {getTrendIcon(historicalData.longTermTrends.budgetAdherenceTrends.trend)}
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Budget Adherence
                    </h4>
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {historicalData.longTermTrends.budgetAdherenceTrends.trend}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {historicalData.longTermTrends.budgetAdherenceTrends.rate.toFixed(1)}% change rate
                  </div>
                </div>

                <div className="liquid-card p-6 rounded-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    {getTrendIcon(historicalData.longTermTrends.savingsTrends.trend)}
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Savings Trend
                    </h4>
                  </div>
                  <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    {historicalData.longTermTrends.savingsTrends.trend}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {historicalData.longTermTrends.savingsTrends.rate.toFixed(1)}% change rate
                  </div>
                </div>
              </div>

              {/* Predictions */}
              <div className="liquid-card p-8 rounded-3xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Next Month Predictions
                  </h3>
                  <FiTarget size={24} style={{ color: 'var(--text-muted)' }} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 rounded-xl bg-white/5">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Predicted Spending
                    </h4>
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      ₱{historicalData.longTermTrends.predictions.nextMonth.toLocaleString()}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Based on historical trends
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-white/5">
                    <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                      Prediction Confidence
                    </h4>
                    <div className="text-3xl font-bold text-green-400 mb-2">
                      {historicalData.longTermTrends.predictions.confidence.toFixed(1)}%
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Confidence level
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="liquid-card p-8 rounded-3xl text-center">
              <FiInfo size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p style={{ color: 'var(--text-muted)' }}>
                Not enough historical data for long-term trend analysis. 
                Archive more monthly data to see this analysis.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoricalDataView;

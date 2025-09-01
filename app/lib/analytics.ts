// Advanced Analytics Library for Buni Money Tracker
// Provides comprehensive financial insights, trends, and predictive analytics
// Inspired by Mint, YNAB, and Personal Capital

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  account?: string;
  tags?: string[];
  recurring?: boolean;
  merchant?: string;
}

export interface SpendingTrend {
  date: string;
  amount: number;
  count: number;
  averageAmount: number;
  medianAmount: number;
  variance: number;
}

export interface CategoryAnalysis {
  category: string;
  totalAmount: number;
  percentage: number;
  transactionCount: number;
  averageAmount: number;
  medianAmount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyGrowth: number;
  volatility: number;
  budgetAllocation?: number;
  budgetStatus: 'under' | 'over' | 'on-track';
}

export interface FinancialHealthMetrics {
  savingsRate: number;
  budgetAdherence: number;
  incomeStability: number;
  emergencyFundRatio: number;
  debtRatio: number;
  overallScore: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  creditScore: number;
  netWorth: number;
  cashFlow: number;
}

export interface SpendingInsights {
  topSpendingCategory: string;
  largestTransaction: Transaction;
  spendingVelocity: number;
  unusualSpending: Transaction[];
  seasonalPatterns: any[];
  budgetVariance: number;
  spendingAnomalies: Transaction[];
  merchantInsights: { merchant: string; totalSpent: number; frequency: number }[];
  categoryEfficiency: { category: string; efficiency: number; recommendation: string }[];
}

export interface PredictiveAnalytics {
  nextMonthSpending: number;
  budgetForecast: number;
  savingsProjection: number;
  riskFactors: string[];
  opportunities: string[];
  cashFlowProjection: number[];
  breakEvenDate?: string;
  financialIndependenceDate?: string;
}

export interface BudgetMetrics {
  totalBudget: number;
  spent: number;
  remaining: number;
  dailyBudget: number;
  remainingDays: number;
  projectedOverspend: number;
  categoryBudgets: { category: string; budget: number; spent: number; remaining: number }[];
  status: 'under-budget' | 'on-track' | 'over-budget' | 'critical';
  recommendations: string[];
}

export class AnalyticsEngine {
  private transactions: Transaction[] = [];
  private monthlyBudget: number = 50000; // Default budget
  private categoryBudgets: { [key: string]: number } = {};
  private userProfile: any = {};

  constructor(transactions: Transaction[], budget?: number, categoryBudgets?: { [key: string]: number }, userProfile?: any) {
    this.transactions = this.validateAndCleanTransactions(transactions);
    if (budget) this.monthlyBudget = budget;
    if (categoryBudgets) this.categoryBudgets = categoryBudgets;
    if (userProfile) this.userProfile = userProfile;
  }

  // Data validation and cleaning
  private validateAndCleanTransactions(transactions: Transaction[]): Transaction[] {
    return transactions
      .filter(t => t && typeof t.amount === 'number' && t.amount > 0)
      .filter(t => t.date && !isNaN(new Date(t.date).getTime()))
      .map(t => ({
        ...t,
        amount: Math.abs(t.amount), // Ensure positive amounts
        category: t.category || 'Other',
        description: t.description || 'No description',
        date: new Date(t.date).toISOString().split('T')[0], // Normalize date format
        tags: t.tags || [],
        recurring: t.recurring || false,
        merchant: t.merchant || 'Unknown'
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get filtered transactions by period with enhanced filtering
  private getFilteredTransactions(period: string): Transaction[] {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
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
        return this.transactions;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    
    return this.transactions.filter(t => new Date(t.date) >= startDate);
  }

  // Enhanced Spending Trends Analysis with statistical measures
  getSpendingTrends(period: string = 'month'): SpendingTrend[] {
    const filteredTransactions = this.getFilteredTransactions(period);
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    const dailySpending: { [key: string]: { amounts: number[]; count: number } } = {};
    
    expenses.forEach(t => {
      const date = new Date(t.date).toLocaleDateString();
      if (!dailySpending[date]) {
        dailySpending[date] = { amounts: [], count: 0 };
      }
      dailySpending[date].amounts.push(t.amount);
      dailySpending[date].count += 1;
    });

    return Object.entries(dailySpending)
      .map(([date, data]) => {
        const totalAmount = data.amounts.reduce((sum, amount) => sum + amount, 0);
        const averageAmount = totalAmount / data.count;
        const sortedAmounts = data.amounts.sort((a, b) => a - b);
        const medianAmount = sortedAmounts[Math.floor(sortedAmounts.length / 2)];
        const variance = data.amounts.reduce((sum, amount) => sum + Math.pow(amount - averageAmount, 2), 0) / data.count;

        return {
          date,
          amount: totalAmount,
          count: data.count,
          averageAmount,
          medianAmount,
          variance
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Enhanced Category Analysis with volatility and budget tracking
  getCategoryAnalysis(period: string = 'month'): CategoryAnalysis[] {
    const filteredTransactions = this.getFilteredTransactions(period);
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    const categoryData: { [key: string]: { amounts: number[]; transactions: Transaction[] } } = {};
    
    expenses.forEach(t => {
      const category = t.category || 'Other';
      if (!categoryData[category]) {
        categoryData[category] = { amounts: [], transactions: [] };
      }
      categoryData[category].amounts.push(t.amount);
      categoryData[category].transactions.push(t);
    });

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    return Object.entries(categoryData)
      .map(([category, data]) => {
        const totalAmount = data.amounts.reduce((sum, amount) => sum + amount, 0);
        const percentage = totalExpenses > 0 ? (totalAmount / totalExpenses) * 100 : 0;
        const averageAmount = data.amounts.length > 0 ? totalAmount / data.amounts.length : 0;
        const sortedAmounts = data.amounts.sort((a, b) => a - b);
        const medianAmount = sortedAmounts[Math.floor(sortedAmounts.length / 2)];
        
        // Calculate volatility (coefficient of variation)
        const variance = data.amounts.reduce((sum, amount) => sum + Math.pow(amount - averageAmount, 2), 0) / data.amounts.length;
        const volatility = averageAmount > 0 ? Math.sqrt(variance) / averageAmount : 0;
        
        // Calculate trend and growth
        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        let monthlyGrowth = 0;
        
        if (data.transactions.length >= 2) {
          const sortedTransactions = data.transactions.sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          const firstHalf = sortedTransactions.slice(0, Math.floor(sortedTransactions.length / 2));
          const secondHalf = sortedTransactions.slice(Math.floor(sortedTransactions.length / 2));
          
          const firstHalfTotal = firstHalf.reduce((sum, t) => sum + t.amount, 0);
          const secondHalfTotal = secondHalf.reduce((sum, t) => sum + t.amount, 0);
          
          if (secondHalfTotal > firstHalfTotal * 1.1) {
            trend = 'increasing';
          } else if (secondHalfTotal < firstHalfTotal * 0.9) {
            trend = 'decreasing';
          }
          
          monthlyGrowth = firstHalfTotal > 0 ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100 : 0;
        }

        // Budget status
        const categoryBudget = this.categoryBudgets[category] || 0;
        const budgetAllocation = categoryBudget;
        let budgetStatus: 'under' | 'over' | 'on-track' = 'on-track';
        if (categoryBudget > 0) {
          const usagePercentage = (totalAmount / categoryBudget) * 100;
          if (usagePercentage > 100) {
            budgetStatus = 'over';
          } else if (usagePercentage > 90) {
            budgetStatus = 'on-track';
          } else {
            budgetStatus = 'under';
          }
        }

        return {
          category,
          totalAmount,
          percentage,
          transactionCount: data.amounts.length,
          averageAmount,
          medianAmount,
          trend,
          monthlyGrowth,
          volatility,
          budgetAllocation,
          budgetStatus
        };
      })
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }

  // Enhanced Financial Health Score with more sophisticated metrics
  getFinancialHealth(period: string = 'month'): FinancialHealthMetrics {
    const filteredTransactions = this.getFilteredTransactions(period);
    const income = filteredTransactions.filter(t => t.type === 'income');
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netIncome = totalIncome - totalExpenses;
    
    // Enhanced savings rate calculation (25% weight)
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    const savingsScore = Math.min(savingsRate / 20, 1) * 25; // 20% savings rate = full points
    
    // Enhanced budget adherence (20% weight)
    const budgetUsagePercent = period === 'all-time' ? 0 : (totalExpenses / this.monthlyBudget) * 100;
    const budgetScore = period === 'all-time' ? 20 : Math.max(0, (100 - budgetUsagePercent) / 100) * 20;
    
    // Enhanced income stability (20% weight)
    let incomeStabilityScore = 20;
    if (income.length > 1 && totalIncome > 0) {
      const sortedIncome = income.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const amounts = sortedIncome.map(t => t.amount);
      const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
      const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
      const coefficientOfVariation = Math.sqrt(variance) / mean;
      incomeStabilityScore = Math.max(0, (1 - coefficientOfVariation)) * 20;
    }
    
    // Emergency fund ratio (15% weight)
    const monthlyExpenses = totalExpenses / (period === 'month' ? 1 : period === 'quarter' ? 3 : period === 'year' ? 12 : 1);
    const emergencyFundRatio = monthlyExpenses > 0 ? netIncome / (monthlyExpenses * 3) : 1;
    const emergencyFundScore = Math.min(emergencyFundRatio, 1) * 15;
    
    // Debt ratio (10% weight)
    const debtRatio = totalIncome > 0 ? totalExpenses / totalIncome : 0;
    const debtScore = Math.max(0, (1 - debtRatio)) * 10;
    
    // Cash flow analysis (10% weight)
    const cashFlow = netIncome;
    const cashFlowScore = cashFlow > 0 ? 10 : Math.max(0, (cashFlow / totalIncome) * 10);
    
    const overallScore = Math.round(savingsScore + budgetScore + incomeStabilityScore + emergencyFundScore + debtScore + cashFlowScore);
    
    // Risk level assessment
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (overallScore < 50) riskLevel = 'high';
    else if (overallScore < 70) riskLevel = 'medium';
    
    // Credit score simulation (based on financial behavior)
    let creditScore = 750; // Base score
    if (savingsRate > 20) creditScore += 50;
    if (budgetUsagePercent < 80) creditScore += 30;
    if (incomeStabilityScore > 15) creditScore += 40;
    if (emergencyFundRatio > 0.5) creditScore += 30;
    if (debtRatio < 0.5) creditScore += 50;
    creditScore = Math.min(850, Math.max(300, creditScore));
    
    // Generate enhanced recommendations
    const recommendations: string[] = [];
    if (savingsRate < 10) {
      recommendations.push('Increase your savings rate to at least 20% for better financial security.');
    }
    if (budgetUsagePercent > 90) {
      recommendations.push('You\'re approaching your budget limit. Review discretionary spending.');
    }
    if (incomeStabilityScore < 10) {
      recommendations.push('Consider diversifying your income sources for better stability.');
    }
    if (emergencyFundRatio < 0.5) {
      recommendations.push('Build an emergency fund covering 3-6 months of expenses.');
    }
    if (debtRatio > 0.8) {
      recommendations.push('Focus on reducing expenses to improve your debt-to-income ratio.');
    }
    if (cashFlow < 0) {
      recommendations.push('Your expenses exceed income. Create a plan to increase income or reduce spending.');
    }
    
    return {
      savingsRate,
      budgetAdherence: 100 - budgetUsagePercent,
      incomeStability: incomeStabilityScore,
      emergencyFundRatio: emergencyFundRatio * 100,
      debtRatio: debtRatio * 100,
      overallScore,
      recommendations,
      riskLevel,
      creditScore,
      netWorth: netIncome,
      cashFlow
    };
  }

  // Enhanced Spending Insights with anomaly detection
  getSpendingInsights(period: string = 'month'): SpendingInsights {
    const filteredTransactions = this.getFilteredTransactions(period);
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    // Top spending category
    const categoryAnalysis = this.getCategoryAnalysis(period);
    const topSpendingCategory = categoryAnalysis[0]?.category || 'None';
    
    // Largest transaction
    const largestTransaction = expenses.reduce((max, t) => 
      t.amount > max.amount ? t : max, expenses[0] || { amount: 0, description: '', category: '', date: '', type: 'expense' as const, id: 0 }
    );
    
    // Spending velocity (average daily spending)
    const spendingTrends = this.getSpendingTrends(period);
    const spendingVelocity = spendingTrends.length > 0 
      ? spendingTrends.reduce((sum, t) => sum + t.amount, 0) / spendingTrends.length 
      : 0;
    
    // Anomaly detection for unusual spending
    const amounts = expenses.map(t => t.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);
    const unusualSpending = expenses.filter(t => t.amount > mean + (2 * standardDeviation));
    
    // Spending anomalies (transactions that are statistical outliers)
    const spendingAnomalies = expenses.filter(t => t.amount > mean + (3 * standardDeviation));
    
    // Merchant insights
    const merchantData: { [key: string]: { totalSpent: number; frequency: number } } = {};
    expenses.forEach(t => {
      const merchant = t.merchant || 'Unknown';
      if (!merchantData[merchant]) {
        merchantData[merchant] = { totalSpent: 0, frequency: 0 };
      }
      merchantData[merchant].totalSpent += t.amount;
      merchantData[merchant].frequency += 1;
    });
    
    const merchantInsights = Object.entries(merchantData)
      .map(([merchant, data]) => ({ merchant, totalSpent: data.totalSpent, frequency: data.frequency }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
    
    // Category efficiency analysis
    const categoryEfficiency = categoryAnalysis.map(category => {
      const efficiency = category.volatility < 0.5 ? 'high' : category.volatility < 1 ? 'medium' : 'low';
      let recommendation = '';
      if (efficiency === 'low') {
        recommendation = 'Consider setting a budget for this category to reduce volatility.';
      } else if (category.trend === 'increasing') {
        recommendation = 'Monitor spending in this category as it\'s trending upward.';
      } else {
        recommendation = 'Good spending control in this category.';
      }
      
      return {
        category: category.category,
        efficiency: category.volatility,
        recommendation
      };
    });
    
    // Seasonal patterns (by month)
    const monthlySpending: { [key: string]: number } = {};
    expenses.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'long' });
      monthlySpending[month] = (monthlySpending[month] || 0) + t.amount;
    });
    const seasonalPatterns = Object.entries(monthlySpending).map(([month, amount]) => ({ month, amount }));
    
    // Budget variance
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const budgetVariance = period === 'all-time' ? 0 : ((totalExpenses - this.monthlyBudget) / this.monthlyBudget) * 100;
    
    return {
      topSpendingCategory,
      largestTransaction,
      spendingVelocity,
      unusualSpending,
      seasonalPatterns,
      budgetVariance,
      spendingAnomalies,
      merchantInsights,
      categoryEfficiency
    };
  }

  // Enhanced Predictive Analytics with more sophisticated forecasting
  getPredictiveAnalytics(period: string = 'month'): PredictiveAnalytics {
    const spendingTrends = this.getSpendingTrends(period);
    const categoryAnalysis = this.getCategoryAnalysis(period);
    const financialHealth = this.getFinancialHealth(period);
    
    // Enhanced next month spending forecast using linear regression
    let nextMonthSpending = 0;
    if (spendingTrends.length >= 7) {
      const recentTrends = spendingTrends.slice(-7);
      const xValues = recentTrends.map((_, index) => index);
      const yValues = recentTrends.map(t => t.amount);
      
      // Simple linear regression
      const n = xValues.length;
      const sumX = xValues.reduce((sum, x) => sum + x, 0);
      const sumY = yValues.reduce((sum, y) => sum + y, 0);
      const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
      const sumXX = xValues.reduce((sum, x) => sum + x * x, 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // Project 30 days ahead
      nextMonthSpending = slope * 30 + intercept;
    }
    
    // Budget forecast
    const budgetForecast = this.monthlyBudget - nextMonthSpending;
    
    // Enhanced savings projection
    const income = this.getFilteredTransactions(period).filter(t => t.type === 'income');
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = totalIncome / (period === 'month' ? 1 : period === 'quarter' ? 3 : period === 'year' ? 12 : 1);
    const savingsProjection = monthlyIncome - nextMonthSpending;
    
    // Cash flow projection (next 6 months)
    const cashFlowProjection = Array.from({ length: 6 }, (_, i) => {
      const projectedIncome = monthlyIncome * (i + 1);
      const projectedSpending = nextMonthSpending * (i + 1);
      return projectedIncome - projectedSpending;
    });
    
    // Break-even date calculation
    let breakEvenDate: string | undefined;
    if (financialHealth.netWorth < 0) {
      const monthlySavings = savingsProjection;
      if (monthlySavings > 0) {
        const monthsToBreakEven = Math.abs(financialHealth.netWorth) / monthlySavings;
        const breakEven = new Date();
        breakEven.setMonth(breakEven.getMonth() + Math.ceil(monthsToBreakEven));
        breakEvenDate = breakEven.toISOString().split('T')[0];
      }
    }
    
    // Financial independence date (simplified calculation)
    let financialIndependenceDate: string | undefined;
    const targetNetWorth = this.monthlyBudget * 12 * 25; // 25x annual expenses (4% rule)
    if (savingsProjection > 0) {
      const monthsToFI = (targetNetWorth - financialHealth.netWorth) / savingsProjection;
      if (monthsToFI > 0) {
        const fiDate = new Date();
        fiDate.setMonth(fiDate.getMonth() + Math.ceil(monthsToFI));
        financialIndependenceDate = fiDate.toISOString().split('T')[0];
      }
    }
    
    // Enhanced risk factors
    const riskFactors: string[] = [];
    if (nextMonthSpending > this.monthlyBudget) {
      riskFactors.push('Projected spending exceeds monthly budget');
    }
    if (spendingTrends.length > 0) {
      const recentSpending = spendingTrends.slice(-3);
      const spendingIncrease = recentSpending.reduce((sum, t) => sum + t.amount, 0) / recentSpending.length;
      const earlierSpending = spendingTrends.slice(-6, -3);
      const earlierAverage = earlierSpending.reduce((sum, t) => sum + t.amount, 0) / earlierSpending.length;
      
      if (spendingIncrease > earlierAverage * 1.2) {
        riskFactors.push('Spending trend is increasing rapidly');
      }
    }
    if (financialHealth.riskLevel === 'high') {
      riskFactors.push('Overall financial health needs improvement');
    }
    
    // Enhanced opportunities
    const opportunities: string[] = [];
    const lowSpendingCategories = categoryAnalysis.filter(c => c.percentage < 5);
    if (lowSpendingCategories.length > 0) {
      opportunities.push(`Consider reducing spending in: ${lowSpendingCategories.map(c => c.category).join(', ')}`);
    }
    if (savingsProjection > 0) {
      opportunities.push(`Potential monthly savings: ₱${savingsProjection.toLocaleString()}`);
    }
    if (financialHealth.savingsRate < 20) {
      opportunities.push('Increase savings rate to 20% for better financial security');
    }
    if (breakEvenDate) {
      opportunities.push(`Projected break-even date: ${breakEvenDate}`);
    }
    if (financialIndependenceDate) {
      opportunities.push(`Financial independence possible by: ${financialIndependenceDate}`);
    }
    
    return {
      nextMonthSpending,
      budgetForecast,
      savingsProjection,
      riskFactors,
      opportunities,
      cashFlowProjection,
      breakEvenDate,
      financialIndependenceDate
    };
  }

  // Enhanced Income vs Expense Analysis
  getIncomeExpenseAnalysis(period: string = 'month') {
    const filteredTransactions = this.getFilteredTransactions(period);
    const income = filteredTransactions.filter(t => t.type === 'income');
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    
    // Enhanced income sources breakdown
    const incomeSources: { [key: string]: { amount: number; count: number; average: number } } = {};
    income.forEach(t => {
      const source = t.category || 'Other';
      if (!incomeSources[source]) {
        incomeSources[source] = { amount: 0, count: 0, average: 0 };
      }
      incomeSources[source].amount += t.amount;
      incomeSources[source].count += 1;
    });
    
    Object.keys(incomeSources).forEach(source => {
      incomeSources[source].average = incomeSources[source].amount / incomeSources[source].count;
    });
    
    // Enhanced expense categories breakdown
    const expenseCategories: { [key: string]: { amount: number; count: number; average: number } } = {};
    expenses.forEach(t => {
      const category = t.category || 'Other';
      if (!expenseCategories[category]) {
        expenseCategories[category] = { amount: 0, count: 0, average: 0 };
      }
      expenseCategories[category].amount += t.amount;
      expenseCategories[category].count += 1;
    });
    
    Object.keys(expenseCategories).forEach(category => {
      expenseCategories[category].average = expenseCategories[category].amount / expenseCategories[category].count;
    });
    
    return {
      totalIncome,
      totalExpenses,
      netBalance,
      incomeSources: Object.entries(incomeSources).map(([source, data]) => ({ 
        source, 
        amount: data.amount, 
        count: data.count, 
        average: data.average 
      })),
      expenseCategories: Object.entries(expenseCategories).map(([category, data]) => ({ 
        category, 
        amount: data.amount, 
        count: data.count, 
        average: data.average 
      })),
      savingsRate: totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0,
      expenseRatio: totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0,
      cashFlow: netBalance,
      averageDailyIncome: totalIncome / (period === 'month' ? 30 : period === 'quarter' ? 90 : period === 'year' ? 365 : 7),
      averageDailyExpenses: totalExpenses / (period === 'month' ? 30 : period === 'quarter' ? 90 : period === 'year' ? 365 : 7)
    };
  }

  // Enhanced Spending Velocity Analysis
  getSpendingVelocity(period: string = 'month') {
    const spendingTrends = this.getSpendingTrends(period);
    
    if (spendingTrends.length === 0) {
      return {
        dailyAverage: 0,
        weeklyAverage: 0,
        monthlyProjection: 0,
        trend: 'stable',
        acceleration: 0,
        volatility: 0,
        peakDay: null,
        lowDay: null
      };
    }
    
    const dailyAverage = spendingTrends.reduce((sum, t) => sum + t.amount, 0) / spendingTrends.length;
    const weeklyAverage = dailyAverage * 7;
    const monthlyProjection = dailyAverage * 30;
    
    // Calculate trend and acceleration
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    let acceleration = 0;
    
    if (spendingTrends.length >= 3) {
      const recent = spendingTrends.slice(-3);
      const earlier = spendingTrends.slice(-6, -3);
      
      const recentAverage = recent.reduce((sum, t) => sum + t.amount, 0) / recent.length;
      const earlierAverage = earlier.reduce((sum, t) => sum + t.amount, 0) / earlier.length;
      
      if (recentAverage > earlierAverage * 1.1) {
        trend = 'increasing';
      } else if (recentAverage < earlierAverage * 0.9) {
        trend = 'decreasing';
      }
      
      acceleration = earlierAverage > 0 ? ((recentAverage - earlierAverage) / earlierAverage) * 100 : 0;
    }
    
    // Calculate volatility
    const amounts = spendingTrends.map(t => t.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const volatility = mean > 0 ? Math.sqrt(variance) / mean : 0;
    
    // Find peak and low days
    const peakDay = spendingTrends.reduce((max, t) => t.amount > max.amount ? t : max);
    const lowDay = spendingTrends.reduce((min, t) => t.amount < min.amount ? t : min);
    
    return {
      dailyAverage,
      weeklyAverage,
      monthlyProjection,
      trend,
      acceleration,
      volatility,
      peakDay,
      lowDay
    };
  }

  // Enhanced Budget Performance Analysis
  getBudgetPerformance(period: string = 'month'): BudgetMetrics {
    const filteredTransactions = this.getFilteredTransactions(period);
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    if (period === 'all-time') {
      return {
        totalBudget: this.monthlyBudget,
        spent: 0,
        remaining: this.monthlyBudget,
        dailyBudget: this.monthlyBudget / 30,
        remainingDays: 30,
        projectedOverspend: 0,
        categoryBudgets: [],
        status: 'under-budget',
        recommendations: ['Set up monthly budgets for better tracking']
      };
    }
    
    const spent = totalExpenses;
    const remaining = this.monthlyBudget - spent;
    const usagePercentage = (spent / this.monthlyBudget) * 100;
    
    let status: 'under-budget' | 'on-track' | 'over-budget' | 'critical' = 'under-budget';
    if (usagePercentage > 100) {
      status = 'over-budget';
    } else if (usagePercentage > 90) {
      status = 'critical';
    } else if (usagePercentage > 80) {
      status = 'on-track';
    }
    
    // Calculate daily budget and remaining days
    const daysInPeriod = period === 'week' ? 7 : period === 'month' ? 30 : period === 'quarter' ? 90 : 365;
    const dailyBudget = this.monthlyBudget / daysInPeriod;
    const spendingTrends = this.getSpendingTrends(period);
    const remainingDays = Math.max(0, daysInPeriod - spendingTrends.length);
    
    // Projected overspend
    const spendingVelocity = this.getSpendingVelocity(period);
    const projectedSpending = spendingVelocity.dailyAverage * remainingDays;
    const projectedOverspend = Math.max(0, projectedSpending - remaining);
    
    // Category budgets
    const categoryBudgets = Object.entries(this.categoryBudgets).map(([category, budget]) => {
      const categoryExpenses = expenses.filter(t => t.category === category);
      const categorySpent = categoryExpenses.reduce((sum, t) => sum + t.amount, 0);
      return {
        category,
        budget,
        spent: categorySpent,
        remaining: budget - categorySpent
      };
    });
    
    // Generate recommendations
    const recommendations: string[] = [];
    if (status === 'over-budget') {
      recommendations.push('You\'ve exceeded your budget. Review discretionary spending.');
    } else if (status === 'critical') {
      recommendations.push('You\'re approaching your budget limit. Reduce non-essential expenses.');
    }
    if (projectedOverspend > 0) {
      recommendations.push(`Projected overspend: ₱${projectedOverspend.toLocaleString()}. Adjust spending now.`);
    }
    if (remainingDays > 0) {
      recommendations.push(`Daily budget remaining: ₱${(remaining / remainingDays).toLocaleString()}`);
    }
    
    return {
      totalBudget: this.monthlyBudget,
      spent,
      remaining,
      dailyBudget,
      remainingDays,
      projectedOverspend,
      categoryBudgets,
      status,
      recommendations
    };
  }

  // New method: Get recurring transaction analysis
  getRecurringTransactions() {
    const recurringTransactions = this.transactions.filter(t => t.recurring);
    const recurringExpenses = recurringTransactions.filter(t => t.type === 'expense');
    const recurringIncome = recurringTransactions.filter(t => t.type === 'income');
    
    const monthlyRecurringExpenses = recurringExpenses.reduce((sum, t) => sum + t.amount, 0);
    const monthlyRecurringIncome = recurringIncome.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      recurringExpenses,
      recurringIncome,
      monthlyRecurringExpenses,
      monthlyRecurringIncome,
      netRecurringCashFlow: monthlyRecurringIncome - monthlyRecurringExpenses
    };
  }

  // New method: Get merchant analysis
  getMerchantAnalysis(period: string = 'month') {
    const filteredTransactions = this.getFilteredTransactions(period);
    const expenses = filteredTransactions.filter(t => t.type === 'expense');
    
    const merchantData: { [key: string]: { totalSpent: number; count: number; average: number; categories: string[] } } = {};
    
    expenses.forEach(t => {
      const merchant = t.merchant || 'Unknown';
      if (!merchantData[merchant]) {
        merchantData[merchant] = { totalSpent: 0, count: 0, average: 0, categories: [] };
      }
      merchantData[merchant].totalSpent += t.amount;
      merchantData[merchant].count += 1;
      if (!merchantData[merchant].categories.includes(t.category)) {
        merchantData[merchant].categories.push(t.category);
      }
    });
    
    Object.keys(merchantData).forEach(merchant => {
      merchantData[merchant].average = merchantData[merchant].totalSpent / merchantData[merchant].count;
    });
    
    return Object.entries(merchantData)
      .map(([merchant, data]) => ({
        merchant,
        totalSpent: data.totalSpent,
        count: data.count,
        average: data.average,
        categories: data.categories
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);
  }
}

// Enhanced utility functions for chart data formatting
export const formatChartData = {
  spendingTrends: (trends: SpendingTrend[]) => ({
    labels: trends.map(t => t.date),
    datasets: [{
      label: 'Daily Spending',
      data: trends.map(t => t.amount),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }, {
      label: 'Average',
      data: trends.map(() => trends.reduce((sum, t) => sum + t.amount, 0) / trends.length),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderDash: [5, 5],
      tension: 0.4
    }]
  }),
  
  categoryBreakdown: (categories: CategoryAnalysis[]) => ({
    labels: categories.map(c => c.category),
    datasets: [{
      data: categories.map(c => c.totalAmount),
      backgroundColor: [
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  }),
  
  incomeExpenseComparison: (income: number, expenses: number) => ({
    labels: ['Income', 'Expenses'],
    datasets: [{
      data: [income, expenses],
      backgroundColor: ['#10b981', '#ef4444'],
      borderColor: ['#059669', '#dc2626'],
      borderWidth: 2
    }]
  }),
  
  cashFlowProjection: (projections: number[]) => ({
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [{
      label: 'Projected Cash Flow',
      data: projections,
      borderColor: projections.every(p => p >= 0) ? '#10b981' : '#ef4444',
      backgroundColor: projections.every(p => p >= 0) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }]
  })
};

// Export default instance for easy use
export default AnalyticsEngine;

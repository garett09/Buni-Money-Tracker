// Enhanced Budget Tracking System
// Provides comprehensive budget monitoring, historical analysis, and intelligent recommendations

import { HistoricalDataManager, HistoricalBudgetPerformance, HistoricalSpendingTrends, HistoricalFinancialHealth } from './historicalData';

export interface BudgetAlert {
  id: string;
  type: 'warning' | 'alert' | 'critical' | 'success';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  acknowledged: boolean;
  actionRequired: boolean;
  recommendations: string[];
}

export interface BudgetInsights {
  currentStatus: 'under-budget' | 'on-track' | 'over-budget' | 'critical';
  projectedOverspend: number;
  dailyBudgetRemaining: number;
  categoryAlerts: { category: string; spent: number; budget: number; remaining: number; status: string }[];
  spendingVelocity: number;
  trendAnalysis: { trend: 'improving' | 'declining' | 'stable'; confidence: number };
  recommendations: string[];
  historicalComparison: {
    vsLastMonth: { spending: number; budget: number; health: number };
    vsLastYear: { spending: number; budget: number; health: number };
  };
}

export interface CategoryBudget {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
  status: 'under-budget' | 'on-track' | 'over-budget' | 'critical';
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendations: string[];
}

export class EnhancedBudgetTracker {
  private userId: string;
  private monthlyBudget: number;
  private categoryBudgets: { [key: string]: number };
  private currentMonth: string;

  constructor(userId: string, monthlyBudget: number, categoryBudgets: { [key: string]: number } = {}) {
    this.userId = userId;
    this.monthlyBudget = monthlyBudget;
    this.categoryBudgets = categoryBudgets;
    this.currentMonth = new Date().toISOString().slice(0, 7);
  }

  // Update budget settings
  updateBudget(monthlyBudget: number, categoryBudgets: { [key: string]: number } = {}): void {
    this.monthlyBudget = monthlyBudget;
    this.categoryBudgets = { ...this.categoryBudgets, ...categoryBudgets };
  }

  // Calculate current budget status
  async calculateBudgetStatus(expenses: any[], income: any[]): Promise<BudgetInsights> {
    try {
      const totalExpenses = expenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
      const totalIncome = income.reduce((sum, inc) => sum + Math.abs(inc.amount), 0);
      const netBalance = totalIncome - totalExpenses;
      
      // Calculate usage percentage
      const usagePercentage = (totalExpenses / this.monthlyBudget) * 100;
      
      // Determine current status
      let currentStatus: 'under-budget' | 'on-track' | 'over-budget' | 'critical';
      if (usagePercentage > 100) {
        currentStatus = 'over-budget';
      } else if (usagePercentage > 90) {
        currentStatus = 'critical';
      } else if (usagePercentage > 80) {
        currentStatus = 'on-track';
      } else {
        currentStatus = 'under-budget';
      }

      // Calculate daily budget remaining
      const now = new Date();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const daysRemaining = daysInMonth - now.getDate();
      const dailyBudgetRemaining = daysRemaining > 0 ? (this.monthlyBudget - totalExpenses) / daysRemaining : 0;

      // Calculate spending velocity
      const daysElapsed = now.getDate();
      const spendingVelocity = daysElapsed > 0 ? totalExpenses / daysElapsed : 0;

      // Projected overspend
      const projectedSpending = spendingVelocity * daysInMonth;
      const projectedOverspend = Math.max(0, projectedSpending - this.monthlyBudget);

      // Category analysis
      const categoryAlerts = await this.analyzeCategoryBudgets(expenses);

      // Trend analysis
      const trendAnalysis = await this.analyzeSpendingTrend(expenses);

      // Historical comparison
      const historicalComparison = await this.getHistoricalComparison();

      // Generate recommendations
      const recommendations = this.generateRecommendations(
        currentStatus,
        usagePercentage,
        projectedOverspend,
        dailyBudgetRemaining,
        categoryAlerts
      );

      return {
        currentStatus,
        projectedOverspend,
        dailyBudgetRemaining,
        categoryAlerts,
        spendingVelocity,
        trendAnalysis,
        recommendations,
        historicalComparison
      };
    } catch (error) {
      console.error('Failed to calculate budget status:', error);
      throw error;
    }
  }

  // Analyze category budgets
  private async analyzeCategoryBudgets(expenses: any[]): Promise<{ category: string; spent: number; budget: number; remaining: number; status: string }[]> {
    const categoryAnalysis: { [key: string]: { spent: number; budget: number } } = {};

    // Group expenses by category
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      if (!categoryAnalysis[category]) {
        categoryAnalysis[category] = { spent: 0, budget: 0 };
      }
      categoryAnalysis[category].spent += Math.abs(expense.amount);
      categoryAnalysis[category].budget = this.categoryBudgets[category] || 0;
    });

    // Calculate status for each category
    return Object.entries(categoryAnalysis).map(([category, data]) => {
      const remaining = data.budget - data.spent;
      const usagePercentage = data.budget > 0 ? (data.spent / data.budget) * 100 : 0;
      
      let status = 'under-budget';
      if (usagePercentage > 100) status = 'over-budget';
      else if (usagePercentage > 90) status = 'critical';
      else if (usagePercentage > 80) status = 'on-track';

      return {
        category,
        spent: data.spent,
        budget: data.budget,
        remaining,
        status
      };
    });
  }

  // Analyze spending trend
  private async analyzeSpendingTrend(expenses: any[]): Promise<{ trend: 'improving' | 'declining' | 'stable'; confidence: number }> {
    try {
      // Get historical data for trend analysis
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3); // Last 3 months
      
      const startMonth = startDate.toISOString().slice(0, 7);
      const endMonth = endDate.toISOString().slice(0, 7);
      
      const historicalData = await HistoricalDataManager.getHistoricalBudgetPerformance(this.userId, 12);
      
      if (historicalData.length < 2) {
        return { trend: 'stable', confidence: 50 };
      }

      // Calculate trend based on budget usage percentages
      const recentMonths = historicalData.slice(-2);
      const currentUsage = recentMonths[1]?.budgetUsagePercent || 0;
      const previousUsage = recentMonths[0]?.budgetUsagePercent || 0;
      
      let trend: 'improving' | 'declining' | 'stable' = 'stable';
      let confidence = 50;
      
      if (currentUsage < previousUsage - 5) {
        trend = 'improving';
        confidence = Math.min(90, 50 + Math.abs(currentUsage - previousUsage) * 2);
      } else if (currentUsage > previousUsage + 5) {
        trend = 'declining';
        confidence = Math.min(90, 50 + Math.abs(currentUsage - previousUsage) * 2);
      }

      return { trend, confidence };
    } catch (error) {
      console.error('Failed to analyze spending trend:', error);
      return { trend: 'stable', confidence: 50 };
    }
  }

  // Get historical comparison
  private async getHistoricalComparison(): Promise<{
    vsLastMonth: { spending: number; budget: number; health: number };
    vsLastYear: { spending: number; budget: number; health: number };
  }> {
    try {
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      
      const lastMonthStr = lastMonth.toISOString().slice(0, 7);
      const lastYearStr = lastYear.toISOString().slice(0, 7);
      const currentMonthStr = now.toISOString().slice(0, 7);
      
      const currentData = await HistoricalDataManager.getHistoricalBudgetPerformance(this.userId, 1);
      const lastMonthData = await HistoricalDataManager.getHistoricalBudgetPerformance(this.userId, 2);
      const lastYearData = await HistoricalDataManager.getHistoricalBudgetPerformance(this.userId, 12);
      
      const vsLastMonth = {
        spending: currentData.length > 0 && lastMonthData.length > 0 ? currentData[0].totalExpenses - lastMonthData[0].totalExpenses : 0,
        budget: currentData.length > 0 && lastMonthData.length > 0 ? currentData[0].monthlyBudget - lastMonthData[0].monthlyBudget : 0,
        health: currentData.length > 0 && lastMonthData.length > 0 ? currentData[0].financialHealthScore - lastMonthData[0].financialHealthScore : 0
      };
      
      const vsLastYear = {
        spending: currentData.length > 0 && lastYearData.length > 0 ? currentData[0].totalExpenses - lastYearData[0].totalExpenses : 0,
        budget: currentData.length > 0 && lastYearData.length > 0 ? currentData[0].monthlyBudget - lastYearData[0].monthlyBudget : 0,
        health: currentData.length > 0 && lastYearData.length > 0 ? currentData[0].financialHealthScore - lastYearData[0].financialHealthScore : 0
      };
      
      return { vsLastMonth, vsLastYear };
    } catch (error) {
      console.error('Failed to get historical comparison:', error);
      return {
        vsLastMonth: { spending: 0, budget: 0, health: 0 },
        vsLastYear: { spending: 0, budget: 0, health: 0 }
      };
    }
  }

  // Generate recommendations
  private generateRecommendations(
    status: string,
    usagePercentage: number,
    projectedOverspend: number,
    dailyBudgetRemaining: number,
    categoryAlerts: any[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (status === 'critical') {
      recommendations.push('🚨 CRITICAL: You\'re very close to exceeding your budget. Reduce non-essential expenses immediately.');
    } else if (status === 'over-budget') {
      recommendations.push('⚠️ You\'ve exceeded your monthly budget. Review your spending and adjust accordingly.');
    } else if (status === 'on-track') {
      recommendations.push('⚠️ You\'re approaching your budget limit. Monitor your spending closely.');
    }
    
    if (projectedOverspend > 0) {
      recommendations.push(`📊 Projected overspend: ₱${projectedOverspend.toLocaleString()}. Adjust your daily spending to ₱${dailyBudgetRemaining.toLocaleString()}.`);
    }
    
    if (dailyBudgetRemaining < 0) {
      recommendations.push('💡 Your daily budget is negative. Consider reducing expenses or increasing your budget.');
    }
    
    const overBudgetCategories = categoryAlerts.filter(cat => cat.status === 'over-budget' || cat.status === 'critical');
    if (overBudgetCategories.length > 0) {
      const categories = overBudgetCategories.map(cat => cat.category).join(', ');
      recommendations.push(`🎯 Focus on reducing spending in: ${categories}`);
    }
    
    if (usagePercentage < 70) {
      recommendations.push('✅ Great job staying under budget! Consider increasing your savings or investment contributions.');
    }
    
    return recommendations;
  }

  // Store monthly data for historical analysis
  async storeMonthlyData(expenses: any[], income: any[]): Promise<void> {
    try {
      const totalExpenses = expenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
      const totalIncome = income.reduce((sum, inc) => sum + Math.abs(inc.amount), 0);
      const netBalance = totalIncome - totalExpenses;
      
      // Calculate financial health score
      const healthScore = this.calculateFinancialHealthScore(totalExpenses, totalIncome, netBalance);
      
      // Store budget performance
      const budgetPerformance: HistoricalBudgetPerformance = {
        month: this.currentMonth,
        monthlyBudget: this.monthlyBudget,
        totalExpenses: totalExpenses,
        totalIncome: totalIncome,
        netBalance: netBalance,
        budgetUsagePercent: (totalExpenses / this.monthlyBudget) * 100,
        savingsRate: totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0,
        financialHealthScore: healthScore,
        status: this.getBudgetStatus(totalExpenses),
        categoryBreakdown: this.getCategoryBreakdown(expenses),
        unusualTransactions: 0,
        recommendations: [],
        timestamp: Date.now()
      };
      
      // Note: Historical data is now handled by the EnhancedDashboard component
      // which automatically archives data using HistoricalDataManager.archiveMonthlyData
      
    } catch (error) {
      console.error('Failed to store monthly data:', error);
    }
  }

  // Calculate financial health score
  private calculateFinancialHealthScore(expenses: number, income: number, netBalance: number): number {
    let score = 0;
    
    // Savings rate (30% weight)
    if (income > 0) {
      const savingsRate = (netBalance / income) * 100;
      score += Math.min(savingsRate / 20, 1) * 30;
    }
    
    // Budget adherence (25% weight)
    const budgetUsage = (expenses / this.monthlyBudget) * 100;
    score += Math.max(0, (100 - budgetUsage) / 100) * 25;
    
    // Income stability (20% weight) - simplified
    score += 20;
    
    // Emergency fund (15% weight)
    if (expenses > 0) {
      const emergencyRatio = netBalance / (expenses * 3);
      score += Math.min(emergencyRatio, 1) * 15;
    }
    
    // Debt ratio (10% weight)
    if (income > 0) {
      const debtRatio = expenses / income;
      score += Math.max(0, (1 - debtRatio)) * 10;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Get budget status
  private getBudgetStatus(expenses: number): 'under-budget' | 'on-track' | 'over-budget' | 'critical' {
    const usagePercentage = (expenses / this.monthlyBudget) * 100;
    
    if (usagePercentage > 100) return 'over-budget';
    if (usagePercentage > 90) return 'critical';
    if (usagePercentage > 80) return 'on-track';
    return 'under-budget';
  }

  // Get health status
  private getHealthStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  }

  // Get category breakdown
  private getCategoryBreakdown(expenses: any[]): { [key: string]: number } {
    const breakdown: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      const category = expense.category || 'Other';
      breakdown[category] = (breakdown[category] || 0) + Math.abs(expense.amount);
    });
    
    return breakdown;
  }

  // Get top categories
  private getTopCategories(expenses: any[]): { category: string; amount: number; percentage: number }[] {
    const breakdown = this.getCategoryBreakdown(expenses);
    const total = Object.values(breakdown).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  // Detect unusual spending
  private detectUnusualSpending(expenses: any[]): number {
    if (expenses.length < 3) return 0;
    
    const amounts = expenses.map(exp => Math.abs(exp.amount));
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const standardDeviation = Math.sqrt(variance);
    
    return expenses.filter(exp => Math.abs(exp.amount) > mean + (2 * standardDeviation)).length;
  }

  // Calculate spending velocity
  private calculateSpendingVelocity(expenses: any[]): number {
    const total = expenses.reduce((sum, exp) => sum + Math.abs(exp.amount), 0);
    const daysElapsed = new Date().getDate();
    return daysElapsed > 0 ? total / daysElapsed : 0;
  }

  // Determine spending trend
  private determineSpendingTrend(expenses: any[]): 'increasing' | 'decreasing' | 'stable' {
    if (expenses.length < 4) return 'stable';
    
    const amounts = expenses.map(exp => Math.abs(exp.amount));
    const midPoint = Math.floor(amounts.length / 2);
    const firstHalf = amounts.slice(0, midPoint);
    const secondHalf = amounts.slice(midPoint);
    
    const firstHalfAvg = firstHalf.reduce((sum, amount) => sum + amount, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, amount) => sum + amount, 0) / secondHalf.length;
    
    const changePercent = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    if (changePercent > 10) return 'increasing';
    if (changePercent < -10) return 'decreasing';
    return 'stable';
  }

  // Calculate emergency fund ratio
  private calculateEmergencyFundRatio(netBalance: number, expenses: number): number {
    if (expenses <= 0) return 100;
    return Math.min(100, (netBalance / (expenses * 3)) * 100);
  }

  // Generate health improvements
  private generateHealthImprovements(score: number, expenses: number, income: number): string[] {
    const improvements: string[] = [];
    
    if (score < 60) {
      improvements.push('Focus on reducing expenses and increasing savings');
      improvements.push('Set up an emergency fund');
      improvements.push('Review and adjust your budget');
    }
    
    if (expenses > income * 0.8) {
      improvements.push('Reduce spending to below 80% of income');
    }
    
    if (score < 80) {
      improvements.push('Consider increasing your savings rate');
      improvements.push('Review your spending categories for optimization');
    }
    
    return improvements;
  }

  // Get budget alerts
  async getBudgetAlerts(expenses: any[]): Promise<BudgetAlert[]> {
    try {
      const budgetStatus = await this.calculateBudgetStatus(expenses, []);
      const alerts: BudgetAlert[] = [];
      
      // Budget usage alerts
      if (budgetStatus.currentStatus === 'critical') {
        alerts.push({
          id: `budget-critical-${Date.now()}`,
          type: 'critical',
          title: 'Budget Critical Alert',
          message: 'You are very close to exceeding your monthly budget. Immediate action required.',
          severity: 'high',
          timestamp: Date.now(),
          acknowledged: false,
          actionRequired: true,
          recommendations: budgetStatus.recommendations
        });
      } else if (budgetStatus.currentStatus === 'over-budget') {
        alerts.push({
          id: `budget-over-${Date.now()}`,
          type: 'alert',
          title: 'Budget Exceeded',
          message: 'You have exceeded your monthly budget. Review your spending immediately.',
          severity: 'high',
          timestamp: Date.now(),
          acknowledged: false,
          actionRequired: true,
          recommendations: budgetStatus.recommendations
        });
      } else if (budgetStatus.currentStatus === 'on-track') {
        alerts.push({
          id: `budget-warning-${Date.now()}`,
          type: 'warning',
          title: 'Budget Warning',
          message: 'You are approaching your budget limit. Monitor your spending closely.',
          severity: 'medium',
          timestamp: Date.now(),
          acknowledged: false,
          actionRequired: false,
          recommendations: budgetStatus.recommendations
        });
      }
      
      // Projected overspend alerts
      if (budgetStatus.projectedOverspend > 0) {
        alerts.push({
          id: `projected-overspend-${Date.now()}`,
          type: 'warning',
          title: 'Projected Budget Overspend',
          message: `Based on current spending, you are projected to exceed your budget by ₱${budgetStatus.projectedOverspend.toLocaleString()}.`,
          severity: 'medium',
          timestamp: Date.now(),
          acknowledged: false,
          actionRequired: false,
          recommendations: budgetStatus.recommendations
        });
      }
      
      // Category alerts
      const criticalCategories = budgetStatus.categoryAlerts.filter(cat => cat.status === 'critical' || cat.status === 'over-budget');
      if (criticalCategories.length > 0) {
        const categories = criticalCategories.map(cat => cat.category).join(', ');
        alerts.push({
          id: `category-alert-${Date.now()}`,
          type: 'warning',
          title: 'Category Budget Alert',
          message: `The following categories are over budget: ${categories}`,
          severity: 'medium',
          timestamp: Date.now(),
          acknowledged: false,
          actionRequired: false,
          recommendations: [`Focus on reducing spending in: ${categories}`]
        });
      }
      
      return alerts;
    } catch (error) {
      console.error('Failed to get budget alerts:', error);
      return [];
    }
  }

  // Get comprehensive budget insights
  async getComprehensiveInsights(expenses: any[], income: any[]): Promise<{
    currentStatus: BudgetInsights;
    historicalTrends: any;
    yearOverYear: any;
    recommendations: string[];
  }> {
    try {
      const currentStatus = await this.calculateBudgetStatus(expenses, income);
      const historicalTrends = await HistoricalDataManager.getTrendAnalysis(this.userId, 'budgetAdherence', 12);
      const yearOverYear = await HistoricalDataManager.generateYearOverYearComparison(this.userId, new Date().getFullYear());
      
      // Combine recommendations
      const allRecommendations = [
        ...currentStatus.recommendations,
        ...(yearOverYear ? ['Review your yearly performance and adjust goals accordingly'] : [])
      ];
      
      return {
        currentStatus,
        historicalTrends,
        yearOverYear,
        recommendations: allRecommendations
      };
    } catch (error) {
      console.error('Failed to get comprehensive insights:', error);
      throw error;
    }
  }
}

// Historical Data Management System
// Provides comprehensive storage and analysis of long-term financial data

export interface HistoricalBudgetPerformance {
  month: string; // YYYY-MM format
  monthlyBudget: number;
  totalExpenses: number;
  totalIncome: number;
  netBalance: number;
  budgetUsagePercent: number;
  savingsRate: number;
  financialHealthScore: number;
  status: 'under-budget' | 'on-track' | 'over-budget' | 'critical';
  categoryBreakdown: { [key: string]: number };
  unusualTransactions: number;
  recommendations: string[];
  timestamp: number;
}

export interface HistoricalSpendingTrends {
  month: string;
  dailyAverage: number;
  weeklyAverage: number;
  monthlyTotal: number;
  topCategories: { category: string; amount: number; percentage: number }[];
  spendingVelocity: number;
  seasonalFactor: number;
  timestamp: number;
}

export interface HistoricalFinancialHealth {
  month: string;
  overallScore: number;
  savingsScore: number;
  budgetScore: number;
  incomeStabilityScore: number;
  emergencyFundScore: number;
  debtScore: number;
  cashFlowScore: number;
  insights: string[];
  timestamp: number;
}

export interface YearOverYearComparison {
  currentYear: number;
  previousYear: number;
  incomeChange: number;
  expenseChange: number;
  savingsChange: number;
  budgetAdherenceChange: number;
  topSpendingChanges: { category: string; change: number; percentage: number }[];
  seasonalPatterns: { month: string; factor: number }[];
}

export interface HistoricalDataArchive {
  userId: string;
  budgetPerformance: HistoricalBudgetPerformance[];
  spendingTrends: HistoricalSpendingTrends[];
  financialHealth: HistoricalFinancialHealth[];
  lastUpdated: number;
  dataRetentionDays: number;
}

export class HistoricalDataManager {
  private static readonly DATA_RETENTION_DAYS = Infinity; // Keep data forever
  private static readonly ARCHIVE_INTERVAL = 24 * 60 * 60 * 1000; // Daily
  private static readonly TREND_ANALYSIS_MONTHS = 12; // Analyze trends over 12 months

  // Archive current month's data
  static async archiveMonthlyData(
    userId: string,
    currentData: {
      budgetPerformance: any;
      spendingTrends: any;
      financialHealth: any;
    }
  ): Promise<boolean> {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const timestamp = Date.now();

      // Archive budget performance
      const budgetPerformance: HistoricalBudgetPerformance = {
        month: currentMonth,
        monthlyBudget: currentData.budgetPerformance.monthlyBudget || 0,
        totalExpenses: currentData.budgetPerformance.totalExpenses || 0,
        totalIncome: currentData.budgetPerformance.totalIncome || 0,
        netBalance: currentData.budgetPerformance.netBalance || 0,
        budgetUsagePercent: currentData.budgetPerformance.budgetUsagePercent || 0,
        savingsRate: currentData.budgetPerformance.savingsRate || 0,
        financialHealthScore: currentData.budgetPerformance.financialHealthScore || 0,
        status: currentData.budgetPerformance.status || 'under-budget',
        categoryBreakdown: currentData.budgetPerformance.categoryBreakdown || {},
        unusualTransactions: currentData.budgetPerformance.unusualTransactions || 0,
        recommendations: currentData.budgetPerformance.recommendations || [],
        timestamp
      };

      // Archive spending trends
      const spendingTrends: HistoricalSpendingTrends = {
        month: currentMonth,
        dailyAverage: currentData.spendingTrends.dailyAverage || 0,
        weeklyAverage: currentData.spendingTrends.weeklyAverage || 0,
        monthlyTotal: currentData.spendingTrends.monthlyTotal || 0,
        topCategories: currentData.spendingTrends.topCategories || [],
        spendingVelocity: currentData.spendingTrends.spendingVelocity || 0,
        seasonalFactor: currentData.spendingTrends.seasonalFactor || 1,
        timestamp
      };

      // Archive financial health
      const financialHealth: HistoricalFinancialHealth = {
        month: currentMonth,
        overallScore: currentData.financialHealth.overallScore || 0,
        savingsScore: currentData.financialHealth.savingsScore || 0,
        budgetScore: currentData.financialHealth.budgetScore || 0,
        incomeStabilityScore: currentData.financialHealth.incomeStabilityScore || 0,
        emergencyFundScore: currentData.financialHealth.emergencyFundScore || 0,
        debtScore: currentData.financialHealth.debtScore || 0,
        cashFlowScore: currentData.financialHealth.cashFlowScore || 0,
        insights: currentData.financialHealth.insights || [],
        timestamp
      };

      // Store in historical archive
      await this.storeHistoricalData(userId, 'budgetPerformance', budgetPerformance);
      await this.storeHistoricalData(userId, 'spendingTrends', spendingTrends);
      await this.storeHistoricalData(userId, 'financialHealth', financialHealth);

      // Update archive metadata
      await this.updateArchiveMetadata(userId, timestamp);

      return true;
    } catch (error) {
      console.error('Failed to archive monthly data:', error);
      return false;
    }
  }

  // Get historical budget performance
  static async getHistoricalBudgetPerformance(
    userId: string,
    months: number = 12
  ): Promise<HistoricalBudgetPerformance[]> {
    try {
      const data = await this.getHistoricalData(userId, 'budgetPerformance');
      if (!data || !Array.isArray(data)) return [];

      // Sort by month (newest first) and limit to requested months
      return data
        .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
        .slice(0, months);
    } catch (error) {
      console.error('Failed to get historical budget performance:', error);
      return [];
    }
  }

  // Get historical spending trends
  static async getHistoricalSpendingTrends(
    userId: string,
    months: number = 12
  ): Promise<HistoricalSpendingTrends[]> {
    try {
      const data = await this.getHistoricalData(userId, 'spendingTrends');
      if (!data || !Array.isArray(data)) return [];

      return data
        .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
        .slice(0, months);
    } catch (error) {
      console.error('Failed to get historical spending trends:', error);
      return [];
    }
  }

  // Get historical financial health
  static async getHistoricalFinancialHealth(
    userId: string,
    months: number = 12
  ): Promise<HistoricalFinancialHealth[]> {
    try {
      const data = await this.getHistoricalData(userId, 'financialHealth');
      if (!data || !Array.isArray(data)) return [];

      return data
        .sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime())
        .slice(0, months);
    } catch (error) {
      console.error('Failed to get historical financial health:', error);
      return [];
    }
  }

  // Generate year-over-year comparison
  static async generateYearOverYearComparison(
    userId: string,
    currentYear: number
  ): Promise<YearOverYearComparison | null> {
    try {
      const budgetPerformance = await this.getHistoricalBudgetPerformance(userId, 24);
      const previousYear = currentYear - 1;

      const currentYearData = budgetPerformance.filter(item => 
        item.month.startsWith(currentYear.toString())
      );
      const previousYearData = budgetPerformance.filter(item => 
        item.month.startsWith(previousYear.toString())
      );

      if (currentYearData.length === 0 || previousYearData.length === 0) {
        return null;
      }

      // Calculate year totals
      const currentYearTotals = this.calculateYearTotals(currentYearData);
      const previousYearTotals = this.calculateYearTotals(previousYearData);

      // Calculate changes
      const incomeChange = currentYearTotals.income - previousYearTotals.income;
      const expenseChange = currentYearTotals.expenses - previousYearTotals.expenses;
      const savingsChange = currentYearTotals.savings - previousYearTotals.savings;

      // Calculate budget adherence changes
      const currentBudgetAdherence = this.calculateBudgetAdherence(currentYearData);
      const previousBudgetAdherence = this.calculateBudgetAdherence(previousYearData);
      const budgetAdherenceChange = currentBudgetAdherence - previousBudgetAdherence;

      // Analyze top spending changes
      const topSpendingChanges = this.analyzeTopSpendingChanges(
        currentYearData,
        previousYearData
      );

      // Analyze seasonal patterns
      const seasonalPatterns = this.analyzeSeasonalPatterns(budgetPerformance);

      return {
        currentYear,
        previousYear,
        incomeChange,
        expenseChange,
        savingsChange,
        budgetAdherenceChange,
        topSpendingChanges,
        seasonalPatterns
      };
    } catch (error) {
      console.error('Failed to generate year-over-year comparison:', error);
      return null;
    }
  }

  // Generate long-term trends analysis
  static async generateLongTermTrends(
    userId: string,
    months: number = 24
  ): Promise<{
    spendingTrends: { trend: 'increasing' | 'decreasing' | 'stable'; rate: number };
    budgetAdherenceTrends: { trend: 'improving' | 'declining' | 'stable'; rate: number };
    savingsTrends: { trend: 'increasing' | 'decreasing' | 'stable'; rate: number };
    seasonalPatterns: { month: string; factor: number }[];
    predictions: { nextMonth: number; confidence: number };
  }> {
    try {
      const budgetPerformance = await this.getHistoricalBudgetPerformance(userId, months);
      const spendingTrends = await this.getHistoricalSpendingTrends(userId, months);

      if (budgetPerformance.length < 6) {
        return {
          spendingTrends: { trend: 'stable', rate: 0 },
          budgetAdherenceTrends: { trend: 'stable', rate: 0 },
          savingsTrends: { trend: 'stable', rate: 0 },
          seasonalPatterns: [],
          predictions: { nextMonth: 0, confidence: 0 }
        };
      }

      // Analyze spending trends
      const spendingTrend = this.analyzeTrend(
        budgetPerformance.map(item => item.totalExpenses)
      );

      // Analyze budget adherence trends
      const budgetAdherenceTrend = this.analyzeBudgetAdherenceTrend(
        budgetPerformance.map(item => 100 - item.budgetUsagePercent)
      );

      // Analyze savings trends
      const savingsTrend = this.analyzeTrend(
        budgetPerformance.map(item => item.savingsRate)
      );

      // Analyze seasonal patterns
      const seasonalPatterns = this.analyzeSeasonalPatterns(budgetPerformance);

      // Generate predictions
      const predictions = this.generatePredictions(budgetPerformance, spendingTrends);

      return {
        spendingTrends: spendingTrend,
        budgetAdherenceTrends: budgetAdherenceTrend,
        savingsTrends: savingsTrend,
        seasonalPatterns,
        predictions
      };
    } catch (error) {
      console.error('Failed to generate long-term trends:', error);
      return {
        spendingTrends: { trend: 'stable', rate: 0 },
        budgetAdherenceTrends: { trend: 'stable', rate: 0 },
        savingsTrends: { trend: 'stable', rate: 0 },
        seasonalPatterns: [],
        predictions: { nextMonth: 0, confidence: 0 }
      };
    }
  }

  // Clean old historical data (disabled - data is retained forever)
  static async cleanOldHistoricalData(userId: string): Promise<boolean> {
    try {
      // Data retention is set to Infinity, so no cleaning is performed
      // All historical data is preserved indefinitely
      console.log(`Historical data cleaning skipped for user ${userId} - data retention is set to forever`);
      return true;
    } catch (error) {
      console.error('Failed to process historical data cleaning:', error);
      return false;
    }
  }

  // Private helper methods
  private static async storeHistoricalData(
    userId: string,
    dataType: string,
    data: any
  ): Promise<boolean> {
    try {
      const key = `user:${userId}:historical:${dataType}`;
      const timestamp = Date.now();
      
      // Get existing data
      const existingData = await this.getHistoricalData(userId, dataType);
      const updatedData = Array.isArray(existingData) ? [...existingData, data] : [data];
      
      // Store in localStorage for now (can be enhanced with Redis later)
      localStorage.setItem(key, JSON.stringify({
        data: updatedData,
        timestamp,
        version: '1.0.0'
      }));

      return true;
    } catch (error) {
      console.error('Failed to store historical data:', error);
      return false;
    }
  }

  private static async getHistoricalData(
    userId: string,
    dataType: string
  ): Promise<any> {
    try {
      const key = `user:${userId}:historical:${dataType}`;
      const stored = localStorage.getItem(key);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.data || [];
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get historical data:', error);
      return [];
    }
  }

  private static async updateArchiveMetadata(userId: string, timestamp: number): Promise<void> {
    try {
      const metadata = {
        lastUpdated: timestamp,
        dataRetentionDays: this.DATA_RETENTION_DAYS,
        version: '1.0.0'
      };
      
      localStorage.setItem(`user:${userId}:historical:metadata`, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to update archive metadata:', error);
    }
  }

  private static calculateYearTotals(data: HistoricalBudgetPerformance[]): {
    income: number;
    expenses: number;
    savings: number;
  } {
    return data.reduce(
      (totals, item) => ({
        income: totals.income + item.totalIncome,
        expenses: totals.expenses + item.totalExpenses,
        savings: totals.savings + item.netBalance
      }),
      { income: 0, expenses: 0, savings: 0 }
    );
  }

  private static calculateBudgetAdherence(data: HistoricalBudgetPerformance[]): number {
    const totalBudget = data.reduce((sum, item) => sum + item.monthlyBudget, 0);
    const totalSpent = data.reduce((sum, item) => sum + item.totalExpenses, 0);
    
    if (totalBudget === 0) return 0;
    return ((totalBudget - totalSpent) / totalBudget) * 100;
  }

  private static analyzeTopSpendingChanges(
    currentYearData: HistoricalBudgetPerformance[],
    previousYearData: HistoricalBudgetPerformance[]
  ): { category: string; change: number; percentage: number }[] {
    // Aggregate spending by category for both years
    const currentYearCategories: { [key: string]: number } = {};
    const previousYearCategories: { [key: string]: number } = {};

    currentYearData.forEach(item => {
      Object.entries(item.categoryBreakdown).forEach(([category, amount]) => {
        currentYearCategories[category] = (currentYearCategories[category] || 0) + amount;
      });
    });

    previousYearData.forEach(item => {
      Object.entries(item.categoryBreakdown).forEach(([category, amount]) => {
        previousYearCategories[category] = (previousYearCategories[category] || 0) + amount;
      });
    });

    // Calculate changes
    const allCategories = new Set([
      ...Object.keys(currentYearCategories),
      ...Object.keys(previousYearCategories)
    ]);

    return Array.from(allCategories)
      .map(category => {
        const current = currentYearCategories[category] || 0;
        const previous = previousYearCategories[category] || 0;
        const change = current - previous;
        const percentage = previous > 0 ? (change / previous) * 100 : 0;

        return { category, change, percentage };
      })
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
      .slice(0, 5);
  }

  private static analyzeSeasonalPatterns(data: HistoricalBudgetPerformance[]): { month: string; factor: number }[] {
    const monthlyAverages: { [key: number]: number[] } = {};
    
    data.forEach(item => {
      const month = parseInt(item.month.split('-')[1]) - 1; // Convert to 0-based month index
      if (!monthlyAverages[month]) monthlyAverages[month] = [];
      monthlyAverages[month].push(item.totalExpenses);
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return monthNames.map((monthName, monthIndex) => {
      const amounts = monthlyAverages[monthIndex] || [];
      const average = amounts.length > 0 ? amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length : 0;
      
      // Calculate seasonal factor (ratio to overall average)
      const overallAverage = data.reduce((sum, item) => sum + item.totalExpenses, 0) / data.length;
      const factor = overallAverage > 0 ? average / overallAverage : 1;
      
      return { month: monthName, factor };
    });
  }

  private static analyzeTrend(values: number[]): { trend: 'increasing' | 'decreasing' | 'stable'; rate: number } {
    if (values.length < 4) {
      return { trend: 'stable', rate: 0 };
    }

    // Split data into two halves
    const midPoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midPoint);
    const secondHalf = values.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, value) => sum + value, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, value) => sum + value, 0) / secondHalf.length;

    if (firstHalfAvg === 0) {
      return { trend: 'stable', rate: 0 };
    }

    const changeRate = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

    if (changeRate > 5) return { trend: 'increasing', rate: changeRate };
    if (changeRate < -5) return { trend: 'decreasing', rate: changeRate };
    return { trend: 'stable', rate: changeRate };
  }

  private static analyzeBudgetAdherenceTrend(values: number[]): { trend: 'improving' | 'declining' | 'stable'; rate: number } {
    if (values.length < 4) {
      return { trend: 'stable', rate: 0 };
    }

    // Split data into two halves
    const midPoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midPoint);
    const secondHalf = values.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, value) => sum + value, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, value) => sum + value, 0) / secondHalf.length;

    if (firstHalfAvg === 0) {
      return { trend: 'stable', rate: 0 };
    }

    const changeRate = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

    if (changeRate > 5) return { trend: 'improving', rate: changeRate };
    if (changeRate < -5) return { trend: 'declining', rate: changeRate };
    return { trend: 'stable', rate: changeRate };
  }

  private static generatePredictions(
    budgetPerformance: HistoricalBudgetPerformance[],
    spendingTrends: HistoricalSpendingTrends[]
  ): { nextMonth: number; confidence: number } {
    if (budgetPerformance.length < 3) {
      return { nextMonth: 0, confidence: 0 };
    }

    // Simple linear regression for prediction
    const recentExpenses = budgetPerformance
      .slice(-6)
      .map((item, index) => ({ x: index, y: item.totalExpenses }));

    const n = recentExpenses.length;
    const sumX = recentExpenses.reduce((sum, item) => sum + item.x, 0);
    const sumY = recentExpenses.reduce((sum, item) => sum + item.y, 0);
    const sumXY = recentExpenses.reduce((sum, item) => sum + item.x * item.y, 0);
    const sumXX = recentExpenses.reduce((sum, item) => sum + item.x * item.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const nextMonth = slope * n + intercept;
    const confidence = Math.max(0, Math.min(100, 100 - Math.abs(slope) * 10));

    return { nextMonth: Math.max(0, nextMonth), confidence };
  }
}

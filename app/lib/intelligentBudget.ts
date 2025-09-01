// Intelligent Budget Forecasting System
// Provides adaptive budget recommendations based on user spending patterns

export interface BudgetSettings {
  monthlyBudget: number;
  categoryBudgets: { [key: string]: number };
  autoAdjust: boolean;
  learningEnabled: boolean;
  emergencyBuffer: number; // percentage
  savingsTarget: number; // percentage
}

export interface SpendingPattern {
  category: string;
  averageAmount: number;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  seasonality: number; // seasonal factor
  volatility: number; // spending volatility
}

export interface BudgetForecast {
  recommendedBudget: number;
  confidence: number; // 0-100
  reasoning: string[];
  categoryRecommendations: { [key: string]: number };
  riskFactors: string[];
  opportunities: string[];
  nextMonthPrediction: number;
  seasonalAdjustments: { [key: string]: number };
}

export interface Transaction {
  id: number;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export class IntelligentBudget {
  private transactions: Transaction[] = [];
  private settings: BudgetSettings;

  constructor(transactions: Transaction[], settings?: Partial<BudgetSettings>) {
    this.transactions = transactions;
    this.settings = {
      monthlyBudget: 50000,
      categoryBudgets: {},
      autoAdjust: true,
      learningEnabled: true,
      emergencyBuffer: 10, // 10% buffer
      savingsTarget: 20, // 20% savings target
      ...settings
    };
  }

  // Analyze spending patterns
  private analyzeSpendingPatterns(): SpendingPattern[] {
    const expenses = this.transactions.filter(t => t.type === 'expense');
    const patterns: { [key: string]: any } = {};

    // Group by category
    expenses.forEach(transaction => {
      const category = transaction.category;
      if (!patterns[category]) {
        patterns[category] = {
          amounts: [],
          dates: [],
          count: 0
        };
      }
      patterns[category].amounts.push(transaction.amount);
      patterns[category].dates.push(new Date(transaction.date));
      patterns[category].count++;
    });

    // Calculate patterns for each category
    return Object.entries(patterns).map(([category, data]) => {
      const amounts = data.amounts;
      const dates = data.dates;
      
      // Basic statistics
      const averageAmount = amounts.reduce((sum: number, amount: number) => sum + amount, 0) / amounts.length;
      const variance = amounts.reduce((sum: number, amount: number) => sum + Math.pow(amount - averageAmount, 2), 0) / amounts.length;
      const volatility = Math.sqrt(variance) / averageAmount;

      // Frequency analysis
      const frequency = this.calculateFrequency(dates);

      // Trend analysis
      const trend = this.calculateTrend(amounts, dates);

      // Seasonality analysis
      const seasonality = this.calculateSeasonality(dates, amounts);

      return {
        category,
        averageAmount,
        frequency,
        trend,
        seasonality,
        volatility
      };
    });
  }

  // Calculate spending frequency
  private calculateFrequency(dates: Date[]): number {
    if (dates.length < 2) return 1;
    
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    const timeSpan = sortedDates[sortedDates.length - 1].getTime() - sortedDates[0].getTime();
    const daysSpan = timeSpan / (1000 * 60 * 60 * 24);
    
    return dates.length / (daysSpan / 30); // transactions per month
  }

  // Calculate spending trend
  private calculateTrend(amounts: number[], dates: Date[]): 'increasing' | 'decreasing' | 'stable' {
    if (amounts.length < 4) return 'stable';

    // Split data into two halves
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

  // Calculate seasonality
  private calculateSeasonality(dates: Date[], amounts: number[]): number {
    if (dates.length < 12) return 1; // Need at least a year of data

    const monthlyAverages: { [key: number]: number[] } = {};
    
    dates.forEach((date, index) => {
      const month = date.getMonth();
      if (!monthlyAverages[month]) monthlyAverages[month] = [];
      monthlyAverages[month].push(amounts[index]);
    });

    const overallAverage = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const seasonalFactors: number[] = [];

    for (let month = 0; month < 12; month++) {
      if (monthlyAverages[month] && monthlyAverages[month].length > 0) {
        const monthAverage = monthlyAverages[month].reduce((sum, amount) => sum + amount, 0) / monthlyAverages[month].length;
        seasonalFactors.push(monthAverage / overallAverage);
      } else {
        seasonalFactors.push(1);
      }
    }

    // Return the seasonal factor for the next month
    const nextMonth = new Date().getMonth();
    return seasonalFactors[nextMonth] || 1;
  }

  // Generate intelligent budget forecast
  public generateForecast(): BudgetForecast {
    const patterns = this.analyzeSpendingPatterns();
    const currentMonth = new Date().getMonth();
    const nextMonth = (currentMonth + 1) % 12;

    // Calculate base spending prediction
    let baseSpending = 0;
    const categoryRecommendations: { [key: string]: number } = {};
    const seasonalAdjustments: { [key: string]: number } = {};

    patterns.forEach(pattern => {
      // Apply seasonal adjustments
      const seasonalFactor = pattern.seasonality;
      const adjustedAmount = pattern.averageAmount * pattern.frequency * seasonalFactor;
      
      categoryRecommendations[pattern.category] = Math.round(adjustedAmount);
      seasonalAdjustments[pattern.category] = seasonalFactor;
      baseSpending += adjustedAmount;
    });

    // Calculate recommended budget with buffer
    const bufferAmount = baseSpending * (this.settings.emergencyBuffer / 100);
    const recommendedBudget = Math.round(baseSpending + bufferAmount);

    // Calculate confidence based on data quality
    const confidence = this.calculateConfidence(patterns);

    // Generate reasoning
    const reasoning: string[] = [];
    if (patterns.length > 0) {
      reasoning.push(`Based on ${this.transactions.length} transactions across ${patterns.length} categories`);
      
      const totalSpending = patterns.reduce((sum, p) => sum + p.averageAmount * p.frequency, 0);
      reasoning.push(`Average monthly spending: ₱${totalSpending.toLocaleString()}`);
      
      if (this.settings.emergencyBuffer > 0) {
        reasoning.push(`Added ${this.settings.emergencyBuffer}% emergency buffer`);
      }
    }

    // Identify risk factors
    const riskFactors: string[] = [];
    patterns.forEach(pattern => {
      if (pattern.trend === 'increasing' && pattern.volatility > 0.5) {
        riskFactors.push(`${pattern.category} spending is increasing rapidly`);
      }
      if (pattern.volatility > 1) {
        riskFactors.push(`${pattern.category} has high spending volatility`);
      }
    });

    // Identify opportunities
    const opportunities: string[] = [];
    patterns.forEach(pattern => {
      if (pattern.trend === 'decreasing') {
        opportunities.push(`${pattern.category} spending is decreasing - good trend`);
      }
      if (pattern.volatility < 0.3) {
        opportunities.push(`${pattern.category} has stable spending patterns`);
      }
    });

    // Next month prediction
    const nextMonthPrediction = Math.round(baseSpending * (1 + (this.settings.emergencyBuffer / 100)));

    return {
      recommendedBudget,
      confidence,
      reasoning,
      categoryRecommendations,
      riskFactors,
      opportunities,
      nextMonthPrediction,
      seasonalAdjustments
    };
  }

  // Calculate confidence in the forecast
  private calculateConfidence(patterns: SpendingPattern[]): number {
    if (patterns.length === 0) return 0;

    let confidence = 50; // Base confidence

    // More data = higher confidence
    if (this.transactions.length > 100) confidence += 20;
    else if (this.transactions.length > 50) confidence += 10;
    else if (this.transactions.length < 10) confidence -= 20;

    // More categories = higher confidence
    if (patterns.length > 5) confidence += 10;
    else if (patterns.length < 3) confidence -= 10;

    // Lower volatility = higher confidence
    const avgVolatility = patterns.reduce((sum, p) => sum + p.volatility, 0) / patterns.length;
    if (avgVolatility < 0.3) confidence += 15;
    else if (avgVolatility > 0.8) confidence -= 15;

    // Stable trends = higher confidence
    const stableTrends = patterns.filter(p => p.trend === 'stable').length;
    const stabilityRatio = stableTrends / patterns.length;
    confidence += stabilityRatio * 10;

    return Math.max(0, Math.min(100, confidence));
  }

  // Update budget settings
  public updateSettings(newSettings: Partial<BudgetSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  // Get current settings
  public getSettings(): BudgetSettings {
    return { ...this.settings };
  }

  // Learn from new transactions
  public learnFromTransactions(newTransactions: Transaction[]): void {
    if (!this.settings.learningEnabled) return;

    this.transactions = [...this.transactions, ...newTransactions];
    
    // Auto-adjust budget if enabled
    if (this.settings.autoAdjust) {
      const forecast = this.generateForecast();
      this.settings.monthlyBudget = forecast.recommendedBudget;
    }
  }

  // Get spending insights
  public getSpendingInsights(): {
    topCategories: { category: string; amount: number; percentage: number }[];
    unusualSpending: Transaction[];
    spendingTrends: { category: string; trend: string; change: number }[];
  } {
    const patterns = this.analyzeSpendingPatterns();
    const totalSpending = patterns.reduce((sum, p) => sum + p.averageAmount * p.frequency, 0);

    // Top spending categories
    const topCategories = patterns
      .map(p => ({
        category: p.category,
        amount: p.averageAmount * p.frequency,
        percentage: ((p.averageAmount * p.frequency) / totalSpending) * 100
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Unusual spending (transactions > 2x average for category)
    const unusualSpending: Transaction[] = [];
    patterns.forEach(pattern => {
      const threshold = pattern.averageAmount * 2;
      const categoryTransactions = this.transactions.filter(t => 
        t.type === 'expense' && t.category === pattern.category && t.amount > threshold
      );
      unusualSpending.push(...categoryTransactions);
    });

    // Spending trends
    const spendingTrends = patterns.map(pattern => ({
      category: pattern.category,
      trend: pattern.trend,
      change: pattern.trend === 'increasing' ? 15 : pattern.trend === 'decreasing' ? -15 : 0
    }));

    return {
      topCategories,
      unusualSpending,
      spendingTrends
    };
  }

  // Suggest budget optimizations
  public suggestOptimizations(): {
    recommendations: string[];
    potentialSavings: number;
    priorityActions: string[];
  } {
    const patterns = this.analyzeSpendingPatterns();
    const insights = this.getSpendingInsights();
    
    const recommendations: string[] = [];
    let potentialSavings = 0;
    const priorityActions: string[] = [];

    // Analyze high-spending categories
    insights.topCategories.forEach(category => {
      if (category.percentage > 30) {
        recommendations.push(`Consider reducing ${category.category} spending (${category.percentage.toFixed(1)}% of total)`);
        potentialSavings += category.amount * 0.2; // 20% reduction potential
        priorityActions.push(`Review ${category.category} expenses`);
      }
    });

    // Analyze increasing trends
    patterns.forEach(pattern => {
      if (pattern.trend === 'increasing' && pattern.averageAmount * pattern.frequency > 5000) {
        recommendations.push(`Monitor ${pattern.category} - spending is increasing`);
        priorityActions.push(`Set budget limit for ${pattern.category}`);
      }
    });

    // Analyze high volatility
    patterns.forEach(pattern => {
      if (pattern.volatility > 0.8) {
        recommendations.push(`${pattern.category} has high spending volatility - consider setting limits`);
      }
    });

    return {
      recommendations,
      potentialSavings: Math.round(potentialSavings),
      priorityActions
    };
  }
}

// Export default instance
export default IntelligentBudget;

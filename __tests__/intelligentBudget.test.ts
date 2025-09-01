import { IntelligentBudget, BudgetSettings, Transaction } from '@/app/lib/intelligentBudget';

// Mock data for testing
const mockTransactions: Transaction[] = [
  {
    id: 1,
    amount: 5000,
    description: 'Salary',
    category: 'Income',
    date: '2024-01-01',
    type: 'income'
  },
  {
    id: 2,
    amount: 1000,
    description: 'Grocery shopping',
    category: 'Food',
    date: '2024-01-02',
    type: 'expense'
  },
  {
    id: 3,
    amount: 2000,
    description: 'Rent',
    category: 'Housing',
    date: '2024-01-03',
    type: 'expense'
  },
  {
    id: 4,
    amount: 500,
    description: 'Transportation',
    category: 'Transport',
    date: '2024-01-04',
    type: 'expense'
  },
  {
    id: 5,
    amount: 3000,
    description: 'Freelance work',
    category: 'Income',
    date: '2024-01-05',
    type: 'income'
  }
];

const mockSettings: BudgetSettings = {
  monthlyBudget: 50000,
  categoryBudgets: {},
  autoAdjust: true,
  learningEnabled: true,
  emergencyBuffer: 10,
  savingsTarget: 20
};

describe('IntelligentBudget', () => {
  let intelligentBudget: IntelligentBudget;

  beforeEach(() => {
    intelligentBudget = new IntelligentBudget(mockTransactions, mockSettings);
  });

  describe('Constructor', () => {
    test('should initialize with default settings when no settings provided', () => {
      const budget = new IntelligentBudget(mockTransactions);
      const settings = budget.getSettings();
      
      expect(settings.monthlyBudget).toBe(50000);
      expect(settings.autoAdjust).toBe(true);
      expect(settings.learningEnabled).toBe(true);
      expect(settings.emergencyBuffer).toBe(10);
      expect(settings.savingsTarget).toBe(20);
    });

    test('should initialize with custom settings', () => {
      const customSettings: BudgetSettings = {
        monthlyBudget: 75000,
        categoryBudgets: { 'Food': 5000 },
        autoAdjust: false,
        learningEnabled: false,
        emergencyBuffer: 15,
        savingsTarget: 25
      };
      
      const budget = new IntelligentBudget(mockTransactions, customSettings);
      const settings = budget.getSettings();
      
      expect(settings.monthlyBudget).toBe(75000);
      expect(settings.autoAdjust).toBe(false);
      expect(settings.learningEnabled).toBe(false);
      expect(settings.emergencyBuffer).toBe(15);
      expect(settings.savingsTarget).toBe(25);
    });

    test('should handle empty transactions array', () => {
      const budget = new IntelligentBudget([], mockSettings);
      const settings = budget.getSettings();
      
      expect(settings.monthlyBudget).toBe(50000);
    });
  });

  describe('generateForecast', () => {
    test('should generate forecast with valid data', () => {
      const forecast = intelligentBudget.generateForecast();
      
      expect(forecast).toHaveProperty('recommendedBudget');
      expect(forecast).toHaveProperty('confidence');
      expect(forecast).toHaveProperty('reasoning');
      expect(forecast).toHaveProperty('categoryRecommendations');
      expect(forecast).toHaveProperty('riskFactors');
      expect(forecast).toHaveProperty('opportunities');
      expect(forecast).toHaveProperty('nextMonthPrediction');
      expect(forecast).toHaveProperty('seasonalAdjustments');
      
      expect(typeof forecast.recommendedBudget).toBe('number');
      expect(typeof forecast.confidence).toBe('number');
      expect(Array.isArray(forecast.reasoning)).toBe(true);
      expect(typeof forecast.categoryRecommendations).toBe('object');
      expect(Array.isArray(forecast.riskFactors)).toBe(true);
      expect(Array.isArray(forecast.opportunities)).toBe(true);
      expect(typeof forecast.nextMonthPrediction).toBe('number');
      expect(typeof forecast.seasonalAdjustments).toBe('object');
    });

    test('should handle empty transactions', () => {
      const budget = new IntelligentBudget([], mockSettings);
      const forecast = budget.generateForecast();
      
      expect(forecast.confidence).toBe(0);
      expect(forecast.reasoning).toHaveLength(0);
    });

    test('should calculate confidence based on data quality', () => {
      // Test with minimal data
      const minimalTransactions = mockTransactions.slice(0, 2);
      const budget = new IntelligentBudget(minimalTransactions, mockSettings);
      const forecast = budget.generateForecast();
      
      expect(forecast.confidence).toBeLessThan(50); // Low confidence with minimal data
    });

    test('should include emergency buffer in recommended budget', () => {
      const forecast = intelligentBudget.generateForecast();
      const baseSpending = Object.values(forecast.categoryRecommendations).reduce((sum: number, amount: number) => sum + amount, 0);
      const expectedBuffer = baseSpending * (mockSettings.emergencyBuffer / 100);
      
      expect(forecast.recommendedBudget).toBeGreaterThanOrEqual(baseSpending + expectedBuffer);
    });
  });

  describe('getSpendingInsights', () => {
    test('should return spending insights', () => {
      const insights = intelligentBudget.getSpendingInsights();
      
      expect(insights).toHaveProperty('topCategories');
      expect(insights).toHaveProperty('unusualSpending');
      expect(insights).toHaveProperty('spendingTrends');
      
      expect(Array.isArray(insights.topCategories)).toBe(true);
      expect(Array.isArray(insights.unusualSpending)).toBe(true);
      expect(Array.isArray(insights.spendingTrends)).toBe(true);
    });

    test('should identify top spending categories', () => {
      const insights = intelligentBudget.getSpendingInsights();
      
      if (insights.topCategories.length > 0) {
        const topCategory = insights.topCategories[0];
        expect(topCategory).toHaveProperty('category');
        expect(topCategory).toHaveProperty('amount');
        expect(topCategory).toHaveProperty('percentage');
        expect(typeof topCategory.amount).toBe('number');
        expect(typeof topCategory.percentage).toBe('number');
      }
    });

    test('should detect unusual spending', () => {
      // Add a transaction that's much larger than average
      const largeTransaction: Transaction = {
        id: 6,
        amount: 15000, // Much larger than average to trigger unusual spending detection
        description: 'Large purchase',
        category: 'Shopping',
        date: '2024-01-06',
        type: 'expense'
      };
      
      const budgetWithLargeTransaction = new IntelligentBudget([...mockTransactions, largeTransaction], mockSettings);
      const insights = budgetWithLargeTransaction.getSpendingInsights();
      
      expect(insights.unusualSpending.length).toBeGreaterThan(0);
    });
  });

  describe('suggestOptimizations', () => {
    test('should return optimization suggestions', () => {
      const optimizations = intelligentBudget.suggestOptimizations();
      
      expect(optimizations).toHaveProperty('recommendations');
      expect(optimizations).toHaveProperty('potentialSavings');
      expect(optimizations).toHaveProperty('priorityActions');
      
      expect(Array.isArray(optimizations.recommendations)).toBe(true);
      expect(typeof optimizations.potentialSavings).toBe('number');
      expect(Array.isArray(optimizations.priorityActions)).toBe(true);
    });

    test('should calculate potential savings', () => {
      const optimizations = intelligentBudget.suggestOptimizations();
      
      expect(optimizations.potentialSavings).toBeGreaterThanOrEqual(0);
    });
  });

  describe('updateSettings', () => {
    test('should update settings correctly', () => {
      const newSettings = {
        monthlyBudget: 60000,
        emergencyBuffer: 15
      };
      
      intelligentBudget.updateSettings(newSettings);
      const updatedSettings = intelligentBudget.getSettings();
      
      expect(updatedSettings.monthlyBudget).toBe(60000);
      expect(updatedSettings.emergencyBuffer).toBe(15);
      expect(updatedSettings.autoAdjust).toBe(true); // Should remain unchanged
    });

    test('should handle partial settings update', () => {
      const originalSettings = intelligentBudget.getSettings();
      const newSettings = { monthlyBudget: 70000 };
      
      intelligentBudget.updateSettings(newSettings);
      const updatedSettings = intelligentBudget.getSettings();
      
      expect(updatedSettings.monthlyBudget).toBe(70000);
      expect(updatedSettings.emergencyBuffer).toBe(originalSettings.emergencyBuffer);
      expect(updatedSettings.autoAdjust).toBe(originalSettings.autoAdjust);
    });
  });

  describe('learnFromTransactions', () => {
    test('should learn from new transactions when learning is enabled', () => {
      const newTransactions: Transaction[] = [
        {
          id: 7,
          amount: 1500,
          description: 'New expense',
          category: 'Food',
          date: '2024-01-07',
          type: 'expense'
        }
      ];
      
      const originalForecast = intelligentBudget.generateForecast();
      intelligentBudget.learnFromTransactions(newTransactions);
      const updatedForecast = intelligentBudget.generateForecast();
      
      // Forecast should change after learning
      expect(updatedForecast.recommendedBudget).not.toBe(originalForecast.recommendedBudget);
    });

    test('should not learn when learning is disabled', () => {
      const budget = new IntelligentBudget(mockTransactions, { ...mockSettings, learningEnabled: false });
      const originalForecast = budget.generateForecast();
      
      const newTransactions: Transaction[] = [
        {
          id: 8,
          amount: 2000,
          description: 'New expense',
          category: 'Food',
          date: '2024-01-08',
          type: 'expense'
        }
      ];
      
      budget.learnFromTransactions(newTransactions);
      const updatedForecast = budget.generateForecast();
      
      // Forecast should remain the same
      expect(updatedForecast.recommendedBudget).toBe(originalForecast.recommendedBudget);
    });

    test('should auto-adjust budget when enabled', () => {
      const budget = new IntelligentBudget(mockTransactions, { ...mockSettings, autoAdjust: true });
      const originalSettings = budget.getSettings();
      
      const newTransactions: Transaction[] = [
        {
          id: 9,
          amount: 3000,
          description: 'Large expense',
          category: 'Housing',
          date: '2024-01-09',
          type: 'expense'
        }
      ];
      
      budget.learnFromTransactions(newTransactions);
      const updatedSettings = budget.getSettings();
      
      // Budget should be auto-adjusted
      expect(updatedSettings.monthlyBudget).not.toBe(originalSettings.monthlyBudget);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle transactions with invalid amounts', () => {
      const invalidTransactions: Transaction[] = [
        {
          id: 10,
          amount: -1000, // Negative amount
          description: 'Invalid transaction',
          category: 'Other',
          date: '2024-01-10',
          type: 'expense'
        },
        {
          id: 11,
          amount: 0, // Zero amount
          description: 'Zero transaction',
          category: 'Other',
          date: '2024-01-11',
          type: 'income'
        }
      ];
      
      const budget = new IntelligentBudget(invalidTransactions, mockSettings);
      const forecast = budget.generateForecast();
      
      // Should still generate a forecast without crashing
      expect(forecast).toBeDefined();
      expect(typeof forecast.recommendedBudget).toBe('number');
    });

    test('should handle transactions with missing dates', () => {
      const transactionsWithMissingDates: Transaction[] = [
        {
          id: 12,
          amount: 1000,
          description: 'Transaction without date',
          category: 'Food',
          date: '', // Empty date
          type: 'expense'
        }
      ];
      
      const budget = new IntelligentBudget(transactionsWithMissingDates, mockSettings);
      const forecast = budget.generateForecast();
      
      // Should handle gracefully
      expect(forecast).toBeDefined();
    });

    test('should handle very large numbers', () => {
      const largeTransactions: Transaction[] = [
        {
          id: 13,
          amount: 999999999,
          description: 'Very large transaction',
          category: 'Expense',
          date: '2024-01-12',
          type: 'expense'
        }
      ];
      
      const budget = new IntelligentBudget(largeTransactions, mockSettings);
      const forecast = budget.generateForecast();
      
      // Should handle large numbers without overflow
      expect(forecast.recommendedBudget).toBeGreaterThan(0);
      expect(isFinite(forecast.recommendedBudget)).toBe(true);
    });

    test('should handle empty category names', () => {
      const transactionsWithEmptyCategories: Transaction[] = [
        {
          id: 14,
          amount: 1000,
          description: 'Transaction with empty category',
          category: '',
          date: '2024-01-13',
          type: 'expense'
        }
      ];
      
      const budget = new IntelligentBudget(transactionsWithEmptyCategories, mockSettings);
      const insights = budget.getSpendingInsights();
      
      // Should handle empty categories gracefully
      expect(insights).toBeDefined();
      expect(Array.isArray(insights.topCategories)).toBe(true);
    });
  });

  describe('Performance Tests', () => {
    test('should handle large number of transactions efficiently', () => {
      const largeTransactionSet: Transaction[] = [];
      
      // Generate 1000 transactions
      for (let i = 0; i < 1000; i++) {
        largeTransactionSet.push({
          id: i,
          amount: Math.random() * 10000,
          description: `Transaction ${i}`,
          category: ['Food', 'Transport', 'Housing', 'Entertainment'][Math.floor(Math.random() * 4)],
          date: new Date(2024, 0, Math.floor(Math.random() * 365) + 1).toISOString().split('T')[0],
          type: Math.random() > 0.7 ? 'income' : 'expense'
        });
      }
      
      const startTime = Date.now();
      const budget = new IntelligentBudget(largeTransactionSet, mockSettings);
      const forecast = budget.generateForecast();
      const endTime = Date.now();
      
      // Should complete within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
      expect(forecast).toBeDefined();
    });
  });
});

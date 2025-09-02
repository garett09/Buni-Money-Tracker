import { HistoricalDataManager, HistoricalBudgetPerformance, HistoricalSpendingTrends, HistoricalFinancialHealth } from '../app/lib/historicalData';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('HistoricalDataManager', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
  });

  describe('archiveMonthlyData', () => {
    it('should archive monthly data successfully', async () => {
      const userId = 'test-user';
      const currentData = {
        budgetPerformance: {
          monthlyBudget: 50000,
          totalExpenses: 35000,
          totalIncome: 60000,
          netBalance: 25000,
          budgetUsagePercent: 70,
          savingsRate: 41.7,
          financialHealthScore: 85,
          status: 'under-budget',
          categoryBreakdown: { 'Food': 10000, 'Transport': 8000 },
          unusualTransactions: 2,
          recommendations: ['Great job staying under budget']
        },
        spendingTrends: {
          dailyAverage: 1167,
          weeklyAverage: 8167,
          monthlyTotal: 35000,
          topCategories: [{ category: 'Food', amount: 10000 }],
          spendingVelocity: 1167,
          seasonalFactor: 1
        },
        financialHealth: {
          overallScore: 85,
          savingsScore: 41.7,
          budgetScore: 30,
          incomeStabilityScore: 20,
          emergencyFundScore: 15,
          debtScore: 10,
          cashFlowScore: 20,
          insights: ['Excellent financial health']
        }
      };

      const result = await HistoricalDataManager.archiveMonthlyData(userId, currentData);
      expect(result).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const result = await HistoricalDataManager.archiveMonthlyData('test-user', {});
      expect(result).toBe(false);
    });
  });

  describe('getHistoricalBudgetPerformance', () => {
    it('should return empty array when no data exists', async () => {
      const result = await HistoricalDataManager.getHistoricalBudgetPerformance('test-user', 12);
      expect(result).toEqual([]);
    });

    it('should return historical data when available', async () => {
      const mockData = [
        {
          month: '2024-01',
          monthlyBudget: 50000,
          totalExpenses: 35000,
          totalIncome: 60000,
          netBalance: 25000,
          budgetUsagePercent: 70,
          savingsRate: 41.7,
          financialHealthScore: 85,
          status: 'under-budget',
          categoryBreakdown: { 'Food': 10000 },
          unusualTransactions: 2,
          recommendations: [],
          timestamp: Date.now()
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.getHistoricalBudgetPerformance('test-user', 12);
      expect(result).toHaveLength(1);
      expect(result[0].month).toBe('2024-01');
    });
  });

  describe('getHistoricalSpendingTrends', () => {
    it('should return empty array when no data exists', async () => {
      const result = await HistoricalDataManager.getHistoricalSpendingTrends('test-user', 12);
      expect(result).toEqual([]);
    });

    it('should return spending trends when available', async () => {
      const mockData = [
        {
          month: '2024-01',
          dailyAverage: 1167,
          weeklyAverage: 8167,
          monthlyTotal: 35000,
          topCategories: [{ category: 'Food', amount: 10000 }],
          spendingVelocity: 1167,
          seasonalFactor: 1,
          timestamp: Date.now()
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.getHistoricalSpendingTrends('test-user', 12);
      expect(result).toHaveLength(1);
      expect(result[0].month).toBe('2024-01');
    });
  });

  describe('getHistoricalFinancialHealth', () => {
    it('should return empty array when no data exists', async () => {
      const result = await HistoricalDataManager.getHistoricalFinancialHealth('test-user', 12);
      expect(result).toEqual([]);
    });

    it('should return financial health data when available', async () => {
      const mockData = [
        {
          month: '2024-01',
          overallScore: 85,
          savingsScore: 41.7,
          budgetScore: 30,
          incomeStabilityScore: 20,
          emergencyFundScore: 15,
          debtScore: 10,
          cashFlowScore: 20,
          insights: ['Excellent financial health'],
          timestamp: Date.now()
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.getHistoricalFinancialHealth('test-user', 12);
      expect(result).toHaveLength(1);
      expect(result[0].month).toBe('2024-01');
    });
  });

  describe('generateYearOverYearComparison', () => {
    it('should return null when insufficient data exists', async () => {
      const result = await HistoricalDataManager.generateYearOverYearComparison('test-user', 2024);
      expect(result).toBeNull();
    });

    it('should generate year-over-year comparison when data exists', async () => {
      const mockData = [
        {
          month: '2024-01',
          monthlyBudget: 50000,
          totalExpenses: 35000,
          totalIncome: 60000,
          netBalance: 25000,
          budgetUsagePercent: 70,
          savingsRate: 41.7,
          financialHealthScore: 85,
          status: 'under-budget',
          categoryBreakdown: { 'Food': 10000 },
          unusualTransactions: 2,
          recommendations: [],
          timestamp: Date.now()
        },
        {
          month: '2023-01',
          monthlyBudget: 45000,
          totalExpenses: 40000,
          totalIncome: 55000,
          netBalance: 15000,
          budgetUsagePercent: 89,
          savingsRate: 27.3,
          financialHealthScore: 75,
          status: 'on-track',
          categoryBreakdown: { 'Food': 12000 },
          unusualTransactions: 3,
          recommendations: [],
          timestamp: Date.now()
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.generateYearOverYearComparison('test-user', 2024);
      expect(result).not.toBeNull();
      expect(result?.currentYear).toBe(2024);
      expect(result?.previousYear).toBe(2023);
      expect(result?.incomeChange).toBe(5000); // 60000 - 55000
      expect(result?.expenseChange).toBe(-5000); // 35000 - 40000
    });
  });

  describe('generateLongTermTrends', () => {
    it('should return default values when insufficient data exists', async () => {
      const result = await HistoricalDataManager.generateLongTermTrends('test-user', 24);
      expect(result.spendingTrends.trend).toBe('stable');
      expect(result.budgetAdherenceTrends.trend).toBe('stable');
      expect(result.savingsTrends.trend).toBe('stable');
    });

    it('should generate long-term trends when sufficient data exists', async () => {
      const mockData = [
        {
          month: '2024-01',
          monthlyBudget: 50000,
          totalExpenses: 35000,
          totalIncome: 60000,
          netBalance: 25000,
          budgetUsagePercent: 70,
          savingsRate: 41.7,
          financialHealthScore: 85,
          status: 'under-budget',
          categoryBreakdown: { 'Food': 10000 },
          unusualTransactions: 2,
          recommendations: [],
          timestamp: Date.now()
        },
        {
          month: '2023-12',
          monthlyBudget: 48000,
          totalExpenses: 38000,
          totalIncome: 58000,
          netBalance: 20000,
          budgetUsagePercent: 79,
          savingsRate: 34.5,
          financialHealthScore: 80,
          status: 'on-track',
          categoryBreakdown: { 'Food': 11000 },
          unusualTransactions: 2,
          recommendations: [],
          timestamp: Date.now()
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.generateLongTermTrends('test-user', 24);
      expect(result.spendingTrends.trend).toBeDefined();
      expect(result.budgetAdherenceTrends.trend).toBeDefined();
      expect(result.savingsTrends.trend).toBeDefined();
      expect(result.predictions).toBeDefined();
    });
  });

  describe('cleanOldHistoricalData', () => {
    it('should clean old data successfully', async () => {
      const mockData = [
        {
          month: '2021-01',
          monthlyBudget: 40000,
          totalExpenses: 30000,
          totalIncome: 50000,
          netBalance: 20000,
          budgetUsagePercent: 75,
          savingsRate: 40,
          financialHealthScore: 80,
          status: 'under-budget',
          categoryBreakdown: { 'Food': 8000 },
          unusualTransactions: 1,
          recommendations: [],
          timestamp: Date.now() - (4 * 365 * 24 * 60 * 60 * 1000) // 4 years ago
        },
        {
          month: '2024-01',
          monthlyBudget: 50000,
          totalExpenses: 35000,
          totalIncome: 60000,
          netBalance: 25000,
          budgetUsagePercent: 70,
          savingsRate: 41.7,
          financialHealthScore: 85,
          status: 'under-budget',
          categoryBreakdown: { 'Food': 10000 },
          unusualTransactions: 2,
          recommendations: [],
          timestamp: Date.now()
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.cleanOldHistoricalData('test-user');
      expect(result).toBe(true);
    });
  });

  describe('Data integrity and validation', () => {
    it('should handle malformed data gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');
      
      const result = await HistoricalDataManager.getHistoricalBudgetPerformance('test-user', 12);
      expect(result).toEqual([]);
    });

    it('should handle empty data arrays', async () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: [],
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.getHistoricalBudgetPerformance('test-user', 12);
      expect(result).toEqual([]);
    });

    it('should handle missing data properties', async () => {
      const mockData = [
        {
          month: '2024-01',
          // Missing other properties
          timestamp: Date.now()
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: mockData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const result = await HistoricalDataManager.getHistoricalBudgetPerformance('test-user', 12);
      expect(result).toHaveLength(1);
      expect(result[0].month).toBe('2024-01');
    });
  });

  describe('Performance and edge cases', () => {
    it('should handle large datasets efficiently', async () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        month: `2024-${String(i + 1).padStart(2, '0')}`,
        monthlyBudget: 50000,
        totalExpenses: 35000 + (i * 100),
        totalIncome: 60000 + (i * 200),
        netBalance: 25000 + (i * 100),
        budgetUsagePercent: 70 + (i * 0.5),
        savingsRate: 41.7 + (i * 0.3),
        financialHealthScore: 85 - (i * 0.2),
        status: 'under-budget',
        categoryBreakdown: { 'Food': 10000 + (i * 50) },
        unusualTransactions: 2,
        recommendations: [],
        timestamp: Date.now() - (i * 24 * 60 * 60 * 1000)
      }));

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        data: largeDataset,
        timestamp: Date.now(),
        version: '1.0.0'
      }));

      const startTime = Date.now();
      const result = await HistoricalDataManager.getHistoricalBudgetPerformance('test-user', 50);
      const endTime = Date.now();

      expect(result).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should handle concurrent operations', async () => {
      const promises = Array.from({ length: 10 }, (_, i) => 
        HistoricalDataManager.getHistoricalBudgetPerformance(`user-${i}`, 12)
      );

      const results = await Promise.all(promises);
      expect(results).toHaveLength(10);
      results.forEach(result => {
        expect(Array.isArray(result)).toBe(true);
      });
    });
  });
});

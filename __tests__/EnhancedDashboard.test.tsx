import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedDashboard from '@/app/components/EnhancedDashboard';
import { IntelligentBudget } from '@/app/lib/intelligentBudget';

// Mock the IntelligentBudget class
jest.mock('../app/lib/intelligentBudget');
jest.mock('@/app/components/SmartNotifications', () => {
  return function MockSmartNotifications() {
    return <div data-testid="smart-notifications">Smart Notifications</div>;
  };
});

jest.mock('@/app/components/BudgetSettings', () => {
  return function MockBudgetSettings({ isOpen, onClose }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="budget-settings">
        <button onClick={onClose}>Close Settings</button>
      </div>
    );
  };
});

const mockIncomeTransactions = [
  {
    id: 1,
    amount: 50000,
    description: 'Salary',
    category: 'Income',
    date: '2024-01-01'
  },
  {
    id: 2,
    amount: 10000,
    description: 'Freelance',
    category: 'Income',
    date: '2024-01-15'
  }
];

const mockExpenseTransactions = [
  {
    id: 3,
    amount: 2000,
    description: 'Rent',
    category: 'Housing',
    date: '2024-01-02'
  },
  {
    id: 4,
    amount: 1000,
    description: 'Food',
    category: 'Food',
    date: '2024-01-03'
  },
  {
    id: 5,
    amount: 500,
    description: 'Transport',
    category: 'Transport',
    date: '2024-01-04'
  }
];

const mockForecast = {
  recommendedBudget: 55000,
  confidence: 85,
  reasoning: ['Based on spending patterns'],
  categoryRecommendations: { 'Housing': 2000, 'Food': 1000 },
  riskFactors: ['High housing costs'],
  opportunities: ['Good savings rate'],
  nextMonthPrediction: 3300,
  seasonalAdjustments: {}
};

describe('EnhancedDashboard Component', () => {
  const mockIntelligentBudget = IntelligentBudget as jest.MockedClass<typeof IntelligentBudget>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock IntelligentBudget instance
    const mockInstance = {
      generateForecast: jest.fn().mockReturnValue(mockForecast),
      getSettings: jest.fn().mockReturnValue({
        monthlyBudget: 50000,
        categoryBudgets: {},
        autoAdjust: true,
        learningEnabled: true,
        emergencyBuffer: 10,
        savingsTarget: 20
      }),
      updateSettings: jest.fn()
    };
    
    mockIntelligentBudget.mockImplementation(() => mockInstance as any);
  });

  describe('Rendering', () => {
    test('should render loading state when loading is true', () => {
      render(
        <EnhancedDashboard
          incomeTransactions={[]}
          expenseTransactions={[]}
          selectedPeriod="month"
          loading={true}
        />
      );
      
      // Should show loading skeleton
      const loadingElements = screen.getAllByTestId(/loading/i);
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    test('should render no data message when no transactions', () => {
      render(
        <EnhancedDashboard
          incomeTransactions={[]}
          expenseTransactions={[]}
          selectedPeriod="month"
          loading={false}
        />
      );
      
      expect(screen.getByText('No data available for analytics')).toBeInTheDocument();
      expect(screen.getByText('Add some transactions to see detailed insights')).toBeInTheDocument();
    });

    test('should render dashboard with transactions', () => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
      
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Trends')).toBeInTheDocument();
      expect(screen.getByText('Insights')).toBeInTheDocument();
      expect(screen.getByText('Budget')).toBeInTheDocument();
      expect(screen.getByText('Predictions')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(() => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
    });

    test('should show overview tab by default', () => {
      expect(screen.getByText('Financial Health Score')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    test('should switch to trends tab when clicked', () => {
      const trendsTab = screen.getByText('Trends');
      fireEvent.click(trendsTab);
      
      expect(screen.getByText('Spending Trends')).toBeInTheDocument();
      expect(screen.getByText('Category Analysis')).toBeInTheDocument();
    });

    test('should switch to insights tab when clicked', () => {
      const insightsTab = screen.getByText('Insights');
      fireEvent.click(insightsTab);
      
      expect(screen.getByText('Spending Insights')).toBeInTheDocument();
      expect(screen.getByText('Anomaly Detection')).toBeInTheDocument();
    });

    test('should switch to budget tab when clicked', () => {
      const budgetTab = screen.getByText('Budget');
      fireEvent.click(budgetTab);
      
      expect(screen.getByText('Budget Overview')).toBeInTheDocument();
      expect(screen.getByText('Budget Usage')).toBeInTheDocument();
    });

    test('should switch to predictions tab when clicked', () => {
      const predictionsTab = screen.getByText('Predictions');
      fireEvent.click(predictionsTab);
      
      expect(screen.getByText('Financial Predictions')).toBeInTheDocument();
      expect(screen.getByText('Next Month Spending')).toBeInTheDocument();
    });
  });

  describe('Analytics Calculations', () => {
    beforeEach(() => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
    });

    test('should calculate and display financial health score', () => {
      // Should display a health score between 0-100
      const healthScoreElement = screen.getByText(/\d+\/100/);
      expect(healthScoreElement).toBeInTheDocument();
      
      const score = parseInt(healthScoreElement.textContent!.split('/')[0]);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('should display total income and expenses', () => {
      // Total income: 50000 + 10000 = 60000
      // Total expenses: 2000 + 1000 + 500 = 3500
      expect(screen.getByText('₱60,000')).toBeInTheDocument(); // Income
      expect(screen.getByText('₱3,500')).toBeInTheDocument(); // Expenses
    });

    test('should display net balance', () => {
      // Net balance: 60000 - 3500 = 56500
      expect(screen.getByText('₱56,500')).toBeInTheDocument();
    });

    test('should display savings rate', () => {
      // Savings rate: (56500 / 60000) * 100 = 94.17%
      expect(screen.getByText(/94\.17%/)).toBeInTheDocument();
    });
  });

  describe('Budget Integration', () => {
    beforeEach(() => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
    });

    test('should initialize IntelligentBudget with transactions', () => {
      expect(mockIntelligentBudget).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ type: 'income' }),
          expect.objectContaining({ type: 'expense' })
        ]),
        expect.any(Object)
      );
    });

    test('should display AI budget forecast in predictions tab', async () => {
      const predictionsTab = screen.getByText('Predictions');
      fireEvent.click(predictionsTab);
      
      await waitFor(() => {
        expect(screen.getByText('AI Budget Forecast')).toBeInTheDocument();
        expect(screen.getByText('₱55,000')).toBeInTheDocument(); // recommendedBudget
        expect(screen.getByText('85% confidence')).toBeInTheDocument();
      });
    });

    test('should open budget settings when brain icon is clicked', async () => {
      const predictionsTab = screen.getByText('Predictions');
      fireEvent.click(predictionsTab);
      
      await waitFor(() => {
        const settingsButton = screen.getByTitle('Configure Budget Settings');
        fireEvent.click(settingsButton);
        
        expect(screen.getByTestId('budget-settings')).toBeInTheDocument();
      });
    });
  });

  describe('Period Filtering', () => {
    test('should filter transactions by week', () => {
      const oldTransactions = [
        {
          id: 1,
          amount: 1000,
          description: 'Old transaction',
          category: 'Food',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 10 days ago
        }
      ];
      
      render(
        <EnhancedDashboard
          incomeTransactions={oldTransactions}
          expenseTransactions={[]}
          selectedPeriod="week"
          loading={false}
        />
      );
      
      // Old transactions should not be included in week view
      expect(screen.queryByText('Old transaction')).not.toBeInTheDocument();
    });

    test('should include all transactions in all-time view', () => {
      const oldTransactions = [
        {
          id: 1,
          amount: 1000,
          description: 'Old transaction',
          category: 'Food',
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 10 days ago
        }
      ];
      
      render(
        <EnhancedDashboard
          incomeTransactions={oldTransactions}
          expenseTransactions={[]}
          selectedPeriod="all-time"
          loading={false}
        />
      );
      
      // All transactions should be included
      expect(screen.getByText('₱1,000')).toBeInTheDocument();
    });
  });

  describe('Category Analysis', () => {
    beforeEach(() => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
    });

    test('should display top spending categories', () => {
      const insightsTab = screen.getByText('Insights');
      fireEvent.click(insightsTab);
      
      expect(screen.getByText('Spending Insights')).toBeInTheDocument();
      // Should show categories: Housing (2000), Food (1000), Transport (500)
    });

    test('should detect unusual spending patterns', () => {
      const insightsTab = screen.getByText('Insights');
      fireEvent.click(insightsTab);
      
      expect(screen.getByText('Anomaly Detection')).toBeInTheDocument();
    });
  });

  describe('Spending Velocity', () => {
    beforeEach(() => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
    });

    test('should calculate and display spending velocity', () => {
      const trendsTab = screen.getByText('Trends');
      fireEvent.click(trendsTab);
      
      expect(screen.getByText('Spending Velocity')).toBeInTheDocument();
      // Should show daily, weekly, and monthly projections
    });
  });

  describe('Budget Analysis', () => {
    beforeEach(() => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
    });

    test('should display budget usage', () => {
      const budgetTab = screen.getByText('Budget');
      fireEvent.click(budgetTab);
      
      expect(screen.getByText('Budget Overview')).toBeInTheDocument();
      expect(screen.getByText('Budget Usage')).toBeInTheDocument();
    });

    test('should show budget remaining', () => {
      const budgetTab = screen.getByText('Budget');
      fireEvent.click(budgetTab);
      
      // Budget: 50000, Used: 3500, Remaining: 46500
      expect(screen.getByText('₱46,500')).toBeInTheDocument();
    });
  });

  describe('Smart Notifications Integration', () => {
    test('should render SmartNotifications component', () => {
      render(
        <EnhancedDashboard
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
      
      expect(screen.getByTestId('smart-notifications')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('should handle calculation errors gracefully', () => {
      // Mock console.error to prevent test output noise
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Pass invalid data that might cause calculation errors
      render(
        <EnhancedDashboard
          incomeTransactions={[{ id: 1, amount: 'invalid', description: '', category: '', date: '' } as any]}
          expenseTransactions={[]}
          selectedPeriod="month"
          loading={false}
        />
      );
      
      // Should still render without crashing
      expect(screen.getByText('Overview')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance', () => {
    test('should handle large number of transactions efficiently', () => {
      const manyTransactions = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        amount: Math.random() * 10000,
        description: `Transaction ${i}`,
        category: ['Food', 'Transport', 'Housing'][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      
      const startTime = Date.now();
      render(
        <EnhancedDashboard
          incomeTransactions={manyTransactions}
          expenseTransactions={manyTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
      const endTime = Date.now();
      
      // Should render within reasonable time (less than 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle transactions with missing fields', () => {
      const incompleteTransactions = [
        {
          id: 1,
          amount: 1000,
          description: '',
          category: '',
          date: ''
        }
      ];
      
      render(
        <EnhancedDashboard
          incomeTransactions={incompleteTransactions}
          expenseTransactions={[]}
          selectedPeriod="month"
          loading={false}
        />
      );
      
      // Should render without crashing
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });

    test('should handle very large amounts', () => {
      const largeAmountTransactions = [
        {
          id: 1,
          amount: 999999999,
          description: 'Large amount',
          category: 'Income',
          date: '2024-01-01'
        }
      ];
      
      render(
        <EnhancedDashboard
          incomeTransactions={largeAmountTransactions}
          expenseTransactions={[]}
          selectedPeriod="month"
          loading={false}
        />
      );
      
      // Should handle large numbers without overflow
      expect(screen.getByText('₱999,999,999')).toBeInTheDocument();
    });

    test('should handle negative amounts', () => {
      const negativeTransactions = [
        {
          id: 1,
          amount: -1000,
          description: 'Negative amount',
          category: 'Expense',
          date: '2024-01-01'
        }
      ];
      
      render(
        <EnhancedDashboard
          incomeTransactions={[]}
          expenseTransactions={negativeTransactions}
          selectedPeriod="month"
          loading={false}
        />
      );
      
      // Should handle negative amounts
      expect(screen.getByText('₱-1,000')).toBeInTheDocument();
    });
  });
});

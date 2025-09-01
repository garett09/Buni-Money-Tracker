import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetSettings from '@/app/components/BudgetSettings';
import { IntelligentBudget } from '@/app/lib/intelligentBudget';

// Mock the IntelligentBudget class
jest.mock('../app/lib/intelligentBudget');
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

const mockIncomeTransactions = [
  {
    id: 1,
    amount: 50000,
    description: 'Salary',
    category: 'Income',
    date: '2024-01-01'
  }
];

const mockExpenseTransactions = [
  {
    id: 2,
    amount: 2000,
    description: 'Rent',
    category: 'Housing',
    date: '2024-01-02'
  },
  {
    id: 3,
    amount: 1000,
    description: 'Food',
    category: 'Food',
    date: '2024-01-03'
  }
];

const mockForecast = {
  recommendedBudget: 55000,
  confidence: 85,
  reasoning: [
    'Based on 3 transactions across 3 categories',
    'Average monthly spending: ₱3,000',
    'Added 10% emergency buffer'
  ],
  categoryRecommendations: {
    'Housing': 2000,
    'Food': 1000
  },
  riskFactors: [
    'Housing spending is increasing rapidly'
  ],
  opportunities: [
    'Food spending is decreasing - good trend'
  ],
  nextMonthPrediction: 3300,
  seasonalAdjustments: {
    'Housing': 1.0,
    'Food': 1.1
  }
};

describe('BudgetSettings Component', () => {
  const mockIntelligentBudget = IntelligentBudget as jest.MockedClass<typeof IntelligentBudget>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    
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
      updateSettings: jest.fn(),
      getSpendingInsights: jest.fn().mockReturnValue({
        topCategories: [
          { category: 'Housing', amount: 2000, percentage: 66.7 }
        ],
        unusualSpending: [],
        spendingTrends: [
          { category: 'Housing', trend: 'increasing', change: 15 }
        ]
      }),
      suggestOptimizations: jest.fn().mockReturnValue({
        recommendations: [
          'Consider reducing Housing spending (66.7% of total)'
        ],
        potentialSavings: 400,
        priorityActions: [
          'Review Housing expenses'
        ]
      })
    };
    
    mockIntelligentBudget.mockImplementation(() => mockInstance as any);
  });

  describe('Rendering', () => {
    test('should not render when isOpen is false', () => {
      render(
        <BudgetSettings
          isOpen={false}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      expect(screen.queryByText('Intelligent Budget Settings')).not.toBeInTheDocument();
    });

    test('should render when isOpen is true', () => {
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      expect(screen.getByText('Intelligent Budget Settings')).toBeInTheDocument();
      expect(screen.getByText('Budget Configuration')).toBeInTheDocument();
      expect(screen.getByText('AI Insights & Recommendations')).toBeInTheDocument();
    });

    test('should render with empty transactions', () => {
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={[]}
          expenseTransactions={[]}
        />
      );
      
      expect(screen.getByText('Intelligent Budget Settings')).toBeInTheDocument();
    });
  });

  describe('Budget Configuration', () => {
    beforeEach(() => {
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
    });

    test('should display monthly budget input', () => {
      const budgetInput = screen.getByDisplayValue('50000');
      expect(budgetInput).toBeInTheDocument();
      expect(budgetInput).toHaveAttribute('type', 'number');
    });

    test('should update monthly budget when changed', () => {
      const budgetInput = screen.getByDisplayValue('50000');
      fireEvent.change(budgetInput, { target: { value: '60000' } });
      
      expect(budgetInput).toHaveValue(60000);
    });

    test('should display emergency buffer slider', () => {
      const bufferSlider = screen.getByRole('slider', { name: /emergency buffer/i });
      expect(bufferSlider).toBeInTheDocument();
      expect(bufferSlider).toHaveValue('10');
    });

    test('should update emergency buffer when slider is moved', () => {
      const bufferSlider = screen.getByRole('slider', { name: /emergency buffer/i });
      fireEvent.change(bufferSlider, { target: { value: '15' } });
      
      expect(bufferSlider).toHaveValue('15');
      expect(screen.getByText('15%')).toBeInTheDocument();
    });

    test('should display savings target slider', () => {
      const savingsSlider = screen.getByRole('slider', { name: /savings target/i });
      expect(savingsSlider).toBeInTheDocument();
      expect(savingsSlider).toHaveValue('20');
    });

    test('should update savings target when slider is moved', () => {
      const savingsSlider = screen.getByRole('slider', { name: /savings target/i });
      fireEvent.change(savingsSlider, { target: { value: '25' } });
      
      expect(savingsSlider).toHaveValue('25');
      expect(screen.getByText('25%')).toBeInTheDocument();
    });
  });

  describe('AI Learning Settings', () => {
    beforeEach(() => {
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
    });

    test('should display AI learning toggle', () => {
      const learningToggle = screen.getByRole('checkbox', { name: /enable ai learning/i });
      expect(learningToggle).toBeInTheDocument();
      expect(learningToggle).toBeChecked();
    });

    test('should toggle AI learning when clicked', () => {
      const learningToggle = screen.getByRole('checkbox', { name: /enable ai learning/i });
      fireEvent.click(learningToggle);
      
      expect(learningToggle).not.toBeChecked();
    });

    test('should display auto-adjust budget toggle', () => {
      const autoAdjustToggle = screen.getByRole('checkbox', { name: /auto-adjust budget/i });
      expect(autoAdjustToggle).toBeInTheDocument();
      expect(autoAdjustToggle).toBeChecked();
    });

    test('should toggle auto-adjust budget when clicked', () => {
      const autoAdjustToggle = screen.getByRole('checkbox', { name: /auto-adjust budget/i });
      fireEvent.click(autoAdjustToggle);
      
      expect(autoAdjustToggle).not.toBeChecked();
    });
  });

  describe('AI Insights Display', () => {
    beforeEach(() => {
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
    });

    test('should display AI budget forecast', async () => {
      await waitFor(() => {
        expect(screen.getByText('AI Budget Forecast')).toBeInTheDocument();
        expect(screen.getByText('₱55,000')).toBeInTheDocument(); // recommendedBudget
        expect(screen.getByText('High (85%)')).toBeInTheDocument(); // confidence
        expect(screen.getByText('₱3,300')).toBeInTheDocument(); // nextMonthPrediction
      });
    });

    test('should display reasoning', async () => {
      await waitFor(() => {
        expect(screen.getByText('How AI Calculated This')).toBeInTheDocument();
        expect(screen.getByText(/Based on 3 transactions across 3 categories/)).toBeInTheDocument();
        expect(screen.getByText(/Average monthly spending: ₱3,000/)).toBeInTheDocument();
        expect(screen.getByText(/Added 10% emergency buffer/)).toBeInTheDocument();
      });
    });

    test('should display risk factors', async () => {
      await waitFor(() => {
        expect(screen.getByText('Risk Factors')).toBeInTheDocument();
        expect(screen.getByText('Housing spending is increasing rapidly')).toBeInTheDocument();
      });
    });

    test('should display opportunities', async () => {
      await waitFor(() => {
        expect(screen.getByText('Positive Trends')).toBeInTheDocument();
        expect(screen.getByText('Food spending is decreasing - good trend')).toBeInTheDocument();
      });
    });

    test('should display optimization suggestions', async () => {
      await waitFor(() => {
        expect(screen.getByText('Optimization Suggestions')).toBeInTheDocument();
        expect(screen.getByText(/Consider reducing Housing spending/)).toBeInTheDocument();
        expect(screen.getByText('₱400')).toBeInTheDocument(); // potentialSavings
      });
    });
  });

  describe('Action Buttons', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
      render(
        <BudgetSettings
          isOpen={true}
          onClose={mockOnClose}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
    });

    test('should call onClose when close button is clicked', () => {
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('should save settings when save button is clicked', async () => {
      const saveButton = screen.getByText('Save Settings');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'budgetSettings',
          expect.any(String)
        );
      });
    });

    test('should reset to AI recommendation when button is clicked', async () => {
      const resetButton = screen.getByText('Use AI Recommendation');
      fireEvent.click(resetButton);
      
      await waitFor(() => {
        const budgetInput = screen.getByDisplayValue('55000'); // Should be updated to AI recommendation
        expect(budgetInput).toBeInTheDocument();
      });
    });
  });

  describe('Settings Persistence', () => {
    test('should load saved settings from localStorage', () => {
      const savedSettings = {
        monthlyBudget: 75000,
        emergencyBuffer: 15,
        savingsTarget: 25,
        autoAdjust: false,
        learningEnabled: false
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedSettings));
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      expect(screen.getByDisplayValue('75000')).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: /emergency buffer/i })).toHaveValue('15');
      expect(screen.getByRole('slider', { name: /savings target/i })).toHaveValue('25');
    });

    test('should handle invalid saved settings', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      // Should use default settings
      expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    });
  });

  describe('Confidence Display', () => {
    test('should display high confidence in green', async () => {
      const highConfidenceForecast = { ...mockForecast, confidence: 90 };
      const mockInstance = {
        generateForecast: jest.fn().mockReturnValue(highConfidenceForecast),
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
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      await waitFor(() => {
        const confidenceElement = screen.getByText('High (90%)');
        expect(confidenceElement).toHaveClass('text-green-400');
      });
    });

    test('should display medium confidence in yellow', async () => {
      const mediumConfidenceForecast = { ...mockForecast, confidence: 65 };
      const mockInstance = {
        generateForecast: jest.fn().mockReturnValue(mediumConfidenceForecast),
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
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      await waitFor(() => {
        const confidenceElement = screen.getByText('Medium (65%)');
        expect(confidenceElement).toHaveClass('text-yellow-400');
      });
    });

    test('should display low confidence in red', async () => {
      const lowConfidenceForecast = { ...mockForecast, confidence: 30 };
      const mockInstance = {
        generateForecast: jest.fn().mockReturnValue(lowConfidenceForecast),
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
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      await waitFor(() => {
        const confidenceElement = screen.getByText('Low (30%)');
        expect(confidenceElement).toHaveClass('text-red-400');
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty forecast data', async () => {
      const emptyForecast = {
        recommendedBudget: 0,
        confidence: 0,
        reasoning: [],
        categoryRecommendations: {},
        riskFactors: [],
        opportunities: [],
        nextMonthPrediction: 0,
        seasonalAdjustments: {}
      };
      
      const mockInstance = {
        generateForecast: jest.fn().mockReturnValue(emptyForecast),
        getSettings: jest.fn().mockReturnValue({
          monthlyBudget: 50000,
          categoryBudgets: {},
          autoAdjust: true,
          learningEnabled: true,
          emergencyBuffer: 10,
          savingsTarget: 20
        }),
        updateSettings: jest.fn(),
        getSpendingInsights: jest.fn().mockReturnValue({
          topCategories: [],
          unusualSpending: [],
          spendingTrends: []
        }),
        suggestOptimizations: jest.fn().mockReturnValue({
          recommendations: [],
          potentialSavings: 0,
          priorityActions: []
        })
      };
      mockIntelligentBudget.mockImplementation(() => mockInstance as any);
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={[]}
          expenseTransactions={[]}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('AI Budget Forecast')).toBeInTheDocument();
        expect(screen.getByText('₱0')).toBeInTheDocument();
      });
    });

    test('should handle very large budget amounts', async () => {
      const largeBudgetForecast = { ...mockForecast, recommendedBudget: 999999999 };
      const mockInstance = {
        generateForecast: jest.fn().mockReturnValue(largeBudgetForecast),
        getSettings: jest.fn().mockReturnValue({
          monthlyBudget: 999999999,
          categoryBudgets: {},
          autoAdjust: true,
          learningEnabled: true,
          emergencyBuffer: 10,
          savingsTarget: 20
        }),
        updateSettings: jest.fn()
      };
      mockIntelligentBudget.mockImplementation(() => mockInstance as any);
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('₱999,999,999')).toBeInTheDocument();
      });
    });
  });

  describe('Integration with IntelligentBudget', () => {
    test('should initialize IntelligentBudget with transactions', () => {
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      expect(mockIntelligentBudget).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ type: 'income' }),
          expect.objectContaining({ type: 'expense' })
        ]),
        expect.any(Object)
      );
    });

    test('should call updateSettings when settings change', async () => {
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
      
      render(
        <BudgetSettings
          isOpen={true}
          onClose={jest.fn()}
          incomeTransactions={mockIncomeTransactions}
          expenseTransactions={mockExpenseTransactions}
        />
      );
      
      const budgetInput = screen.getByDisplayValue('50000');
      fireEvent.change(budgetInput, { target: { value: '60000' } });
      
      await waitFor(() => {
        expect(mockInstance.updateSettings).toHaveBeenCalledWith(
          expect.objectContaining({ monthlyBudget: 60000 })
        );
      });
    });
  });
});

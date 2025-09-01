import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountBalance from '@/app/components/AccountBalance';
import { ApiClient } from '@/app/lib/api';

// Mock the API client
jest.mock('../app/lib/api');
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

const mockAccounts = [
  {
    id: 1,
    name: 'BPI Savings',
    accountType: 'savings',
    currentBalance: 50000,
    accountNumber: '****1234',
    description: 'Main savings account',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 2,
    name: 'GCash Wallet',
    accountType: 'digital-wallet',
    currentBalance: 5000,
    accountNumber: '****5678',
    description: 'Daily expenses wallet',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 3,
    name: 'Credit Card',
    accountType: 'credit',
    currentBalance: -2000,
    accountNumber: '****9012',
    description: 'Credit card balance',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z'
  }
];

describe('AccountBalance Component', () => {
  const mockGetAccounts = ApiClient.getAccounts as jest.MockedFunction<typeof ApiClient.getAccounts>;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('Rendering', () => {
    test('should render loading state initially', () => {
      mockGetAccounts.mockImplementation(() => new Promise(() => {})); // Never resolves
      
      render(<AccountBalance />);
      
      expect(screen.getByText('Account Balance')).toBeInTheDocument();
      expect(screen.getByText('Total Balance')).toBeInTheDocument();
    });

    test('should render accounts when API call succeeds', async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('₱53,000')).toBeInTheDocument(); // Total balance
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
        expect(screen.getByText('GCash Wallet')).toBeInTheDocument();
        expect(screen.getByText('Credit Card')).toBeInTheDocument();
      });
    });

    test('should render empty state when no accounts', async () => {
      mockGetAccounts.mockResolvedValue({ accounts: [] });
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('No accounts found')).toBeInTheDocument();
        expect(screen.getByText('Add your bank accounts and digital wallets to track balances')).toBeInTheDocument();
        expect(screen.getByText('Add Account')).toBeInTheDocument();
      });
    });

    test('should render with custom className', async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      
      render(<AccountBalance className="custom-class" />);
      
      const container = screen.getByText('Account Balance').closest('.liquid-card');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('Account Display', () => {
    beforeEach(async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      render(<AccountBalance />);
      await waitFor(() => {
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
      });
    });

    test('should display total balance correctly', () => {
      // 50000 + 5000 + (-2000) = 53000
      expect(screen.getByText('₱53,000')).toBeInTheDocument();
    });

    test('should display individual account balances', () => {
      expect(screen.getByText('₱50,000')).toBeInTheDocument(); // BPI Savings
      expect(screen.getByText('₱5,000')).toBeInTheDocument(); // GCash
      expect(screen.getByText('₱-2,000')).toBeInTheDocument(); // Credit Card
    });

    test('should display account types correctly', () => {
      expect(screen.getByText('Savings • ****1234')).toBeInTheDocument();
      expect(screen.getByText('Digital-wallet • ****5678')).toBeInTheDocument();
      expect(screen.getByText('Credit • ****9012')).toBeInTheDocument();
    });

    test('should display account descriptions', () => {
      expect(screen.getByText('Main savings account')).toBeInTheDocument();
      expect(screen.getByText('Daily expenses wallet')).toBeInTheDocument();
      expect(screen.getByText('Credit card balance')).toBeInTheDocument();
    });

    test('should display percentage breakdown for multiple accounts', () => {
      // BPI: 50000/53000 ≈ 94.3%
      // GCash: 5000/53000 ≈ 9.4%
      expect(screen.getByText('94.3%')).toBeInTheDocument();
      expect(screen.getByText('9.4%')).toBeInTheDocument();
    });
  });

  describe('Balance Visibility Toggle', () => {
    beforeEach(async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      render(<AccountBalance />);
      await waitFor(() => {
        expect(screen.getByText('₱53,000')).toBeInTheDocument();
      });
    });

    test('should hide balances when eye-off button is clicked', () => {
      const toggleButton = screen.getByTitle('Hide balances');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('₱••••••')).toBeInTheDocument();
      expect(screen.queryByText('₱53,000')).not.toBeInTheDocument();
    });

    test('should show balances when eye button is clicked', () => {
      const toggleButton = screen.getByTitle('Hide balances');
      fireEvent.click(toggleButton); // Hide first
      
      const showButton = screen.getByTitle('Show balances');
      fireEvent.click(showButton); // Show again
      
      expect(screen.getByText('₱53,000')).toBeInTheDocument();
      expect(screen.queryByText('₱••••••')).not.toBeInTheDocument();
    });

    test('should hide individual account balances when toggled', () => {
      const toggleButton = screen.getByTitle('Hide balances');
      fireEvent.click(toggleButton);
      
      // All individual balances should be hidden
      const hiddenBalances = screen.getAllByText('₱••••••');
      expect(hiddenBalances.length).toBeGreaterThan(1);
    });
  });

  describe('Refresh Functionality', () => {
    beforeEach(async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      render(<AccountBalance />);
      await waitFor(() => {
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
      });
    });

    test('should refresh accounts when refresh button is clicked', async () => {
      const refreshButton = screen.getByTitle('Refresh balances');
      fireEvent.click(refreshButton);
      
      await waitFor(() => {
        expect(mockGetAccounts).toHaveBeenCalledTimes(2); // Initial load + refresh
      });
    });

    test('should show loading state during refresh', async () => {
      let resolvePromise: (value: any) => void;
      const refreshPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockGetAccounts.mockReturnValue(refreshPromise);
      
      const refreshButton = screen.getByTitle('Refresh balances');
      fireEvent.click(refreshButton);
      
      // Should show spinning icon
      const spinningIcon = screen.getByTitle('Refresh balances').querySelector('.animate-spin');
      expect(spinningIcon).toBeInTheDocument();
      
      // Resolve the promise
      resolvePromise!({ accounts: mockAccounts });
      
      await waitFor(() => {
        expect(spinningIcon).not.toHaveClass('animate-spin');
      });
    });
  });

  describe('Error Handling', () => {
    test('should fallback to localStorage when API fails', async () => {
      mockGetAccounts.mockRejectedValue(new Error('API Error'));
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockAccounts));
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
        expect(localStorageMock.getItem).toHaveBeenCalledWith('accounts');
      });
    });

    test('should handle invalid localStorage data', async () => {
      mockGetAccounts.mockRejectedValue(new Error('API Error'));
      localStorageMock.getItem.mockReturnValue('invalid json');
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('No accounts found')).toBeInTheDocument();
      });
    });

    test('should handle empty localStorage data', async () => {
      mockGetAccounts.mockRejectedValue(new Error('API Error'));
      localStorageMock.getItem.mockReturnValue(null);
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('No accounts found')).toBeInTheDocument();
      });
    });

    test('should filter out inactive accounts', async () => {
      const accountsWithInactive = [
        ...mockAccounts,
        {
          id: 4,
          name: 'Inactive Account',
          accountType: 'savings',
          currentBalance: 1000,
          isActive: false,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      
      mockGetAccounts.mockResolvedValue({ accounts: accountsWithInactive });
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
        expect(screen.queryByText('Inactive Account')).not.toBeInTheDocument();
      });
    });
  });

  describe('Account Type Icons and Colors', () => {
    beforeEach(async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      render(<AccountBalance />);
      await waitFor(() => {
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
      });
    });

    test('should display correct icons for different account types', () => {
      // Check that icons are rendered (they should be present in the DOM)
      const accountCards = screen.getAllByText(/BPI Savings|GCash Wallet|Credit Card/);
      expect(accountCards.length).toBe(3);
    });

    test('should apply correct colors for different account types', () => {
      // The colors are applied via CSS classes, so we check for their presence
      const accountCards = document.querySelectorAll('.liquid-card');
      expect(accountCards.length).toBeGreaterThan(0);
    });
  });

  describe('Quick Stats', () => {
    beforeEach(async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      render(<AccountBalance />);
      await waitFor(() => {
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
      });
    });

    test('should display active accounts count', () => {
      expect(screen.getByText('3')).toBeInTheDocument(); // 3 active accounts
    });

    test('should display account types count', () => {
      expect(screen.getByText('3')).toBeInTheDocument(); // 3 different types: savings, digital-wallet, credit
    });
  });

  describe('Add Account Button', () => {
    beforeEach(async () => {
      mockGetAccounts.mockResolvedValue({ accounts: [] });
      render(<AccountBalance />);
      await waitFor(() => {
        expect(screen.getByText('No accounts found')).toBeInTheDocument();
      });
    });

    test('should render add account button when no accounts', () => {
      const addButton = screen.getByText('Add Account');
      expect(addButton).toBeInTheDocument();
      expect(addButton.closest('button')).toBeInTheDocument();
    });

    test('should not render add account button when accounts exist', async () => {
      mockGetAccounts.mockResolvedValue({ accounts: mockAccounts });
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('BPI Savings')).toBeInTheDocument();
        expect(screen.queryByText('Add Account')).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle accounts with missing optional fields', async () => {
      const minimalAccounts = [
        {
          id: 1,
          name: 'Minimal Account',
          accountType: 'savings',
          currentBalance: 1000,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      
      mockGetAccounts.mockResolvedValue({ accounts: minimalAccounts });
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('Minimal Account')).toBeInTheDocument();
        expect(screen.getAllByText('₱1,000')).toHaveLength(2); // Total balance and account balance
      });
    });

    test('should handle very large balance amounts', async () => {
      const largeBalanceAccounts = [
        {
          id: 1,
          name: 'Large Balance',
          accountType: 'savings',
          currentBalance: 999999999,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      
      mockGetAccounts.mockResolvedValue({ accounts: largeBalanceAccounts });
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getAllByText('₱999,999,999')).toHaveLength(2); // Total balance and account balance
      });
    });

    test('should handle negative balances correctly', async () => {
      const negativeBalanceAccounts = [
        {
          id: 1,
          name: 'Negative Balance',
          accountType: 'credit',
          currentBalance: -5000,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      
      mockGetAccounts.mockResolvedValue({ accounts: negativeBalanceAccounts });
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getAllByText('₱-5,000')).toHaveLength(2); // Total balance and account balance
      });
    });

    test('should handle zero balance', async () => {
      const zeroBalanceAccounts = [
        {
          id: 1,
          name: 'Zero Balance',
          accountType: 'savings',
          currentBalance: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ];
      
      mockGetAccounts.mockResolvedValue({ accounts: zeroBalanceAccounts });
      
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getAllByText('₱0')).toHaveLength(2); // Total balance and account balance
      });
    });
  });

  describe('Performance', () => {
    test('should handle large number of accounts efficiently', async () => {
      const manyAccounts = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Account ${i + 1}`,
        accountType: 'savings',
        currentBalance: 1000 + i,
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z'
      }));
      
      mockGetAccounts.mockResolvedValue({ accounts: manyAccounts });
      
      const startTime = Date.now();
      render(<AccountBalance />);
      
      await waitFor(() => {
        expect(screen.getByText('Account 1')).toBeInTheDocument();
      });
      
      const endTime = Date.now();
      
      // Should render within reasonable time (less than 500ms)
      expect(endTime - startTime).toBeLessThan(500);
    });
  });
});

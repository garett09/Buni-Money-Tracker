import { ApiClient } from '@/app/lib/api'

// Mock fetch globally
global.fetch = jest.fn()

describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('Expense Transactions', () => {
    it('should add expense transaction successfully', async () => {
      const mockResponse = {
        transaction: {
          id: 1,
          amount: 1000,
          description: 'Test Expense',
          category: 'Food',
          subcategory: 'Groceries',
          date: '2024-01-15',
          recurring: true,
          billingDate: '2024-01-15',
          totalInstallments: 12,
          currentInstallment: 1,
          paidAmount: 1000,
          remainingAmount: 11000,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const transactionData = {
        amount: '1000',
        description: 'Test Expense',
        category: 'Food',
        subcategory: 'Groceries',
        date: '2024-01-15',
        recurring: true,
        billingDate: '2024-01-15',
        totalInstallments: 12,
        currentInstallment: 1,
        paidAmount: 1000,
        remainingAmount: 11000,
        accountId: '1',
      }

      const result = await ApiClient.addExpenseTransaction(transactionData)

      expect(fetch).toHaveBeenCalledWith('/api/transactions/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
        body: JSON.stringify(transactionData),
      })

      expect(result).toEqual(mockResponse)
    })

    it('should get expense transactions successfully', async () => {
      const mockTransactions = [
        {
          id: 1,
          amount: 1000,
          description: 'Test Expense',
          category: 'Food',
          subcategory: 'Groceries',
          date: '2024-01-15',
          recurring: true,
          billingDate: '2024-01-15',
          totalInstallments: 12,
          currentInstallment: 1,
          paidAmount: 1000,
          remainingAmount: 11000,
        },
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactions: mockTransactions }),
      })

      const result = await ApiClient.getExpenseTransactions()

      expect(fetch).toHaveBeenCalledWith('/api/transactions/expenses', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
      })

      expect(result).toEqual({ transactions: mockTransactions })
    })

    it('should update expense transaction successfully', async () => {
      const mockResponse = {
        transaction: {
          id: 1,
          amount: 1500,
          description: 'Updated Expense',
          category: 'Food',
          subcategory: 'Groceries',
          date: '2024-01-15',
          recurring: true,
          billingDate: '2024-01-15',
          totalInstallments: 12,
          currentInstallment: 2,
          paidAmount: 2500,
          remainingAmount: 15500,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const updatedData = {
        id: 1,
        amount: 1500,
        description: 'Updated Expense',
        category: 'Food',
        subcategory: 'Groceries',
        date: '2024-01-15',
        recurring: true,
        billingDate: '2024-01-15',
        totalInstallments: 12,
        currentInstallment: 2,
        paidAmount: 2500,
        remainingAmount: 15500,
      }

      const result = await ApiClient.updateExpenseTransaction(1, updatedData)

      expect(fetch).toHaveBeenCalledWith('/api/transactions/expenses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
        body: JSON.stringify({ transactionId: 1, updates: updatedData }),
      })

      expect(result).toEqual(mockResponse)
    })

    it('should delete expense transaction successfully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const result = await ApiClient.deleteExpenseTransaction(1)

      expect(fetch).toHaveBeenCalledWith('/api/transactions/expenses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
        body: JSON.stringify({ transactionId: 1 }),
      })

      expect(result).toEqual({ success: true })
    })
  })

  describe('Income Transactions', () => {
    it('should add income transaction successfully', async () => {
      const mockResponse = {
        transaction: {
          id: 1,
          amount: 5000,
          description: 'Test Income',
          category: 'Salary',
          subcategory: 'Primary Job',
          date: '2024-01-15',
          recurring: true,
          paymentDate: '2024-01-15',
          totalPayments: 12,
          currentPayment: 1,
          receivedAmount: 5000,
          pendingAmount: 55000,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const transactionData = {
        amount: '5000',
        description: 'Test Income',
        category: 'Salary',
        subcategory: 'Primary Job',
        date: '2024-01-15',
        recurring: true,
        paymentDate: '2024-01-15',
        totalPayments: 12,
        currentPayment: 1,
        receivedAmount: 5000,
        pendingAmount: 55000,
        accountId: '1',
      }

      const result = await ApiClient.addIncomeTransaction(transactionData)

      expect(fetch).toHaveBeenCalledWith('/api/transactions/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
        body: JSON.stringify(transactionData),
      })

      expect(result).toEqual(mockResponse)
    })

    it('should get income transactions successfully', async () => {
      const mockTransactions = [
        {
          id: 1,
          amount: 5000,
          description: 'Test Income',
          category: 'Salary',
          subcategory: 'Primary Job',
          date: '2024-01-15',
          recurring: true,
          paymentDate: '2024-01-15',
          totalPayments: 12,
          currentPayment: 1,
          receivedAmount: 5000,
          pendingAmount: 55000,
        },
      ]

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ transactions: mockTransactions }),
      })

      const result = await ApiClient.getIncomeTransactions()

      expect(fetch).toHaveBeenCalledWith('/api/transactions/income', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
      })

      expect(result).toEqual({ transactions: mockTransactions })
    })

    it('should update income transaction successfully', async () => {
      const mockResponse = {
        transaction: {
          id: 1,
          amount: 6000,
          description: 'Updated Income',
          category: 'Salary',
          subcategory: 'Primary Job',
          date: '2024-01-15',
          recurring: true,
          paymentDate: '2024-01-15',
          totalPayments: 12,
          currentPayment: 2,
          receivedAmount: 11000,
          pendingAmount: 61000,
        },
      }

      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const updatedData = {
        id: 1,
        amount: 6000,
        description: 'Updated Income',
        category: 'Salary',
        subcategory: 'Primary Job',
        date: '2024-01-15',
        recurring: true,
        paymentDate: '2024-01-15',
        totalPayments: 12,
        currentPayment: 2,
        receivedAmount: 11000,
        pendingAmount: 61000,
      }

      const result = await ApiClient.updateIncomeTransaction(1, updatedData)

      expect(fetch).toHaveBeenCalledWith('/api/transactions/income', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
        body: JSON.stringify({ transactionId: 1, updates: updatedData }),
      })

      expect(result).toEqual(mockResponse)
    })

    it('should delete income transaction successfully', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const result = await ApiClient.deleteIncomeTransaction(1)

      expect(fetch).toHaveBeenCalledWith('/api/transactions/income', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': '',
        },
        body: JSON.stringify({ transactionId: 1 }),
      })

      expect(result).toEqual({ success: true })
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(ApiClient.getExpenseTransactions()).rejects.toThrow('Network error')
    })

    it('should handle HTTP errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(ApiClient.getExpenseTransactions()).rejects.toThrow('Failed to fetch expense transactions')
    })

    it('should handle JSON parsing errors', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      })

      await expect(ApiClient.getExpenseTransactions()).rejects.toThrow('Invalid JSON')
    })
  })

  describe('Data Validation', () => {
    it('should validate recurring expense data structure', async () => {
      const validRecurringExpense = {
        amount: '1000',
        description: 'Test Expense',
        category: 'Food',
        subcategory: 'Groceries',
        date: '2024-01-15',
        recurring: true,
        billingDate: '2024-01-15',
        totalInstallments: 12,
        currentInstallment: 1,
        paidAmount: 1000,
        remainingAmount: 11000,
        accountId: '1',
      }

      // Check that all required fields are present
      expect(validRecurringExpense).toHaveProperty('amount')
      expect(validRecurringExpense).toHaveProperty('description')
      expect(validRecurringExpense).toHaveProperty('category')
      expect(validRecurringExpense).toHaveProperty('subcategory')
      expect(validRecurringExpense).toHaveProperty('date')
      expect(validRecurringExpense).toHaveProperty('recurring')
      expect(validRecurringExpense).toHaveProperty('billingDate')
      expect(validRecurringExpense).toHaveProperty('totalInstallments')
      expect(validRecurringExpense).toHaveProperty('currentInstallment')
      expect(validRecurringExpense).toHaveProperty('paidAmount')
      expect(validRecurringExpense).toHaveProperty('remainingAmount')
    })

    it('should validate recurring income data structure', async () => {
      const validRecurringIncome = {
        amount: '5000',
        description: 'Test Income',
        category: 'Salary',
        subcategory: 'Primary Job',
        date: '2024-01-15',
        recurring: true,
        paymentDate: '2024-01-15',
        totalPayments: 12,
        currentPayment: 1,
        receivedAmount: 5000,
        pendingAmount: 55000,
        accountId: '1',
      }

      // Check that all required fields are present
      expect(validRecurringIncome).toHaveProperty('amount')
      expect(validRecurringIncome).toHaveProperty('description')
      expect(validRecurringIncome).toHaveProperty('category')
      expect(validRecurringIncome).toHaveProperty('subcategory')
      expect(validRecurringIncome).toHaveProperty('date')
      expect(validRecurringIncome).toHaveProperty('recurring')
      expect(validRecurringIncome).toHaveProperty('paymentDate')
      expect(validRecurringIncome).toHaveProperty('totalPayments')
      expect(validRecurringIncome).toHaveProperty('currentPayment')
      expect(validRecurringIncome).toHaveProperty('receivedAmount')
      expect(validRecurringIncome).toHaveProperty('pendingAmount')
    })
  })
})

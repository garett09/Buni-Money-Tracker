// Test Data Setup Script for Buni Money Tracker
// This script populates the dashboard with realistic test data

console.log('🚀 Setting up comprehensive test data for Buni Money Tracker...');

// Clear existing data
localStorage.clear();

// Set up user authentication
localStorage.setItem('token', 'test-token-12345');
localStorage.setItem('user', JSON.stringify({
  id: 'user-123',
  name: 'Test User',
  email: 'test@buni.com'
}));

// Set up monthly budget
localStorage.setItem('monthlyBudget', '50000'); // ₱50,000 monthly budget

// Set up accounts
const accounts = [
  {
    id: 'account-1',
    name: 'Main Bank Account',
    type: 'checking',
    balance: 125000,
    currency: 'PHP',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'account-2',
    name: 'Savings Account',
    type: 'savings',
    balance: 75000,
    currency: 'PHP',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'account-3',
    name: 'Credit Card',
    type: 'credit',
    balance: -15000,
    currency: 'PHP',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'account-4',
    name: 'Emergency Fund',
    type: 'savings',
    balance: 100000,
    currency: 'PHP',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

localStorage.setItem('accounts', JSON.stringify(accounts));

// Set up income transactions for current month
const currentMonth = new Date().toISOString().slice(0, 7);
const incomeTransactions = [
  {
    id: 'income-1',
    amount: 45000,
    category: 'Salary',
    date: `${currentMonth}-01`,
    accountId: 'account-1',
    description: 'Monthly salary from company',
    type: 'income',
    createdAt: new Date().toISOString()
  },
  {
    id: 'income-2',
    amount: 8000,
    category: 'Freelance',
    date: `${currentMonth}-15`,
    accountId: 'account-1',
    description: 'Freelance project payment',
    type: 'income',
    createdAt: new Date().toISOString()
  },
  {
    id: 'income-3',
    amount: 2000,
    category: 'Investment',
    date: `${currentMonth}-20`,
    accountId: 'account-2',
    description: 'Dividend from investments',
    type: 'income',
    createdAt: new Date().toISOString()
  }
];

localStorage.setItem('incomeTransactions', JSON.stringify(incomeTransactions));

// Set up expense transactions for current month
const expenseTransactions = [
  {
    id: 'expense-1',
    amount: 15000,
    category: 'Housing',
    date: `${currentMonth}-01`,
    accountId: 'account-1',
    description: 'Monthly rent payment',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-2',
    amount: 8000,
    category: 'Food & Dining',
    date: `${currentMonth}-05`,
    accountId: 'account-1',
    description: 'Grocery shopping',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-3',
    amount: 5000,
    category: 'Transportation',
    date: `${currentMonth}-08`,
    accountId: 'account-1',
    description: 'Fuel and public transport',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-4',
    amount: 12000,
    category: 'Housing',
    date: `${currentMonth}-10`,
    accountId: 'account-1',
    description: 'Utility bills (electricity, water, internet)',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-5',
    amount: 3000,
    category: 'Entertainment',
    date: `${currentMonth}-12`,
    accountId: 'account-1',
    description: 'Movie tickets and dinner',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-6',
    amount: 6000,
    category: 'Healthcare',
    date: `${currentMonth}-15`,
    accountId: 'account-1',
    description: 'Medical checkup and medicines',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-7',
    amount: 4000,
    category: 'Shopping',
    date: `${currentMonth}-18`,
    accountId: 'account-1',
    description: 'Clothing and personal items',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-8',
    amount: 2500,
    category: 'Food & Dining',
    date: `${currentMonth}-22`,
    accountId: 'account-1',
    description: 'Restaurant meals',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-9',
    amount: 1500,
    category: 'Transportation',
    date: `${currentMonth}-25`,
    accountId: 'account-1',
    description: 'Car maintenance',
    type: 'expense',
    createdAt: new Date().toISOString()
  },
  {
    id: 'expense-10',
    amount: 2000,
    category: 'Education',
    date: `${currentMonth}-28`,
    accountId: 'account-1',
    description: 'Online course subscription',
    type: 'expense',
    createdAt: new Date().toISOString()
  }
];

localStorage.setItem('expenseTransactions', JSON.stringify(expenseTransactions));

// Set up budget categories
const budgetCategories = [
  {
    id: 'budget-1',
    category: 'Housing',
    amount: 30000,
    spent: 27000,
    remaining: 3000
  },
  {
    id: 'budget-2',
    category: 'Food & Dining',
    amount: 15000,
    spent: 10000,
    remaining: 5000
  },
  {
    id: 'budget-3',
    category: 'Transportation',
    amount: 8000,
    spent: 8000,
    remaining: 0
  },
  {
    id: 'budget-4',
    category: 'Healthcare',
    amount: 5000,
    spent: 6000,
    remaining: -1000
  },
  {
    id: 'budget-5',
    category: 'Entertainment',
    amount: 5000,
    spent: 3000,
    remaining: 2000
  },
  {
    id: 'budget-6',
    category: 'Shopping',
    amount: 3000,
    spent: 4000,
    remaining: -1000
  },
  {
    id: 'budget-7',
    category: 'Education',
    amount: 2000,
    spent: 2000,
    remaining: 0
  }
];

localStorage.setItem('budgetCategories', JSON.stringify(budgetCategories));

// Set up savings goals
const savingsGoals = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    targetAmount: 150000,
    currentAmount: 100000,
    targetDate: '2024-12-31',
    priority: 'high',
    isActive: true
  },
  {
    id: 'goal-2',
    name: 'Vacation Fund',
    targetAmount: 50000,
    currentAmount: 25000,
    targetDate: '2024-06-30',
    priority: 'medium',
    isActive: true
  },
  {
    id: 'goal-3',
    name: 'Investment Fund',
    targetAmount: 100000,
    currentAmount: 75000,
    targetDate: '2024-12-31',
    priority: 'medium',
    isActive: true
  }
];

localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals));

// Set up historical data for trends
const historicalData = [
  {
    month: '2024-01',
    totalIncome: 53000,
    totalExpenses: 42000,
    netBalance: 11000,
    savingsRate: 20.8,
    budgetUsagePercent: 84
  },
  {
    month: '2024-02',
    totalIncome: 55000,
    totalExpenses: 45000,
    netBalance: 10000,
    savingsRate: 18.2,
    budgetUsagePercent: 90
  },
  {
    month: '2024-03',
    totalIncome: 53000,
    totalExpenses: 48000,
    netBalance: 5000,
    savingsRate: 9.4,
    budgetUsagePercent: 96
  }
];

localStorage.setItem('historicalData', JSON.stringify(historicalData));

// Set up recurring transactions
const recurringTransactions = [
  {
    id: 'recurring-1',
    type: 'income',
    amount: 45000,
    category: 'Salary',
    frequency: 'monthly',
    nextDate: '2024-05-01',
    isActive: true
  },
  {
    id: 'recurring-2',
    type: 'expense',
    amount: 15000,
    category: 'Housing',
    frequency: 'monthly',
    nextDate: '2024-05-01',
    isActive: true
  },
  {
    id: 'recurring-3',
    type: 'expense',
    amount: 8000,
    category: 'Food & Dining',
    frequency: 'monthly',
    nextDate: '2024-05-01',
    isActive: true
  }
];

localStorage.setItem('recurringTransactions', JSON.stringify(recurringTransactions));

console.log('✅ Test data setup complete!');
console.log('📊 Data Summary:');
console.log(`💰 Total Income: ₱${incomeTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`);
console.log(`💸 Total Expenses: ₱${expenseTransactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}`);
console.log(`🏦 Total Accounts: ${accounts.length}`);
console.log(`🎯 Budget Categories: ${budgetCategories.length}`);
console.log(`💎 Savings Goals: ${savingsGoals.length}`);
console.log(`📈 Historical Months: ${historicalData.length}`);
console.log(`🔄 Recurring Transactions: ${recurringTransactions.length}`);

console.log('\n🚀 You can now refresh your dashboard to see all the test data!');
console.log('📱 All calculations should now be accurate and working properly.');

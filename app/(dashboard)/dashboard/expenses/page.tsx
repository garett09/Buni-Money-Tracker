'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import EditTransactionModal from '@/app/components/EditTransactionModal';
import { toast } from 'react-hot-toast';
import { 
  FiTrendingDown, 
  FiPlus, 
  FiCalendar, 
  FiTag, 
  FiDollarSign, 
  FiTarget, 
  FiBarChart, 
  FiAlertTriangle, 
  FiEdit3, 
  FiTrash2,
  FiBook,
  FiHelpCircle,
  FiInfo,
  FiEye,
  FiTrendingUp,
  FiPieChart,
  FiFilter,
  FiSearch,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiStar,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiCreditCard,
  FiHome,
  FiShoppingCart,
  FiCoffee,
  FiWifi,
  FiPhone,
  FiGift
} from 'react-icons/fi';
import { expenseCategories, spendingInsights } from '@/app/lib/categories';
import { ApiClient } from '@/app/lib/api';
import { updateAccountBalance } from '@/app/lib/accounts';

const ExpensesPage = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: 'monthly',
    billingDate: new Date().toISOString().split('T')[0],
    totalInstallments: 1,
    currentInstallment: 1,
    paidAmount: 0,
    remainingAmount: 0,
    nextBillingDate: '',
    accountId: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showInsights, setShowInsights] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Load accounts from API
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await ApiClient.getAccounts();
        setAccounts(response.accounts || []);
      } catch (error) {
        // Fallback to localStorage
        const savedAccounts = localStorage.getItem('userAccounts');
        if (savedAccounts) {
          setAccounts(JSON.parse(savedAccounts));
        } else {
          setAccounts([]);
        }
      }
    };

    loadAccounts();

    // Listen for localStorage changes to refresh accounts
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userAccounts') {
        if (e.newValue) {
          setAccounts(JSON.parse(e.newValue));
        } else {
          setAccounts([]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Load transactions from API
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const response = await ApiClient.getExpenseTransactions();
        setTransactions(response.transactions || []);
      } catch (error) {
        // Fallback to localStorage for development or when API is not available
        const savedTransactions = localStorage.getItem('expenseTransactions');
        if (savedTransactions) {
          setTransactions(JSON.parse(savedTransactions));
        } else {
          // Load sample transactions only if no saved data exists
          const sampleTransactions = [
            { id: 1, amount: 2500, description: 'Monthly Groceries', category: 'Food & Dining', subcategory: 'Groceries', date: '2024-01-20', recurring: true, billingDate: '2024-01-20', totalInstallments: 12, currentInstallment: 3, paidAmount: 7500, remainingAmount: 22500 },
            { id: 2, amount: 800, description: 'Gas for the month', category: 'Transportation', subcategory: 'Gas/Fuel', date: '2024-01-18', recurring: true, billingDate: '2024-01-18', totalInstallments: 12, currentInstallment: 2, paidAmount: 1600, remainingAmount: 8000 },
            { id: 3, amount: 150, description: 'Coffee with friends', category: 'Food & Dining', subcategory: 'Coffee & Snacks', date: '2024-01-19', recurring: false },
            { id: 4, amount: 1200, description: 'Netflix & Spotify', category: 'Entertainment', subcategory: 'Streaming Services', date: '2024-01-15', recurring: true, billingDate: '2024-01-15', totalInstallments: 12, currentInstallment: 1, paidAmount: 1200, remainingAmount: 13200 }
          ];
          setTransactions(sampleTransactions);
          localStorage.setItem('expenseTransactions', JSON.stringify(sampleTransactions));
        }
      }
    };

    loadTransactions();
  }, []);

  const expenseFeatures = [
    {
      id: 'tracking',
      title: 'Expense Tracking',
      icon: FiEye,
      description: 'Monitor every penny you spend',
      features: [
        'Real-time expense logging',
        'Category-based organization',
        'Receipt management',
        'Date and time tracking',
        'Account association'
      ]
    },
    {
      id: 'categorization',
      title: 'Smart Categorization',
      icon: FiTag,
      description: 'Organize expenses automatically',
      features: [
        'Predefined categories',
        'Custom subcategories',
        'Auto-categorization',
        'Category insights',
        'Spending patterns'
      ]
    },
    {
      id: 'recurring',
      title: 'Recurring Expenses',
      icon: FiRefreshCw,
      description: 'Manage regular bills and subscriptions',
      features: [
        'Monthly subscriptions',
        'Installment tracking',
        'Due date reminders',
        'Payment progress',
        'Auto-renewal alerts'
      ]
    },
    {
      id: 'analytics',
      title: 'Spending Analytics',
      icon: FiBarChart,
      description: 'Understand your spending habits',
      features: [
        'Category breakdowns',
        'Trend analysis',
        'Budget comparisons',
        'Spending insights',
        'Historical data'
      ]
    }
  ];

  const expenseManagementTips = [
    {
      icon: FiTarget,
      title: 'Set Spending Limits',
      description: 'Establish monthly budgets for each category to control your expenses effectively.'
    },
    {
      icon: FiEye,
      title: 'Track Everything',
      description: 'Record even small expenses to get a complete picture of your spending habits.'
    },
    {
      icon: FiTag,
      title: 'Use Categories',
      description: 'Properly categorize expenses to identify areas where you can cut back.'
    },
    {
      icon: FiTrendingUp,
      title: 'Review Regularly',
      description: 'Analyze your spending patterns weekly to stay on track with your financial goals.'
    }
  ];

  const gettingStartedSteps = [
    {
      step: 1,
      title: 'Add Your First Expense',
      description: 'Start by recording a simple expense like coffee or groceries.'
    },
    {
      step: 2,
      title: 'Set Up Categories',
      description: 'Organize your expenses into meaningful categories for better tracking.'
    },
    {
      step: 3,
      title: 'Track Recurring Bills',
      description: 'Add monthly subscriptions and regular bills to stay on top of payments.'
    },
    {
      step: 4,
      title: 'Analyze Patterns',
      description: 'Review your spending analytics to identify opportunities for savings.'
    }
  ];

  const getTotalExpenses = () => {
    return transactions.reduce((total, transaction) => total + (transaction.amount || 0), 0);
  };

  const getCategoryBreakdown = () => {
    const breakdown: { [key: string]: number } = {};
    transactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      breakdown[category] = (breakdown[category] || 0) + (transaction.amount || 0);
    });
    return breakdown;
  };

  const getRecurringExpenses = () => {
    return transactions.filter(transaction => transaction.recurring);
  };

  const getRecentExpenses = () => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const handleAddExpense = () => {
    // Implementation for adding new expense
    toast.success('Add expense functionality coming soon!');
  };

  const handleEditExpense = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDeleteExpense = (transactionId: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedTransactions = transactions.filter(t => t.id !== transactionId);
      setTransactions(updatedTransactions);
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      toast.success('Expense deleted successfully');
    }
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setEditingTransaction(null);
  };

  const handleTransactionUpdate = (updatedTransaction: any) => {
    if (editingTransaction) {
      const updatedTransactions = transactions.map(t => 
        t.id === editingTransaction.id ? { ...t, ...updatedTransaction } : t
      );
      setTransactions(updatedTransactions);
      localStorage.setItem('expenseTransactions', JSON.stringify(updatedTransactions));
      toast.success('Expense updated successfully');
    }
    handleModalClose();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Expense Tracking</h1>
              <p className="text-red-100 text-lg">
                Monitor and control your spending habits
              </p>
            </div>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              title="Expense Tracking Help"
            >
              <FiHelpCircle size={24} />
            </button>
          </div>
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FiBook className="text-red-500" size={28} />
              Expense Tracking Guide
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Features</h3>
                <div className="space-y-3">
                  {expenseFeatures.map((feature) => (
                    <div 
                      key={feature.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        activeTab === feature.id
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600'
                      }`}
                      onClick={() => setActiveTab(feature.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <feature.icon className="text-red-600 dark:text-red-400" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.features.map((feat, index) => (
                          <li key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <FiCheckCircle size={12} className="text-green-500" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Management Tips</h3>
                <div className="space-y-3">
                  {expenseManagementTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <tip.icon className="text-red-600 dark:text-red-400" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{tip.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiInfo className="text-blue-500" size={20} />
                Getting Started with Expense Tracking
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {gettingStartedSteps.map((step) => (
                    <li key={step.step} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <span className="font-medium">{step.title}</span>
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Expense Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FiDollarSign className="text-red-600 dark:text-red-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₱{getTotalExpenses().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiTag className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Categories</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{Object.keys(getCategoryBreakdown()).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiRefreshCw className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Recurring</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{getRecurringExpenses().length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FiTrendingDown className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Transactions</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Management Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddExpense}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FiPlus size={20} />
            Add New Expense
          </button>
          
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiBarChart size={20} />
            {showInsights ? 'Hide Insights' : 'Show Insights'}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiRefreshCw size={20} />
            Refresh Data
          </button>
        </div>

        {/* Spending Insights */}
        {showInsights && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiBarChart className="text-blue-500" size={24} />
              Spending Insights
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Category Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(getCategoryBreakdown())
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([category, amount]) => (
                      <div key={category} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{category}</span>
                        <span className="font-medium text-gray-900 dark:text-white">₱{amount.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Recent Expenses</h3>
                <div className="space-y-2">
                  {getRecentExpenses().map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{expense.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{expense.category}</p>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">₱{expense.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Expenses</h2>
            <p className="text-gray-600 dark:text-gray-300">Track and manage all your spending</p>
          </div>
          
          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                <FiTrendingDown className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No expenses yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Start tracking your expenses to gain insights into your spending habits
              </p>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <FiDollarSign className="text-red-600 dark:text-red-400" size={24} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{transaction.description}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.category} • {transaction.subcategory} • {transaction.date}
                        </p>
                        {transaction.recurring && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                            Recurring • Installment {transaction.currentInstallment}/{transaction.totalInstallments}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₱{transaction.amount?.toLocaleString() || '0'}
                        </p>
                        {transaction.recurring && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Remaining: ₱{transaction.remainingAmount?.toLocaleString() || '0'}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditExpense(transaction)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit Expense"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(transaction.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete Expense"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

                 {/* Edit Transaction Modal */}
         {showEditModal && (
           <EditTransactionModal
             isOpen={showEditModal}
             onClose={handleModalClose}
             type="expense"
             onUpdate={handleTransactionUpdate}
             onDelete={handleDeleteExpense}
             transaction={editingTransaction}
           />
         )}
      </div>
    </DashboardLayout>
  );
};

export default ExpensesPage;

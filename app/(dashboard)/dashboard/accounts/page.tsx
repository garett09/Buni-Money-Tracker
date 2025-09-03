'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import AccountModal from '@/app/components/AccountModal';
import LoadingStates from '@/app/components/LoadingStates';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, 
  FiCreditCard, 
  FiDollarSign, 
  FiEdit3, 
  FiTrash2, 
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiHome,
  FiBook,
  FiHelpCircle,
  FiInfo,
  FiTarget,
  FiShield,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiStar,
  FiCheckCircle,
  FiAlertTriangle,
  FiTrendingUp as FiTrendingUpIcon,
  FiTrendingDown as FiTrendingDownIcon
} from 'react-icons/fi';
import { 
  philippineBanks, 
  creditCards, 
  digitalWallets, 
  getBankById,
  getCreditCardById,
  getDigitalWalletById,
  getAccountTypeById
} from '@/app/lib/accounts';
import { ApiClient } from '@/app/lib/api';
import { requireAuth } from '@/app/lib/auth';

const AccountsPage = () => {
  // Check authentication on component mount
  useEffect(() => {
    requireAuth();
  }, []);

  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
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

    // Listen for custom accounts updated event
    const handleAccountsUpdated = (e: CustomEvent) => {
      setAccounts(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('accountsUpdated', handleAccountsUpdated as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('accountsUpdated', handleAccountsUpdated as EventListener);
    };
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.getAccounts();
      setAccounts(response.accounts || []);
    } catch (error) {
      // Fallback to localStorage
      const savedAccounts = localStorage.getItem('userAccounts');
      if (savedAccounts) {
        setAccounts(JSON.parse(savedAccounts));
      } else {
        // Load sample accounts
        const sampleAccounts = [
          {
            id: 1,
            name: 'BPI Savings',
            accountType: 'savings',
            bankId: 'bpi',
            accountNumber: '****1234',
            currentBalance: 50000,
            description: 'Main savings account',
            isActive: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: 'GCash Wallet',
            accountType: 'digital-wallet',
            digitalWalletId: 'gcash',
            accountNumber: '****5678',
            currentBalance: 5000,
            description: 'Daily expenses wallet',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ];
        setAccounts(sampleAccounts);
        localStorage.setItem('userAccounts', JSON.stringify(sampleAccounts));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowModal(true);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDeleteAccount = async (accountId: number) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      try {
        await ApiClient.deleteAccount(accountId);
        toast.success('Account deleted successfully');
        loadAccounts();
      } catch (error) {
        // Fallback to localStorage
        const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
        setAccounts(updatedAccounts);
        localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
        toast.success('Account deleted successfully');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAccount(null);
  };

  const handleAccountUpdate = (updatedAccount: any) => {
    if (editingAccount) {
      // Update existing account
      const updatedAccounts = accounts.map(acc => 
        acc.id === editingAccount.id ? { ...acc, ...updatedAccount } : acc
      );
      setAccounts(updatedAccounts);
      localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
      toast.success('Account updated successfully');
    } else {
      // Add new account
      const newAccount = {
        ...updatedAccount,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);
      localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
      toast.success('Account added successfully');
    }
    handleModalClose();
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + (account.currentBalance || 0), 0);
  };

  const getAccountTypeCount = (type: string) => {
    return accounts.filter(account => account.accountType === type).length;
  };

  const getAccountTypeBalance = (type: string) => {
    return accounts
      .filter(account => account.accountType === type)
      .reduce((total, account) => total + (account.currentBalance || 0), 0);
  };

  const accountTypes = [
    { id: 'checking', name: 'Checking', icon: FiCreditCard, color: 'text-blue-600' },
    { id: 'savings', name: 'Savings', icon: FiDollarSign, color: 'text-green-600' },
    { id: 'credit-card', name: 'Credit Card', icon: FiCreditCard, color: 'text-purple-600' },
    { id: 'digital-wallet', name: 'Digital Wallet', icon: FiHome, color: 'text-orange-600' },
    { id: 'investment', name: 'Investment', icon: FiTrendingUp, color: 'text-indigo-600' }
  ];

  const accountManagementTips = [
    {
      icon: FiTarget,
      title: 'Organize by Purpose',
      description: 'Group accounts by their primary purpose (daily expenses, savings, investments) for better management.'
    },
    {
      icon: FiEye,
      title: 'Regular Reconciliation',
      description: 'Reconcile your account balances regularly to ensure accuracy and catch any discrepancies early.'
    },
    {
      icon: FiShield,
      title: 'Security First',
      description: 'Never store actual account passwords in the app. Use nicknames and partial account numbers instead.'
    },
    {
      icon: FiRefreshCw,
      title: 'Keep Updated',
      description: 'Update account balances regularly, especially after major transactions or monthly statements.'
    }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingStates type="accounts" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Account Management</h1>
              <p className="text-green-100 text-lg">
                Manage all your financial accounts in one place
              </p>
            </div>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              title="Account Management Help"
            >
              <FiHelpCircle size={24} />
            </button>
          </div>
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FiBook className="text-green-500" size={28} />
              Account Management Guide
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Types</h3>
                <div className="space-y-3">
                  {accountTypes.map((type) => (
                    <div key={type.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <type.icon className={`${type.color}`} size={20} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{type.name}</h4>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {getAccountTypeCount(type.id)} accounts • ₱{getAccountTypeBalance(type.id).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Management Tips</h3>
                <div className="space-y-3">
                  {accountManagementTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <tip.icon className="text-green-600 dark:text-green-400" size={16} />
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
                Getting Started with Accounts
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">1</span>
                    <span>Add your primary checking and savings accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">2</span>
                    <span>Set accurate current balances for each account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">3</span>
                    <span>Use descriptive nicknames for easy identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">4</span>
                    <span>Regularly update balances and reconcile statements</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Account Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiDollarSign className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₱{getTotalBalance().toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiHome className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Accounts</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{accounts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FiTrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Accounts</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{accounts.filter(acc => acc.isActive).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <FiPieChart className="text-orange-600 dark:text-orange-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account Types</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{new Set(accounts.map(acc => acc.accountType)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddAccount}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiPlus size={20} />
            Add New Account
          </button>
          
          <button
            onClick={loadAccounts}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiRefreshCw size={20} />
            Refresh Accounts
          </button>
        </div>

        {/* Accounts List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Accounts</h2>
            <p className="text-gray-600 dark:text-gray-300">Manage and monitor all your financial accounts</p>
          </div>
          
          {accounts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto mb-4 flex items-center justify-center">
                <FiHome className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No accounts yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Get started by adding your first financial account
              </p>
              <button
                onClick={handleAddAccount}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Your First Account
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {accounts.map((account) => (
                <div key={account.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        {account.accountType === 'credit-card' ? (
                          <FiCreditCard className="text-green-600 dark:text-green-400" size={24} />
                        ) : account.accountType === 'digital-wallet' ? (
                          <FiHome className="text-green-600 dark:text-green-400" size={24} />
                        ) : (
                          <FiDollarSign className="text-green-600 dark:text-green-400" size={24} />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{account.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {getAccountTypeById(account.accountType)?.name || account.accountType} • {account.accountNumber}
                        </p>
                        {account.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{account.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ₱{account.currentBalance?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {account.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit Account"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete Account"
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

        {/* Account Modal */}
        {showModal && (
          <AccountModal
            isOpen={showModal}
            onClose={handleModalClose}
            onSave={handleAccountUpdate}
            account={editingAccount}
            banks={philippineBanks}
            creditCards={creditCards}
            digitalWallets={digitalWallets}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AccountsPage;

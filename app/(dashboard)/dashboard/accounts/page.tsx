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
  FiHome
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

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

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

  const handleSaveAccount = async (accountData: any) => {
    try {
      if (editingAccount) {
        // Update existing account
        await ApiClient.updateAccount(editingAccount.id, accountData);
        
        const updatedAccounts = accounts.map(acc => 
          acc.id === editingAccount.id ? { ...acc, ...accountData } : acc
        );
        setAccounts(updatedAccounts);
        
        // Update localStorage as backup
        localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
        
        toast.success('Account updated successfully and saved to database!');
      } else {
        // Add new account
        const response = await ApiClient.addAccount(accountData);
        const newAccount = response.account;
        
        const updatedAccounts = [newAccount, ...accounts];
        setAccounts(updatedAccounts);
        
        // Update localStorage as backup
        localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
        
        toast.success('Account added successfully and saved to database!');
      }
    } catch (error) {
      // Fallback to localStorage
      if (editingAccount) {
        const updatedAccounts = accounts.map(acc => 
          acc.id === editingAccount.id ? { ...acc, ...accountData } : acc
        );
        setAccounts(updatedAccounts);
        localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
        toast.success('Account updated successfully (saved locally)!');
      } else {
        const newAccount = {
          ...accountData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        };
        const updatedAccounts = [newAccount, ...accounts];
        setAccounts(updatedAccounts);
        localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
        toast.success('Account added successfully (saved locally)!');
      }
    }
  };

  const handleDeleteAccount = async (accountId: number) => {
    try {
      await ApiClient.deleteAccount(accountId);
      
      const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
      setAccounts(updatedAccounts);
      
      // Update localStorage as backup
      localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
      
      toast.success('Account deleted successfully and removed from database!');
    } catch (error) {
      // Fallback to localStorage
      const updatedAccounts = accounts.filter(acc => acc.id !== accountId);
      setAccounts(updatedAccounts);
      localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
      toast.success('Account deleted successfully (removed locally)!');
    }
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowModal(true);
  };

  const getInstitutionInfo = (account: any) => {
    switch (account.accountType) {
      case 'credit-card':
        return getCreditCardById(account.creditCardId);
      case 'digital-wallet':
        return getDigitalWalletById(account.digitalWalletId);
      default:
        return getBankById(account.bankId);
    }
  };

  const getAccountTypeInfo = (accountType: string) => {
    return getAccountTypeById(accountType);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + (account.currentBalance || 0), 0);
  const activeAccounts = accounts.filter(acc => acc.isActive);
  const inactiveAccounts = accounts.filter(acc => !acc.isActive);

  // Show loading state while accounts are being loaded
  if (loading) {
    return (
      <DashboardLayout>
        <LoadingStates type="accounts" size="large" message="Loading your accounts..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl">
                <FiCreditCard size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  My Accounts
                </h1>
                <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>
                  Manage your bank accounts, credit cards, and digital wallets
                </p>
              </div>
            </div>
            <button
              onClick={handleAddAccount}
              className="liquid-button py-4 px-8 font-bold text-lg flex items-center gap-3 rounded-2xl hover:scale-105 transition-all duration-300"
              style={{ color: 'var(--text-primary)' }}
            >
              <FiPlus size={24} />
              Add Account
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiDollarSign size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Balance</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>₱{totalBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiHome size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Active Accounts</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>{activeAccounts.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiCreditCard size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Credit Cards</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>{accounts.filter(acc => acc.accountType === 'credit-card').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden">
            <div className="liquid-card p-8 rounded-3xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FiPieChart size={28} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Digital Wallets</p>
                    <p className="font-bold text-3xl" style={{ color: 'var(--text-primary)' }}>{accounts.filter(acc => acc.accountType === 'digital-wallet').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading accounts...</p>
            </div>
          ) : accounts.length > 0 ? (
            <>
              {/* Active Accounts */}
              {activeAccounts.length > 0 && (
                <div>
                  <h2 className="text-display text-2xl font-semibold text-white mb-4">Active Accounts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeAccounts.map((account) => {
                      const institution = getInstitutionInfo(account);
                      const accountType = getAccountTypeInfo(account.accountType);
                      
                      return (
                        <div key={account.id} className="liquid-card p-6 hover:scale-105 transition-transform group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${institution?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                                <span className="text-white text-xl">{institution?.icon || '🏦'}</span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg">{account.name}</h3>
                                <p className="text-white/60 text-sm">{institution?.name || 'Unknown Institution'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditAccount(account)}
                                className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                                title="Edit account"
                              >
                                <FiEdit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteAccount(account.id)}
                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                                title="Delete account"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white/60 text-sm">Account Type</span>
                              <span className="text-white font-medium">{accountType?.icon} {accountType?.name}</span>
                            </div>
                            
                            {account.accountNumber && (
                              <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Account Number</span>
                                <span className="text-white font-medium">{account.accountNumber}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-white/60 text-sm">Current Balance</span>
                              <span className="text-green-400 font-semibold text-lg">₱{account.currentBalance?.toLocaleString() || '0'}</span>
                            </div>
                            
                            {account.description && (
                              <div className="pt-2 border-t border-white/10">
                                <p className="text-white/70 text-sm">{account.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inactive Accounts */}
              {inactiveAccounts.length > 0 && (
                <div>
                  <h2 className="text-display text-2xl font-semibold text-white mb-4">Inactive Accounts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inactiveAccounts.map((account) => {
                      const institution = getInstitutionInfo(account);
                      const accountType = getAccountTypeInfo(account.accountType);
                      
                      return (
                        <div key={account.id} className="liquid-card p-6 opacity-60 group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${institution?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
                                <span className="text-white text-xl">{institution?.icon || '🏦'}</span>
                              </div>
                              <div>
                                <h3 className="text-white font-semibold text-lg">{account.name}</h3>
                                <p className="text-white/60 text-sm">{institution?.name || 'Unknown Institution'}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditAccount(account)}
                                className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-colors"
                                title="Edit account"
                              >
                                <FiEdit3 size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteAccount(account.id)}
                                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                                title="Delete account"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-white/60 text-sm">Account Type</span>
                              <span className="text-white font-medium">{accountType?.icon} {accountType?.name}</span>
                            </div>
                            
                            {account.accountNumber && (
                              <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Account Number</span>
                                <span className="text-white font-medium">{account.accountNumber}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-white/60 text-sm">Current Balance</span>
                              <span className="text-green-400 font-semibold text-lg">₱{account.currentBalance?.toLocaleString() || '0'}</span>
                            </div>
                            
                            {account.description && (
                              <div className="pt-2 border-t border-white/10">
                                <p className="text-white/70 text-sm">{account.description}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="liquid-card p-12 text-center">
              <FiCreditCard size={64} className="text-white/30 mx-auto mb-6" />
              <h3 className="text-display text-2xl font-semibold text-white mb-4">No Accounts Yet</h3>
              <p className="text-white/60 mb-8">
                Add your bank accounts, credit cards, and digital wallets to start tracking your finances.
              </p>
              <button
                onClick={handleAddAccount}
                className="liquid-button text-white py-3 px-8 font-medium flex items-center gap-2 mx-auto"
              >
                <FiPlus size={20} />
                Add Your First Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Account Modal */}
      <AccountModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingAccount(null);
        }}
        account={editingAccount}
        onSave={handleSaveAccount}
        onDelete={handleDeleteAccount}
      />
    </DashboardLayout>
  );
};

export default AccountsPage;

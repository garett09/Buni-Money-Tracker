'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiCreditCard, 
  FiDollarSign, 
  FiEye, 
  FiEyeOff, 
  FiRefreshCw,
  FiPlus,
  FiTrendingUp,
  FiTrendingDown,
  FiHome,
  FiSmartphone
} from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';
import { toast } from 'react-hot-toast';

interface Account {
  id: number;
  name: string;
  accountType: string;
  currentBalance: number;
  accountNumber?: string;
  bankId?: string;
  digitalWalletId?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface AccountBalanceProps {
  className?: string;
}

const AccountBalance: React.FC<AccountBalanceProps> = ({ className = '' }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAccounts = async () => {
    try {
      const response = await ApiClient.getAccounts();
      const validAccounts = response.accounts?.filter((account: any) => 
        account && account.isActive && typeof account.currentBalance === 'number'
      ) || [];
      setAccounts(validAccounts);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      // Fallback to localStorage if API fails
      const savedAccounts = localStorage.getItem('accounts');
      if (savedAccounts) {
        try {
          const parsedAccounts = JSON.parse(savedAccounts);
          setAccounts(parsedAccounts.filter((account: any) => account && account.isActive));
        } catch (parseError) {
          console.error('Failed to parse saved accounts:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAccounts();
    setRefreshing(false);
    toast.success('Account balances refreshed');
  };

  const getAccountIcon = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'savings':
      case 'checking':
        return <FiHome size={20} />;
      case 'digital-wallet':
      case 'ewallet':
        return <FiSmartphone size={20} />;
      case 'credit':
        return <FiCreditCard size={20} />;
      default:
        return <FiCreditCard size={20} />;
    }
  };

  const getAccountTypeColor = (accountType: string) => {
    switch (accountType.toLowerCase()) {
      case 'savings':
        return 'text-green-400';
      case 'checking':
        return 'text-blue-400';
      case 'digital-wallet':
      case 'ewallet':
        return 'text-purple-400';
      case 'credit':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.currentBalance, 0);
  const hasMultipleAccounts = accounts.length > 1;

  if (loading) {
    return (
      <div className={`liquid-card p-6 rounded-3xl ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-white/10 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`liquid-card p-6 rounded-3xl ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiCreditCard size={24} style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Account Balance
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            title={showBalances ? 'Hide balances' : 'Show balances'}
          >
            {showBalances ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
            title="Refresh balances"
          >
            <FiRefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Total Balance */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            Total Balance
          </span>
          <div className="flex items-center gap-2">
            {totalBalance >= 0 ? (
              <FiTrendingUp size={16} className="text-green-400" />
            ) : (
              <FiTrendingDown size={16} className="text-red-400" />
            )}
          </div>
        </div>
        <div className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {showBalances ? `₱${totalBalance.toLocaleString()}` : '₱••••••'}
        </div>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Individual Accounts */}
      {accounts.length > 0 ? (
        <div className="space-y-4">
          <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Account Details
          </h4>
          {accounts.map((account) => (
            <div key={account.id} className="p-4 rounded-xl bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/10 ${getAccountTypeColor(account.accountType)}`}>
                    {getAccountIcon(account.accountType)}
                  </div>
                  <div>
                    <h5 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {account.name}
                    </h5>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                      {account.accountNumber && ` • ${account.accountNumber}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${account.currentBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {showBalances ? `₱${account.currentBalance.toLocaleString()}` : '₱••••••'}
                  </div>
                  {hasMultipleAccounts && (
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {((account.currentBalance / totalBalance) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
              {account.description && (
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                  {account.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiCreditCard size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No accounts found</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            Add your bank accounts and digital wallets to track balances
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 mx-auto">
            <FiPlus size={16} />
            Add Account
          </button>
        </div>
      )}

      {/* Quick Stats */}
      {accounts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Active Accounts</div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {accounts.filter(a => a.isActive).length}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Account Types</div>
              <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {new Set(accounts.map(a => a.accountType)).size}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountBalance;

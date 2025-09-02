'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiTrendingDown, FiUser, FiCalendar, FiTag } from 'react-icons/fi';
import { ApiClient } from '@/app/lib/api';

interface SharedExpensesViewProps {
  sharingEnabled: boolean;
  partnerInfo?: any;
}

const SharedExpensesView: React.FC<SharedExpensesViewProps> = ({ sharingEnabled, partnerInfo }) => {
  const [sharedExpenses, setSharedExpenses] = useState<any[]>([]);
  const [userExpenses, setUserExpenses] = useState<any[]>([]);
  const [partnerExpenses, setPartnerExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'combined' | 'separate'>('combined');

  useEffect(() => {
    if (sharingEnabled) {
      loadSharedExpenses();
    }
  }, [sharingEnabled]);

  const loadSharedExpenses = async () => {
    setLoading(true);
    try {
      const response = await ApiClient.getSharedExpenses();
      setSharedExpenses(response.sharedExpenses || []);
      setUserExpenses(response.userExpenses || []);
      setPartnerExpenses(response.partnerExpenses || []);
    } catch (error) {
      // Fallback to localStorage
      const savedUserExpenses = localStorage.getItem('expenseTransactions');
      const savedPartnerExpenses = localStorage.getItem('partnerExpenseTransactions');
      
      if (savedUserExpenses) {
        const userExpenses = JSON.parse(savedUserExpenses);
        setUserExpenses(userExpenses.map((expense: any) => ({
          ...expense,
          userId: 'current',
          userName: 'You',
          userEmail: 'current@user.com'
        })));
      }
      
      if (savedPartnerExpenses) {
        const partnerExpenses = JSON.parse(savedPartnerExpenses);
        setPartnerExpenses(partnerExpenses.map((expense: any) => ({
          ...expense,
          userId: 'partner',
          userName: partnerInfo?.name || 'Partner',
          userEmail: partnerInfo?.email || 'partner@user.com'
        })));
      }
      
      const allExpenses = [
        ...(savedUserExpenses ? JSON.parse(savedUserExpenses).map((expense: any) => ({
          ...expense,
          userId: 'current',
          userName: 'You',
          userEmail: 'current@user.com'
        })) : []),
        ...(savedPartnerExpenses ? JSON.parse(savedPartnerExpenses).map((expense: any) => ({
          ...expense,
          userId: 'partner',
          userName: partnerInfo?.name || 'Partner',
          userEmail: partnerInfo?.email || 'partner@user.com'
        })) : [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setSharedExpenses(allExpenses);
    } finally {
      setLoading(false);
    }
  };

  const totalUserExpenses = userExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPartnerExpenses = partnerExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalCombinedExpenses = totalUserExpenses + totalPartnerExpenses;

  const getExpenseColor = (userId: string) => {
    return userId === 'current' || userId === 'You' ? 'text-blue-400' : 'text-pink-400';
  };

  const getExpenseBg = (userId: string) => {
    return userId === 'current' || userId === 'You' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-pink-500/10 border-pink-500/20';
  };

  if (!sharingEnabled) {
    return (
      <div className="liquid-card p-6">
        <div className="text-center">
          <FiUsers size={48} className="text-white/30 mx-auto mb-4" />
          <h3 className="text-display text-xl font-semibold text-white mb-2">No Shared Expenses</h3>
          <p className="text-white/60">
            Enable expense sharing to see combined expenses with your partner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="liquid-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FiUser size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Your Expenses</p>
              <p className="text-blue-400 text-lg font-semibold">₱{totalUserExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="liquid-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <FiUser size={16} className="text-pink-400" />
            </div>
            <div>
              <p className="text-white font-medium">{partnerInfo?.name || 'Partner'}'s Expenses</p>
              <p className="text-pink-400 text-lg font-semibold">₱{totalPartnerExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="liquid-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <FiUsers size={16} className="text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">Combined Total</p>
              <p className="text-purple-400 text-lg font-semibold">₱{totalCombinedExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-4">
        <span className="text-white/80 text-sm">View:</span>
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => setViewMode('combined')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'combined'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Combined
          </button>
          <button
            onClick={() => setViewMode('separate')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'separate'
                ? 'bg-white/20 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Separate
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="liquid-card p-6">
        <h3 className="text-display text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FiTrendingDown size={20} />
          {viewMode === 'combined' ? 'Combined Expenses' : 'Expenses by User'}
        </h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Loading shared expenses...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {viewMode === 'combined' ? (
              sharedExpenses.length > 0 ? (
                sharedExpenses.map((expense) => (
                  <div key={`${expense.userId}-${expense.id}`} className={`p-4 rounded-xl border ${getExpenseBg(expense.userId)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getExpenseBg(expense.userId)} ${getExpenseColor(expense.userId)}`}>
                            {expense.userName}
                          </span>
                          <span className="text-white/60 text-sm">{expense.category}</span>
                        </div>
                        <p className="text-white font-medium">{expense.description}</p>
                        <p className="text-white/60 text-sm flex items-center gap-1">
                          <FiCalendar size={12} />
                          {new Date(expense.date).toLocaleDateString()}
                          <span className="mx-2">•</span>
                          <FiTag size={12} />
                          {expense.subcategory}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-semibold ${getExpenseColor(expense.userId)}`}>
                          -₱{expense.amount.toLocaleString()}
                        </span>
                        {expense.recurring && (
                          <p className="text-white/50 text-xs">Recurring</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiTrendingDown size={48} className="text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No shared expenses yet</p>
                </div>
              )
            ) : (
              <div className="space-y-6">
                {/* Your Expenses */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    Your Expenses ({userExpenses.length})
                  </h4>
                  <div className="space-y-2">
                    {userExpenses.length > 0 ? (
                      userExpenses.map((expense) => (
                        <div key={expense.id} className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{expense.description}</p>
                              <p className="text-white/60 text-sm">{expense.subcategory} • {new Date(expense.date).toLocaleDateString()}</p>
                            </div>
                            <span className="text-blue-400 font-semibold">-₱{expense.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60 text-sm">No expenses recorded yet</p>
                    )}
                  </div>
                </div>

                {/* Partner's Expenses */}
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                    {partnerInfo?.name || 'Partner'}'s Expenses ({partnerExpenses.length})
                  </h4>
                  <div className="space-y-2">
                    {partnerExpenses.length > 0 ? (
                      partnerExpenses.map((expense) => (
                        <div key={expense.id} className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{expense.description}</p>
                              <p className="text-white/60 text-sm">{expense.subcategory} • {new Date(expense.date).toLocaleDateString()}</p>
                            </div>
                            <span className="text-pink-400 font-semibold">-₱{expense.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-white/60 text-sm">No expenses recorded yet</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedExpensesView;

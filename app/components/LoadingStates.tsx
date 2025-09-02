'use client';

import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget, FiPieChart, FiBarChart, FiActivity, FiEye, FiZap, FiAlertTriangle, FiCheckCircle, FiStar, FiShield, FiClock, FiCreditCard, FiAlertCircle, FiInfo, FiRefreshCw, FiSettings, FiDownload, FiUpload, FiFilter, FiSearch, FiX, FiHome, FiUsers, FiDatabase, FiList } from 'react-icons/fi';

interface LoadingStatesProps {
  type: 'dashboard' | 'charts' | 'cards' | 'table' | 'form' | 'charts' | 'analytics' | 'budget' | 'expenses' | 'income' | 'savings' | 'accounts' | 'transactions' | 'shared' | 'data';
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({ 
  type, 
  size = 'medium', 
  message 
}) => {
  const getLoadingContent = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Financial Health Score Loading */}
            <div className="liquid-card p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
                <div className="h-6 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Circular Progress Loading */}
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-12 w-16 bg-emerald-500/20 rounded-lg animate-pulse mx-auto mb-2" />
                        <div className="h-4 w-8 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
                      </div>
                    </div>
                  </div>
                  <div className="h-6 w-32 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
                </div>
                
                {/* Stats Loading */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-emerald-500/20 rounded animate-pulse" />
                        <div className="h-4 w-24 bg-emerald-500/20 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-16 bg-emerald-500/20 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl liquid-card">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-emerald-500/20 rounded animate-pulse" />
                        <div className="h-4 w-28 bg-emerald-500/20 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-12 bg-emerald-500/20 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Charts Loading */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="liquid-card p-8 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="h-8 w-40 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
                    <div className="w-6 h-6 bg-emerald-500/20 rounded animate-pulse" />
                  </div>
                  
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-emerald-500/20 rounded animate-pulse" />
                          <div className="h-4 w-32 bg-emerald-500/20 rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-20 bg-emerald-500/20 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'charts':
        return (
          <div className="space-y-6">
            {/* Chart Header Loading */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Chart Area Loading */}
            <div className="h-80 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <FiBarChart size={32} className="text-emerald-400/50" />
                </div>
                <div className="h-4 w-32 bg-emerald-500/20 rounded-lg animate-pulse mx-auto mb-2" />
                <div className="h-3 w-48 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
              </div>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="liquid-card p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-emerald-500/20 rounded-lg animate-pulse mb-2" />
                    <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-emerald-500/20 rounded-lg animate-pulse" />
                  <div className="h-4 w-3/4 bg-emerald-500/20 rounded-lg animate-pulse" />
                  <div className="h-4 w-1/2 bg-emerald-500/20 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'table':
        return (
          <div className="space-y-4">
            {/* Table Header Loading */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="h-6 w-32 bg-emerald-500/20 rounded-lg animate-pulse" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Table Rows Loading */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-emerald-500/20 rounded-lg animate-pulse" />
                  <div className="h-3 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                </div>
                <div className="h-4 w-20 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="h-4 w-16 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="w-20 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>
        );

      case 'form':
        return (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="h-12 w-full bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
              <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
              <div className="flex gap-2">
                {['Trends', 'Insights', 'Budget', 'Predictions', 'Historical'].map((tab, i) => (
                  <div key={tab} className="w-20 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="liquid-card p-6 rounded-2xl text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
                  </div>
                  <div className="h-6 w-24 bg-emerald-500/20 rounded-lg animate-pulse mx-auto mb-2" />
                  <div className="h-4 w-32 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            {/* Budget Overview Loading */}
            <div className="liquid-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-32 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="w-6 h-6 bg-emerald-500/20 rounded animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="h-4 w-3/4 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="h-4 w-1/2 bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
            </div>
            
            {/* Budget Categories Loading */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="liquid-card p-4 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-emerald-500/20 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="h-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full animate-pulse" style={{ width: `${Math.random() * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'expenses':
      case 'income':
        return (
          <div className="space-y-6">
            {/* Transaction Header */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
              <div className="flex gap-3">
                <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
            </div>
            
            {/* Transaction List */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="liquid-card p-4 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-emerald-500/20 rounded-lg animate-pulse mb-2" />
                      <div className="h-3 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-20 bg-emerald-500/20 rounded-lg animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-emerald-500/20 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'savings':
        return (
          <div className="space-y-6">
            {/* Savings Goals Header */}
            <div className="liquid-card p-6 rounded-2xl text-center">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse mx-auto mb-4" />
              <div className="h-4 w-64 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
            </div>
            
            {/* Savings Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="liquid-card p-6 rounded-2xl">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                      <FiTarget size={32} className="text-emerald-400/50" />
                    </div>
                    <div className="h-5 w-32 bg-emerald-500/20 rounded-lg animate-pulse mx-auto mb-2" />
                    <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 mb-3">
                    <div className="h-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full animate-pulse" style={{ width: `${Math.random() * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="h-3 w-16 bg-emerald-500/20 rounded-lg animate-pulse" />
                    <div className="h-3 w-16 bg-emerald-500/20 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'accounts':
        return (
          <div className="space-y-6">
            {/* Accounts Header */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
              <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
            </div>
            
            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="liquid-card p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 w-24 bg-emerald-500/20 rounded-lg animate-pulse mb-2" />
                      <div className="h-4 w-20 bg-emerald-500/20 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-6 w-32 bg-emerald-500/20 rounded-lg animate-pulse" />
                    <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                    <div className="h-4 w-20 bg-emerald-500/20 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-6">
            {/* Transactions Header */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
              <div className="flex gap-3">
                <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
            </div>
            
            {/* Transactions Table */}
            <div className="liquid-card rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10">
                <div className="grid grid-cols-6 gap-4">
                  {['Date', 'Description', 'Category', 'Amount', 'Account', 'Actions'].map((header, i) => (
                    <div key={header} className="h-4 w-20 bg-emerald-500/20 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
              
              <div className="divide-y divide-white/10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="p-4">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="h-4 w-20 bg-emerald-500/20 rounded-lg animate-pulse" />
                      <div className="h-4 w-32 bg-emerald-500/20 rounded-lg animate-pulse" />
                      <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                      <div className="h-4 w-20 bg-emerald-500/20 rounded-lg animate-pulse" />
                      <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'shared':
        return (
          <div className="space-y-6">
            {/* Shared Expenses Header */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
              <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
            </div>
            
            {/* Shared Expenses List */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="liquid-card p-6 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 w-32 bg-emerald-500/20 rounded-lg animate-pulse mb-2" />
                      <div className="h-4 w-24 bg-emerald-500/20 rounded-lg animate-pulse" />
                    </div>
                    <div className="text-right">
                      <div className="h-5 w-20 bg-emerald-500/20 rounded-lg animate-pulse mb-1" />
                      <div className="h-3 w-16 bg-emerald-500/20 rounded-lg animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 animate-pulse" />
                      <div className="h-3 w-16 bg-emerald-500/20 rounded-lg animate-pulse" />
                    </div>
                    <div className="w-20 h-8 bg-emerald-500/20 rounded-lg animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            {/* Data Management Header */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-48 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg animate-pulse" />
              <div className="flex gap-3">
                <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
                <div className="w-24 h-10 bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
            </div>
            
            {/* Data Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: FiDownload, title: 'Export Data', desc: 'Backup your financial data' },
                { icon: FiUpload, title: 'Import Data', desc: 'Import from other apps' },
                { icon: FiRefreshCw, title: 'Sync Data', desc: 'Sync across devices' },
                { icon: FiDatabase, title: 'Data Health', desc: 'Check data integrity' }
              ].map((item, i) => (
                <div key={i} className="liquid-card p-6 rounded-2xl text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <item.icon size={32} className="text-emerald-400/50" />
                  </div>
                  <div className="h-5 w-24 bg-emerald-500/20 rounded-lg animate-pulse mx-auto mb-2" />
                  <div className="h-4 w-32 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
            <div className="h-6 w-32 bg-emerald-500/20 rounded-lg animate-pulse mx-auto mb-3" />
            <div className="h-4 w-48 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
          </div>
        );
    }
  };

  const sizeClasses = {
    small: 'py-4',
    medium: 'py-8',
    large: 'py-12'
  };

  return (
    <div className={`${sizeClasses[size]} animate-fade-in`}>
      {getLoadingContent()}
      {message && (
        <div className="text-center mt-6">
          <div className="h-4 w-64 bg-emerald-500/20 rounded-lg animate-pulse mx-auto" />
        </div>
      )}
    </div>
  );
};

export default LoadingStates;

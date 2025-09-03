'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import ExpenseSharingSettings from '@/app/components/ExpenseSharingSettings';
import SharedExpensesView from '@/app/components/SharedExpensesView';
import { FiUsers, FiSettings } from 'react-icons/fi';
import { requireAuth } from '@/app/lib/auth';

const SharedExpensesPage = () => {
  // Check authentication on component mount
  useEffect(() => {
    requireAuth();
  }, []);

  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'settings'>('expenses');

  const handleSharingChange = (enabled: boolean, partner?: any) => {
    setSharingEnabled(enabled);
    setPartnerInfo(partner);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 min-h-full">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl">
              <FiUsers size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold mb-3 tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Shared Expenses
              </h1>
              <p className="text-xl font-light" style={{ color: 'var(--text-muted)' }}>
                Share and track expenses with your partner
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 mb-8">
          <div className="flex bg-white/10 rounded-2xl p-2">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                activeTab === 'expenses'
                  ? 'shadow-lg'
                  : 'hover:bg-white/5'
              }`}
              style={{
                backgroundColor: activeTab === 'expenses' ? 'var(--overlay-heavy)' : 'transparent',
                color: activeTab === 'expenses' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              <FiUsers size={20} />
              Shared Expenses
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'shadow-lg'
                  : 'hover:bg-white/5'
              }`}
              style={{
                backgroundColor: activeTab === 'settings' ? 'var(--overlay-heavy)' : 'transparent',
                color: activeTab === 'settings' ? 'var(--text-primary)' : 'var(--text-muted)'
              }}
            >
              <FiSettings size={20} />
              Settings
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'expenses' ? (
          <SharedExpensesView 
            sharingEnabled={sharingEnabled} 
            partnerInfo={partnerInfo}
          />
        ) : (
          <ExpenseSharingSettings onSharingChange={handleSharingChange} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SharedExpensesPage;

'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import ExpenseSharingSettings from '@/app/components/ExpenseSharingSettings';
import SharedExpensesView from '@/app/components/SharedExpensesView';
import { FiUsers, FiSettings } from 'react-icons/fi';

const SharedExpensesPage = () => {
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'expenses' | 'settings'>('expenses');

  const handleSharingChange = (enabled: boolean, partner?: any) => {
    setSharingEnabled(enabled);
    setPartnerInfo(partner);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-xl">
              <FiUsers size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-6xl font-bold text-white mb-3 tracking-tight">
                Shared Expenses
              </h1>
              <p className="text-xl text-white/70 font-light">
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
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <FiUsers size={20} />
              Shared Expenses
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300 ${
                activeTab === 'settings'
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
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

'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiUserPlus, FiUserMinus, FiMail, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { ApiClient } from '@/app/lib/api';

interface ExpenseSharingSettingsProps {
  onSharingChange?: (enabled: boolean, partnerInfo?: any) => void;
}

const ExpenseSharingSettings: React.FC<ExpenseSharingSettingsProps> = ({ onSharingChange }) => {
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerName, setPartnerName] = useState('');

  useEffect(() => {
    loadSharingStatus();
  }, []);

  const loadSharingStatus = async () => {
    try {
      const response = await ApiClient.getSharedExpenses();
      setSharingEnabled(response.sharingEnabled);
      setPartnerInfo(response.partnerInfo);
      onSharingChange?.(response.sharingEnabled, response.partnerInfo);
    } catch (error) {
      // Fallback to localStorage
      const savedSharing = localStorage.getItem('expenseSharing');
      if (savedSharing) {
        const sharingData = JSON.parse(savedSharing);
        setSharingEnabled(sharingData.enabled);
        setPartnerInfo(sharingData.partnerInfo);
        onSharingChange?.(sharingData.enabled, sharingData.partnerInfo);
      }
    }
  };

  const handleEnableSharing = async () => {
    if (!partnerEmail.trim()) {
      toast.error('Please enter your partner\'s email address');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiClient.enableExpenseSharing(partnerEmail.trim(), partnerName.trim() || undefined);
      
      setSharingEnabled(true);
      setPartnerInfo(response.partnerInfo);
      setShowSetupForm(false);
      setPartnerEmail('');
      setPartnerName('');
      
      // Save to localStorage as backup
      localStorage.setItem('expenseSharing', JSON.stringify({
        enabled: true,
        partnerInfo: response.partnerInfo
      }));
      
      onSharingChange?.(true, response.partnerInfo);
      toast.success(`Expense sharing enabled with ${response.partnerInfo.name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to enable expense sharing');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableSharing = async () => {
    setLoading(true);
    try {
      await ApiClient.disableExpenseSharing();
      
      setSharingEnabled(false);
      setPartnerInfo(null);
      
      // Remove from localStorage
      localStorage.removeItem('expenseSharing');
      
      onSharingChange?.(false);
      toast.success('Expense sharing disabled');
    } catch (error: any) {
      toast.error(error.message || 'Failed to disable expense sharing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="liquid-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <FiUsers size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-display text-xl font-semibold text-white">Expense Sharing</h3>
          <p className="text-white/60 text-sm">Share expenses with your partner</p>
        </div>
      </div>

      {!sharingEnabled ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-white/80 text-sm">
              Enable expense sharing to see each other's expenses and track your combined spending.
            </p>
          </div>
          
          {!showSetupForm ? (
            <button
              onClick={() => setShowSetupForm(true)}
              className="w-full liquid-button text-white py-3 px-6 font-medium flex items-center justify-center gap-2"
            >
              <FiUserPlus size={20} />
              Enable Expense Sharing
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="partnerEmail" className="block text-body text-sm font-medium text-white/80 mb-2">
                  Partner's Email Address
                </label>
                <input
                  type="email"
                  id="partnerEmail"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  placeholder="Enter your partner's email"
                  className="liquid-input w-full px-4 py-3 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="partnerName" className="block text-body text-sm font-medium text-white/80 mb-2">
                  Partner's Name (Optional)
                </label>
                <input
                  type="text"
                  id="partnerName"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="Enter your partner's name"
                  className="liquid-input w-full px-4 py-3 focus:outline-none"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleEnableSharing}
                  disabled={loading || !partnerEmail.trim()}
                  className="flex-1 liquid-button text-white py-3 px-6 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enabling...
                    </>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      Enable Sharing
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setShowSetupForm(false);
                    setPartnerEmail('');
                    setPartnerName('');
                  }}
                  className="px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <FiCheck size={20} className="text-green-400" />
              <div>
                <p className="text-white font-medium">Sharing Enabled</p>
                <p className="text-white/60 text-sm">
                  Sharing expenses with <span className="text-green-400 font-medium">{partnerInfo?.name}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-xl bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{partnerInfo?.name}</p>
                <p className="text-white/60 text-sm">{partnerInfo?.email}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
            </div>
          </div>
          
          <button
            onClick={handleDisableSharing}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                Disabling...
              </>
            ) : (
              <>
                <FiUserMinus size={20} />
                Disable Sharing
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseSharingSettings;

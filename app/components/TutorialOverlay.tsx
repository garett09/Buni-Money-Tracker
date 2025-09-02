'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiPlay, FiPause, FiSkipForward, FiSkipBack, FiHelpCircle, FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  highlight?: string;
  page: string;
  module: string;
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
}

const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isOpen, onClose, currentPage }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const allTutorialSteps: TutorialStep[] = [
    // Dashboard Overview
    {
      id: 'dashboard-overview',
      title: 'Dashboard Overview',
      description: 'This is your financial command center. View real-time insights, track spending patterns, and monitor your financial health at a glance.',
      target: '.dashboard-overview',
      position: 'center',
      page: 'dashboard',
      module: 'Dashboard'
    },
    {
      id: 'budget-overview',
      title: 'Budget Overview',
      description: 'See your monthly budget status, remaining funds, and spending trends. The intelligent system learns from your habits to provide better forecasts.',
      target: '.budget-overview',
      position: 'top',
      page: 'dashboard',
      module: 'Budget Management'
    },
    {
      id: 'expense-tracking',
      title: 'Expense Tracking',
      description: 'Monitor your daily spending with categorized breakdowns. Add new expenses, set recurring payments, and track shared expenses with others.',
      target: '.expense-tracking',
      position: 'right',
      page: 'dashboard',
      module: 'Expense Management'
    },
    {
      id: 'income-management',
      title: 'Income Management',
      description: 'Track all your income sources, including salary, bonuses, and side hustles. Set up recurring income entries for automatic tracking.',
      target: '.income-management',
      position: 'left',
      page: 'dashboard',
      module: 'Income Tracking'
    },
    {
      id: 'savings-goals',
      title: 'Savings Goals',
      description: 'Set and track your financial goals. The system calculates how much you need to save monthly and tracks your progress automatically.',
      target: '.savings-goals',
      position: 'bottom',
      page: 'dashboard',
      module: 'Savings Planning'
    },
    {
      id: 'analytics-charts',
      title: 'Analytics & Charts',
      description: 'Visualize your financial data with interactive charts. Track spending patterns, income trends, and budget performance over time.',
      target: '.analytics-charts',
      position: 'center',
      page: 'dashboard',
      module: 'Data Analytics'
    },
    {
      id: 'smart-notifications',
      title: 'Smart Notifications',
      description: 'Get intelligent alerts about unusual spending, budget limits, and financial opportunities. The AI learns your patterns to provide relevant insights.',
      target: '.smart-notifications',
      position: 'top',
      page: 'dashboard',
      module: 'AI Notifications'
    },
    {
      id: 'account-management',
      title: 'Account Management',
      description: 'Manage multiple bank accounts, credit cards, and investment accounts. Track balances, set limits, and monitor account health.',
      target: '.account-management',
      position: 'right',
      page: 'accounts',
      module: 'Account Management'
    },
    {
      id: 'transaction-history',
      title: 'Transaction History',
      description: 'View and search through all your financial transactions. Filter by date, category, amount, or account for detailed analysis.',
      target: '.transaction-history',
      position: 'center',
      page: 'transactions',
      module: 'Transaction Tracking'
    },
    {
      id: 'shared-expenses',
      title: 'Shared Expenses',
      description: 'Split bills and track shared expenses with roommates, family, or friends. Calculate who owes what and settle up easily.',
      target: '.shared-expenses',
      position: 'left',
      page: 'shared',
      module: 'Expense Sharing'
    },
    {
      id: 'data-management',
      title: 'Data Management',
      description: 'Backup your financial data, import from other apps, and sync across devices. Export reports for tax purposes or financial planning.',
      target: '.data-management',
      position: 'bottom',
      page: 'data',
      module: 'Data Operations'
    },
    {
      id: 'budget-settings',
      title: 'Budget Settings',
      description: 'Customize your budget categories, set spending limits, and configure intelligent budget recommendations based on your financial goals.',
      target: '.budget-settings',
      position: 'center',
      page: 'dashboard',
      module: 'Budget Configuration'
    },
    {
      id: 'performance-optimizer',
      title: 'Performance Optimizer',
      description: 'Get AI-powered suggestions to improve your financial health. Optimize spending, increase savings, and achieve your goals faster.',
      target: '.performance-optimizer',
      position: 'right',
      page: 'dashboard',
      module: 'AI Optimization'
      },
    {
      id: 'historical-analytics',
      title: 'Historical Analytics',
      description: 'Analyze your financial trends over months and years. Compare periods, identify patterns, and make data-driven decisions.',
      target: '.historical-analytics',
      position: 'center',
      page: 'dashboard',
      module: 'Trend Analysis'
    }
  ];

  const currentPageSteps = allTutorialSteps.filter(step => 
    step.page === currentPage || step.page === 'dashboard'
  );

  const currentStep = currentPageSteps[currentStepIndex];

  useEffect(() => {
    if (isPlaying && currentStepIndex < currentPageSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStepIndex, currentPageSteps.length]);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStepIndex < currentPageSteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));
    if (currentStepIndex < currentPageSteps.length - 1) {
      handleNext();
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const progress = ((currentStepIndex + 1) / currentPageSteps.length) * 100;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      {/* Tutorial Overlay */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <FiHelpCircle size={24} />
                <div>
                  <h2 className="text-xl font-bold">Interactive Tutorial</h2>
                  <p className="text-emerald-100 text-sm">
                    Learn how to use {currentStep?.module} - Step {currentStepIndex + 1} of {currentPageSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {currentStep?.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                {currentStep?.description}
              </p>
            </div>

            {/* Module Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {currentStep?.module?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {currentStep?.module}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Available on {currentStep?.page === 'dashboard' ? 'all pages' : currentStep?.page} page
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
                </button>
                <button
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <FiSkipBack size={20} />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStepIndex === currentPageSteps.length - 1}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  <FiSkipForward size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Skip Tutorial
                </button>
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2"
                >
                  {currentStepIndex === currentPageSteps.length - 1 ? 'Finish' : 'Got it!'}
                  {currentStepIndex === currentPageSteps.length - 1 ? null : <FiArrowRight size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Overlay */}
      {currentStep && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="relative w-full h-full">
            {/* This would be positioned based on the target element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-32 rounded-xl border-4 border-emerald-400 shadow-2xl animate-pulse">
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                  {currentStep.title}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialOverlay;

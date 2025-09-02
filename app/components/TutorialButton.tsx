'use client';

import React, { useState } from 'react';
import { FiHelpCircle, FiPlay, FiX } from 'react-icons/fi';

interface TutorialButtonProps {
  currentPage: string;
  isLoading?: boolean;
}

const TutorialButton: React.FC<TutorialButtonProps> = ({ currentPage, isLoading = false }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [loadedModules, setLoadedModules] = useState<Set<string>>(new Set());

  const tutorialSteps = [
    {
      title: 'Dashboard Overview',
      description: 'Your financial command center with real-time insights and spending patterns.',
      module: 'Dashboard'
    },
    {
      title: 'Budget Management',
      description: 'Track monthly budgets, remaining funds, and get intelligent spending forecasts.',
      module: 'Budget System'
    },
    {
      title: 'Expense Tracking',
      description: 'Monitor daily spending with categories, recurring payments, and shared expenses.',
      module: 'Expense Management'
    },
    {
      title: 'Income Management',
      description: 'Track all income sources including salary, bonuses, and side hustles.',
      module: 'Income Tracking'
    },
    {
      title: 'Savings Goals',
      description: 'Set financial goals with automatic progress tracking and monthly calculations.',
      module: 'Savings Planning'
    },
    {
      title: 'Analytics & Charts',
      description: 'Visualize financial data with interactive charts and trend analysis.',
      module: 'Data Analytics'
    },
    {
      title: 'Smart Notifications',
      description: 'AI-powered alerts for unusual spending, budget limits, and opportunities.',
      module: 'AI Notifications'
    },
    {
      title: 'Account Management',
      description: 'Manage multiple bank accounts, credit cards, and investment accounts.',
      module: 'Account Management'
    },
    {
      title: 'Transaction History',
      description: 'Search and filter all financial transactions by date, category, or amount.',
      module: 'Transaction Tracking'
    },
    {
      title: 'Shared Expenses',
      description: 'Split bills and track shared expenses with roommates, family, or friends.',
      module: 'Expense Sharing'
    },
    {
      title: 'Data Management',
      description: 'Backup data, import from other apps, and sync across devices.',
      module: 'Data Operations'
    }
  ];

  const currentPageSteps = tutorialSteps.filter((_, index) => 
    currentPage === 'dashboard' || index < 7
  );

  // Simulate module loading when tutorial opens
  const handleOpenTutorial = () => {
    setShowTutorial(true);
    setIsLoadingModules(true);
    setLoadedModules(new Set()); // Reset loaded modules
    
    // Simulate loading different modules at different times
    setTimeout(() => {
      setLoadedModules(prev => new Set([...prev, 'Dashboard']));
    }, 500);
    
    setTimeout(() => {
      setLoadedModules(prev => new Set([...prev, 'Budget System', 'Expense Management']));
    }, 1000);
    
    setTimeout(() => {
      setLoadedModules(prev => new Set([...prev, 'Income Tracking', 'Savings Planning']));
    }, 1500);
    
    setTimeout(() => {
      setLoadedModules(prev => new Set([...prev, 'Data Analytics', 'AI Notifications']));
    }, 2000);
    
    setTimeout(() => {
      setLoadedModules(prev => new Set([...prev, 'Account Management', 'Transaction Tracking']));
    }, 2500);
    
    setTimeout(() => {
      setLoadedModules(prev => new Set([...prev, 'Expense Sharing', 'Data Operations']));
      setIsLoadingModules(false);
    }, 3000);
  };

  // Reset state when tutorial is closed
  const handleCloseTutorial = () => {
    setShowTutorial(false);
    setIsLoadingModules(false);
    setLoadedModules(new Set());
  };

  return (
    <>
      {/* Enhanced Tutorial Button */}
      <button
        data-tutorial-trigger
        onClick={handleOpenTutorial}
        disabled={isLoading}
        className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 hover:from-emerald-500/30 hover:to-blue-500/30 text-emerald-400 hover:text-emerald-300 rounded-2xl transition-all duration-300 group border border-emerald-500/30 hover:border-emerald-500/50 backdrop-blur-lg shadow-lg hover:shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiHelpCircle size={18} className="text-white" />
          )}
        </div>
        <span className="font-semibold text-sm">
          {isLoading ? 'Loading...' : 'Tutorial'}
        </span>
      </button>

      {/* Enhanced Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center p-4">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-gradient-to-r from-emerald-500/20 to-blue-600/20 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl bg-gradient-to-r from-purple-500/20 to-pink-600/20 animate-pulse delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 animate-pulse delay-2000" />
          </div>

          {/* Main Modal */}
          <div className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden">
            {/* Glass Morphism Container */}
            <div className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 p-[1px]">
                <div className="h-full w-full bg-gray-900/80 rounded-3xl" />
              </div>

              {/* Header */}
              <div className="relative p-8 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-2xl">
                      <FiHelpCircle size={32} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        How Buni Money Tracker Works
                      </h2>
                      <p className="text-emerald-300/80 text-lg mt-2">
                        Master all the modules and unlock your financial potential
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseTutorial}
                    className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 hover:scale-110 group"
                  >
                    <FiX size={24} className="text-white group-hover:text-emerald-400 transition-colors" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(95vh-200px)]">
                {/* Loading State */}
                {isLoadingModules && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-blue-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Loading Modules...</h3>
                    <p className="text-emerald-300/80 text-lg">Preparing your financial guide</p>
                    
                    {/* Loading Progress */}
                    <div className="mt-8 max-w-md mx-auto">
                      <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4">
                        <div 
                          className="h-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${(loadedModules.size / tutorialSteps.length) * 100}%` 
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-400">
                        {loadedModules.size} of {tutorialSteps.length} modules loaded
                      </p>
                    </div>
                  </div>
                )}

                {/* Module Grid */}
                {!isLoadingModules && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {currentPageSteps.map((step, index) => {
                      const isLoaded = loadedModules.has(step.module);
                      return (
                        <div
                          key={index}
                          className={`group relative bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-emerald-500/50 transition-all duration-700 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/20 ${
                            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                          }`}
                          style={{
                            transitionDelay: `${index * 100}ms`
                          }}
                        >
                          {/* Hover Effect Background */}
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="relative flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <span className="text-white font-bold text-xl">
                                {step.module.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                                {step.title}
                              </h3>
                              <p className="text-gray-300 leading-relaxed text-base mb-4">
                                {step.description}
                              </p>
                              <div className="inline-block px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-xl border border-emerald-500/30 group-hover:bg-emerald-500/30 group-hover:border-emerald-500/50 transition-all duration-300">
                                {step.module}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Enhanced Quick Start Guide */}
                {!isLoadingModules && (
                  <div className="relative bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 rounded-2xl p-8 border border-white/20 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                      }} />
                    </div>
                    
                    <div className="relative">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                          <FiPlay size={20} className="text-white" />
                        </div>
                        Quick Start Guide
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { step: 1, title: 'Add Your Accounts', desc: 'Start by adding your bank accounts and credit cards', color: 'from-blue-500 to-cyan-600' },
                          { step: 2, title: 'Set Your Budget', desc: 'Configure spending limits and savings goals', color: 'from-emerald-500 to-green-600' },
                          { step: 3, title: 'Track & Analyze', desc: 'Monitor spending and get AI-powered insights', color: 'from-purple-500 to-pink-600' }
                        ].map((item, index) => (
                          <div 
                            key={index} 
                            className="text-center group opacity-0 translate-y-4 animate-fade-in-up"
                            style={{
                              animationDelay: `${(index + 1) * 200}ms`,
                              animationFillMode: 'forwards'
                            }}
                          >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              <span className="text-white font-bold text-2xl">{item.step}</span>
                            </div>
                            <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                              {item.title}
                            </h4>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Footer */}
              <div className="relative bg-gray-800/50 backdrop-blur-lg px-8 py-6 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <span className="text-emerald-400 text-sm">💡</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {isLoadingModules ? 'Loading modules...' : 'Need more help? Check out our detailed documentation'}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseTutorial}
                    disabled={isLoadingModules}
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-2xl hover:from-emerald-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoadingModules ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading...
                      </div>
                    ) : (
                      'Got it! 🚀'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorialButton;

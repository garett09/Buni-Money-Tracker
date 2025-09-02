'use client';

import React, { useState } from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { 
  FiBook, 
  FiSearch, 
  FiArrowRight, 
  FiCode, 
  FiSettings, 
  FiDatabase, 
  FiTarget, 
  FiTrendingUp, 
  FiPieChart,
  FiSmartphone,
  FiZap,
  FiBell,
  FiUsers,
  FiDownload,
  FiRefreshCw,
  FiMonitor,
  FiGift,
  FiSun,
  FiMoon,
  FiDollarSign,
  FiShield,
  FiMessageCircle,
  FiHome,
  FiUser,
  FiCreditCard,
  FiBarChart,
  FiCalendar,
  FiFileText,
  FiHelpCircle,
  FiExternalLink
} from 'react-icons/fi';
import Link from 'next/link';

const DocumentationPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');


  const features = [
    {
      id: 'overview',
      title: 'Overview',
      icon: FiBook,
      color: 'from-blue-500 to-cyan-600',
      description: 'Complete guide to Buni Money Tracker',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Welcome to Buni Money Tracker</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Your comprehensive financial management solution designed to help you track, analyze, and optimize your money.
            Built with modern technology and intelligent features to make personal finance simple and effective.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🎯 Key Benefits</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• Real-time financial tracking</li>
                <li>• Intelligent budget recommendations</li>
                <li>• Advanced analytics and insights</li>
                <li>• Cross-platform synchronization</li>
                <li>• Secure data management</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-green-800 dark:text-green-200">
                <li>• Create your account in 2 minutes</li>
                <li>• Connect your bank accounts</li>
                <li>• Set up your first budget</li>
                <li>• Start tracking transactions</li>
                <li>• Explore advanced features</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 mb-8">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">🚀 Quick Start Guide</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">1</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Create Account</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Add Transactions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Track Progress</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 sm:h-16 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
              >
                <FiArrowRight size={18} className="sm:text-xl rotate-180" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <FiSun size={20} className="text-yellow-500" />
                ) : (
                  <FiMoon size={20} className="text-gray-600" />
                )}
              </button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiBook size={16} className="sm:text-xl text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Buni Money Tracker Docs</h1>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Buni Money Tracker Documentation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete guide to tracking, analyzing, and optimizing your personal finances with our intelligent money management platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                <FiHome size={20} />
                Get Started
              </Link>
              <Link
                href="#overview"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-300 dark:border-gray-600 transition-colors"
              >
                <FiBook size={20} />
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Search */}
              <div className="mb-4 sm:mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search documentation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* GitHub-style Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Categories</h3>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Getting Started</div>
                  <button
                    onClick={() => setActiveSection('overview')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'overview'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Overview
                  </button>
                </div>
              </div>

              {/* Popular Sections */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Popular</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection('overview')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    🚀 Quick Start
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              {(() => {
                const activeFeature = features.find(f => f.id === activeSection);
                if (!activeFeature) return null;
                
                return (
                  <div>
                    <div className="text-center mb-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeFeature.color} flex items-center justify-center mx-auto mb-4`}>
                        <activeFeature.icon size={32} className="text-white" />
                      </div>
                      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{activeFeature.title}</h2>
                      <p className="text-gray-600 dark:text-gray-300 text-lg">{activeFeature.description}</p>
                    </div>
                    
                    {activeFeature.content}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;

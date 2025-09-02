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
      content: `
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
      `
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: FiHome,
      color: 'from-green-500 to-emerald-600',
      description: 'Quick setup and first steps',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Getting Started</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiUser className="text-blue-500" size={24} />
              Account Setup
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Registration</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Visit the signup page</li>
                  <li>• Enter your email and password</li>
                  <li>• Verify your email address</li>
                  <li>• Complete your profile</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Profile Setup</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Add your name and preferences</li>
                  <li>• Set your timezone</li>
                  <li>• Choose your currency</li>
                  <li>• Set financial goals</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiCreditCard className="text-green-500" size={24} />
              First Transactions
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Adding Income</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Click "Add Income" button</li>
                  <li>• Select income category</li>
                  <li>• Enter amount and description</li>
                  <li>• Set recurring if applicable</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Adding Expenses</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Click "Add Expense" button</li>
                  <li>• Choose expense category</li>
                  <li>• Enter amount and details</li>
                  <li>• Add receipt if available</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiTarget className="text-purple-500" size={24} />
              Setting Goals
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Savings Goals</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Emergency fund target</li>
                  <li>• Vacation savings</li>
                  <li>• Down payment goal</li>
                  <li>• Custom financial objectives</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Budget Limits</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Monthly spending limits</li>
                  <li>• Category budgets</li>
                  <li>• Weekly allowances</li>
                  <li>• Annual financial plans</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'core-features',
      title: 'Core Features',
      icon: FiSettings,
      color: 'from-emerald-500 to-green-600',
      description: 'Essential money tracking capabilities',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Core Features</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiDollarSign className="text-green-500" size={24} />
              Transaction Management
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Income Tracking</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Multiple income sources</li>
                  <li>• Recurring income setup</li>
                  <li>• Income categorization</li>
                  <li>• Income vs expense analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Expense Tracking</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Real-time expense logging</li>
                  <li>• Smart categorization</li>
                  <li>• Receipt management</li>
                  <li>• Spending alerts</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiTarget className="text-blue-500" size={24} />
              Budget Management
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Monthly Budgets</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Custom budget categories</li>
                  <li>• Budget vs actual tracking</li>
                  <li>• Budget rollover options</li>
                  <li>• Budget notifications</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Category Budgets</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Food & Dining</li>
                  <li>• Transportation</li>
                  <li>• Entertainment</li>
                  <li>• Shopping</li>
                  <li>• Utilities</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiPieChart className="text-purple-500" size={24} />
              Account Management
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Account Types</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Checking accounts</li>
                  <li>• Savings accounts</li>
                  <li>• Credit cards</li>
                  <li>• Investment accounts</li>
                  <li>• Cash accounts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Account Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Balance tracking</li>
                  <li>• Account reconciliation</li>
                  <li>• Transfer management</li>
                  <li>• Account grouping</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'advanced-features',
      title: 'Advanced Features',
      icon: FiCode,
      color: 'from-purple-500 to-pink-600',
      description: 'Powerful tools for financial optimization',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Advanced Features</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiZap className="text-yellow-500" size={24} />
              Intelligent Budget System
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              AI-powered budget recommendations based on your spending patterns and financial goals.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Smart Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Spending pattern analysis</li>
                  <li>• Predictive budget forecasting</li>
                  <li>• Seasonal adjustments</li>
                  <li>• Risk factor identification</li>
                  <li>• Opportunity recommendations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Learning Capabilities</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Adaptive budget adjustments</li>
                  <li>• Behavioral pattern recognition</li>
                  <li>• Personalized recommendations</li>
                  <li>• Continuous improvement</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiTrendingUp className="text-green-500" size={24} />
              Advanced Analytics
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Charts & Graphs</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Line charts for trends</li>
                  <li>• Bar charts for comparisons</li>
                  <li>• Pie charts for categories</li>
                  <li>• Area charts for cumulative data</li>
                  <li>• Interactive tooltips</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Financial Metrics</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Net worth tracking</li>
                  <li>• Savings rate analysis</li>
                  <li>• Spending velocity</li>
                  <li>• Category breakdowns</li>
                  <li>• Historical comparisons</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiBell className="text-red-500" size={24} />
              Smart Notifications
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Alert Types</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Budget threshold alerts</li>
                  <li>• Unusual spending detection</li>
                  <li>• Bill due reminders</li>
                  <li>• Savings goal updates</li>
                  <li>• Financial health scores</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Intelligence</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Anomaly detection</li>
                  <li>• Pattern recognition</li>
                  <li>• Predictive alerts</li>
                  <li>• Personalized timing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'savings-goals',
      title: 'Savings & Goals',
      icon: FiTarget,
      color: 'from-orange-500 to-red-600',
      description: 'Achieve your financial objectives',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Savings & Goals</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiGift className="text-pink-500" size={24} />
              Savings Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Set, track, and achieve your financial goals with intelligent planning and progress monitoring.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Goal Types</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Emergency fund</li>
                  <li>• Vacation savings</li>
                  <li>• Down payment</li>
                  <li>• Retirement planning</li>
                  <li>• Custom goals</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Target amount setting</li>
                  <li>• Deadline management</li>
                  <li>• Progress tracking</li>
                  <li>• Achievement celebrations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                             <FiTarget className="text-blue-500" size={24} />
              Savings Calculator
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Calculations</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Timeline projections</li>
                  <li>• Required savings rate</li>
                  <li>• Interest calculations</li>
                  <li>• Goal achievability</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Projections</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Daily savings needed</li>
                  <li>• Weekly contributions</li>
                  <li>• Monthly targets</li>
                  <li>• Annual projections</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'shared-expenses',
      title: 'Shared Expenses',
      icon: FiUsers,
      color: 'from-indigo-500 to-purple-600',
      description: 'Split bills and manage group finances',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Shared Expenses</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiUsers className="text-indigo-500" size={24} />
              Group Expense Management
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Easily split expenses with roommates, family members, or friends while keeping track of who owes what.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Splitting Options</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Equal splits</li>
                  <li>• Percentage-based splits</li>
                  <li>• Custom amount splits</li>
                  <li>• Round-robin splitting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Management</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Expense history</li>
                  <li>• Settlement tracking</li>
                  <li>• Group analytics</li>
                  <li>• Payment reminders</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiMessageCircle className="text-green-500" size={24} />
              Communication
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notifications</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Expense added alerts</li>
                  <li>• Settlement reminders</li>
                  <li>• Group updates</li>
                  <li>• Payment confirmations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transparency</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Real-time balances</li>
                  <li>• Expense breakdowns</li>
                  <li>• Settlement history</li>
                  <li>• Group summaries</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'data-management',
      title: 'Data Management',
      icon: FiDatabase,
      color: 'from-teal-500 to-cyan-600',
      description: 'Import, export, and sync your data',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Data Management</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiDownload className="text-blue-500" size={24} />
              Import & Export
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Import Options</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• CSV file import</li>
                  <li>• Bank statement uploads</li>
                  <li>• Excel file support</li>
                  <li>• Manual entry</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export Formats</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• PDF reports</li>
                  <li>• CSV data export</li>
                  <li>• Excel spreadsheets</li>
                  <li>• JSON data format</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiRefreshCw className="text-green-500" size={24} />
              Synchronization
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sync Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Cross-device sync</li>
                  <li>• Real-time updates</li>
                  <li>• Offline support</li>
                  <li>• Conflict resolution</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Backup</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Automatic backups</li>
                  <li>• Manual backup creation</li>
                  <li>• Cloud storage integration</li>
                  <li>• Restore functionality</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiShield className="text-red-500" size={24} />
              Security & Privacy
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Security</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Two-factor authentication</li>
                  <li>• Secure data transmission</li>
                  <li>• Regular security audits</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Privacy</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Data anonymization</li>
                  <li>• Privacy controls</li>
                  <li>• GDPR compliance</li>
                  <li>• Data deletion options</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'mobile-optimization',
      title: 'Mobile & Performance',
      icon: FiSmartphone,
      color: 'from-pink-500 to-rose-600',
      description: 'Optimized for all devices',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Mobile & Performance</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                             <FiSmartphone className="text-pink-500" size={24} />
              Mobile Optimization
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responsive Design</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Mobile-first approach</li>
                  <li>• Touch-friendly interface</li>
                  <li>• Adaptive layouts</li>
                  <li>• Gesture support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Device Support</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Smartphones</li>
                  <li>• Tablets</li>
                  <li>• Desktop computers</li>
                  <li>• All screen sizes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiZap className="text-yellow-500" size={24} />
              Performance Features
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Speed</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Fast loading times</li>
                  <li>• Optimized assets</li>
                  <li>• Lazy loading</li>
                  <li>• Caching strategies</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Efficiency</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Minimal resource usage</li>
                  <li>• Battery optimization</li>
                  <li>• Data compression</li>
                  <li>• Background sync</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiMonitor className="text-blue-500" size={24} />
              Progressive Web App
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">PWA Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Offline functionality</li>
                  <li>• App-like experience</li>
                  <li>• Push notifications</li>
                  <li>• Home screen installation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Benefits</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• No app store required</li>
                  <li>• Automatic updates</li>
                  <li>• Cross-platform compatibility</li>
                  <li>• Reduced storage usage</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: FiCode,
      color: 'from-indigo-500 to-blue-600',
      description: 'Developer API and integrations',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">API Reference</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiCode className="text-indigo-500" size={24} />
              Authentication
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">All API requests require authentication via JWT token in the Authorization header:</p>
              <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">Authorization: Bearer YOUR_JWT_TOKEN</code>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Login</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">POST /api/login</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Authenticate user and receive JWT token</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Register</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">POST /api/register</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create new user account</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiDatabase className="text-green-500" size={24} />
              Transactions API
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Get Transactions</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">GET /api/transactions</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Retrieve user's transaction history with optional filters</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Add Transaction</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">POST /api/transactions</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Create new income or expense transaction</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Update Transaction</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">PUT /api/transactions/:id</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Modify existing transaction details</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Delete Transaction</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">DELETE /api/transactions/:id</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Remove transaction from records</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiBarChart className="text-purple-500" size={24} />
              Analytics API
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dashboard Stats</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">GET /api/dashboard/stats</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Get overview statistics and metrics</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Category Analysis</h4>
                <code className="text-sm bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded block mb-2">GET /api/analytics/categories</code>
                <p className="text-xs text-gray-600 dark:text-gray-400">Get spending breakdown by category</p>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'deployment',
      title: 'Deployment',
      icon: FiMonitor,
      color: 'from-orange-500 to-red-600',
      description: 'Deploy to production environments',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Deployment Guide</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiMonitor className="text-orange-500" size={24} />
              Vercel Deployment (Recommended)
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🚀 Quick Deploy</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Push your code to GitHub</li>
                  <li>Connect repository to Vercel</li>
                  <li>Set environment variables</li>
                  <li>Deploy automatically</li>
                </ol>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Environment Variables</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• NEXT_PUBLIC_API_URL</li>
                    <li>• UPSTASH_REDIS_REST_URL</li>
                    <li>• UPSTASH_REDIS_REST_TOKEN</li>
                    <li>• JWT_SECRET</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Automatic deployments</li>
                    <li>• Preview deployments</li>
                    <li>• Edge functions</li>
                    <li>• Global CDN</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiDownload className="text-green-500" size={24} />
              Alternative Platforms
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Netlify</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Static site hosting with form handling</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Railway</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Full-stack deployment platform</p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Heroku</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Traditional hosting with add-ons</p>
              </div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: FiHelpCircle,
      color: 'from-red-500 to-pink-600',
      description: 'Common issues and solutions',
      content: `
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Troubleshooting Guide</h2>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiHelpCircle className="text-red-500" size={24} />
              Common Issues
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Authentication Errors</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">If you're experiencing login issues:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>Clear browser cookies and cache</li>
                  <li>Check your internet connection</li>
                  <li>Verify your email and password</li>
                  <li>Try resetting your password</li>
                </ul>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance Issues</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">If the app is running slowly:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>Check your internet connection</li>
                  <li>Clear browser cache</li>
                  <li>Try refreshing the page</li>
                  <li>Update your browser</li>
                </ul>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Data Sync Issues</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">If data isn't syncing properly:</p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-disc list-inside">
                  <li>Check your internet connection</li>
                  <li>Log out and log back in</li>
                  <li>Clear browser storage</li>
                  <li>Contact support if persistent</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <FiFileText className="text-blue-500" size={24} />
              Getting Help
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Support Channels</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• GitHub Issues</li>
                  <li>• Documentation</li>
                  <li>• Community Forum</li>
                  <li>• Email Support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Before Contacting Support</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• Check this troubleshooting guide</li>
                  <li>• Search existing issues</li>
                  <li>• Include error messages</li>
                  <li>• Describe steps to reproduce</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      `
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
                  <button
                    onClick={() => setActiveSection('getting-started')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'getting-started'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Quick Start Guide
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Core Features</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection('core-features')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'core-features'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Essential Features
                  </button>
                  <button
                    onClick={() => setActiveSection('advanced-features')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'advanced-features'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Advanced Tools
                  </button>
                  <button
                    onClick={() => setActiveSection('savings-goals')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'savings-goals'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Savings & Goals
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Advanced</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection('shared-expenses')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'shared-expenses'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Shared Expenses
                  </button>
                  <button
                    onClick={() => setActiveSection('data-management')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'data-management'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Data Management
                  </button>
                  <button
                    onClick={() => setActiveSection('mobile-optimization')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'mobile-optimization'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Mobile & Performance
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Developer</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection('api-reference')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'api-reference'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    API Reference
                  </button>
                  <button
                    onClick={() => setActiveSection('deployment')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'deployment'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Deployment
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Support</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveSection('troubleshooting')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === 'troubleshooting'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Troubleshooting
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
                  <button
                    onClick={() => setActiveSection('core-features')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    💰 Core Features
                  </button>
                  <button
                    onClick={() => setActiveSection('api-reference')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    🔌 API Reference
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
                    
                    <div 
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: activeFeature.content }}
                    />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style Footer */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Buni Money Tracker</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Your intelligent personal finance companion. Track, analyze, and optimize your money with powerful tools and insights.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#overview" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#security" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#roadmap" className="hover:text-gray-900 dark:hover:text-white transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Developers</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#api-reference" className="hover:text-gray-900 dark:hover:text-white transition-colors">API</Link></li>
                <li><Link href="#deployment" className="hover:text-gray-900 dark:hover:text-white transition-colors">Deployment</Link></li>
                <li><Link href="#integrations" className="hover:text-gray-900 dark:hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="#webhooks" className="hover:text-gray-900 dark:hover:text-white transition-colors">Webhooks</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link href="#troubleshooting" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help</Link></li>
                <li><Link href="#community" className="hover:text-gray-900 dark:hover:text-white transition-colors">Community</Link></li>
                <li><Link href="#status" className="hover:text-gray-900 dark:hover:text-white transition-colors">Status</Link></li>
                <li><Link href="#contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Buni Money Tracker. Built with ❤️ using Next.js and modern web technologies.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/dashboard" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;

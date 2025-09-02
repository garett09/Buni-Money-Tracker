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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Documentation</h1>
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
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Feature Navigation */}
              <nav className="space-y-2">
                {filteredFeatures.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveSection(feature.id)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === feature.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <feature.icon size={18} className="sm:text-xl" />
                    <span className="font-medium text-sm sm:text-base">{feature.title}</span>
                  </button>
                ))}
              </nav>
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
    </div>
  );
};

export default DocumentationPage;

'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import OptimizedDashboard from '@/app/components/OptimizedDashboard';
import { 
  FiBook, 
  FiTrendingUp, 
  FiTarget, 
  FiPieChart, 
  FiBarChart, 
  FiDollarSign, 
  FiBell, 
  FiZap,
  FiEye,
  FiSettings,
  FiHelpCircle,
  FiStar,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiFileText,
  FiSearch,
  FiBookOpen
} from 'react-icons/fi';

const DashboardPage = () => {
  const [showDocs, setShowDocs] = useState(false);
  const [activeFeature, setActiveFeature] = useState('overview');

  const dashboardFeatures = [
    {
      id: 'overview',
      title: 'Financial Overview',
      icon: FiEye,
      description: 'Get a complete picture of your financial health',
      features: [
        'Real-time balance tracking across all accounts',
        'Net worth calculation and trends',
        'Income vs expense analysis',
        'Monthly budget progress monitoring',
        'Quick financial health score'
      ]
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      icon: FiBarChart,
      description: 'Deep insights into your spending patterns',
      features: [
        'Interactive charts and graphs',
        'Category-based spending analysis',
        'Trend identification and forecasting',
        'Seasonal spending patterns',
        'Custom date range analysis'
      ]
    },
    {
      id: 'intelligence',
      title: 'AI-Powered Insights',
      icon: FiZap,
      description: 'Smart recommendations and predictions',
      features: [
        'Intelligent budget recommendations',
        'Spending anomaly detection',
        'Savings opportunity identification',
        'Financial goal optimization',
        'Predictive financial planning'
      ]
    },
    {
      id: 'notifications',
      title: 'Smart Notifications',
      icon: FiBell,
      description: 'Stay informed about your finances',
      features: [
        'Budget threshold alerts',
        'Unusual spending notifications',
        'Bill due reminders',
        'Savings goal updates',
        'Financial health alerts'
      ]
    }
  ];

  const dashboardGuides = [
    {
      icon: FiTarget,
      title: 'Set Financial Goals',
      description: 'Define clear, achievable financial objectives and track your progress toward them.'
    },
    {
      icon: FiTrendingUp,
      title: 'Monitor Trends',
      description: 'Regularly review your dashboard to identify spending patterns and financial trends.'
    },
    {
      icon: FiPieChart,
      title: 'Analyze Categories',
      description: 'Use the analytics to understand where your money goes and find optimization opportunities.'
    },
    {
      icon: FiBell,
      title: 'Configure Alerts',
      description: 'Set up smart notifications to stay on top of important financial events and deadlines.'
    }
  ];

  const quickReference = [
    {
      step: 1,
      title: 'Review Your Overview',
      description: 'Check your financial summary and key metrics at the top of the dashboard'
    },
    {
      step: 2,
      title: 'Explore Analytics',
      description: 'Dive into detailed charts and spending breakdowns for deeper insights'
    },
    {
      step: 3,
      title: 'Check Notifications',
      description: 'Review any alerts or recommendations from the intelligent system'
    },
    {
      step: 4,
      title: 'Take Action',
      description: 'Use insights to make informed financial decisions and adjustments'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Financial Dashboard</h1>
              <p className="text-blue-100 text-lg">
                Your comprehensive financial command center
              </p>
            </div>
            <button
              onClick={() => setShowDocs(!showDocs)}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              title="Dashboard Documentation"
            >
              <FiBookOpen size={24} />
            </button>
          </div>
        </div>

        {/* Documentation Section */}
        {showDocs && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FiFileText className="text-blue-500" size={28} />
              Dashboard Documentation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Feature Documentation</h3>
                <div className="space-y-3">
                  {dashboardFeatures.map((feature) => (
                    <div 
                      key={feature.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        activeFeature === feature.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                      onClick={() => setActiveFeature(feature.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <feature.icon className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{feature.description}</p>
                      <ul className="space-y-1">
                        {feature.features.map((feat, index) => (
                          <li key={index} className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <FiCheckCircle size={12} className="text-green-500" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Usage Guides</h3>
                <div className="space-y-3">
                  {dashboardGuides.map((guide, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <guide.icon className="text-blue-600 dark:text-blue-400" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{guide.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">{guide.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiSearch className="text-green-500" size={20} />
                Quick Reference Guide
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {quickReference.map((step) => (
                    <li key={step.step} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <span className="font-medium">{step.title}</span>
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiInfo className="text-blue-500" size={20} />
                Additional Resources
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Help & Support</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Visit our comprehensive documentation</li>
                    <li>• Check the help center for detailed guides</li>
                    <li>• Contact support for technical issues</li>
                    <li>• Join our community forum</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Advanced Features</h4>
                  <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <li>• Custom dashboard configurations</li>
                    <li>• Advanced analytics and reporting</li>
                    <li>• API access for developers</li>
                    <li>• Integration with other tools</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Component */}
        <OptimizedDashboard />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

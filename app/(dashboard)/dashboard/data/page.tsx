'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import DataManagement from '@/app/components/DataManagement';
import { requireAuth } from '@/app/lib/auth';
import { 
  FiBook, 
  FiHelpCircle, 
  FiInfo, 
  FiDownload, 
  FiUpload, 
  FiRefreshCw, 
  FiShield, 
  FiDatabase,
  FiCloud,
  FiLock,
  FiCheckCircle,
  FiAlertTriangle,
  FiStar,
  FiTarget,
  FiZap,
  FiEye,
  FiSettings
} from 'react-icons/fi';

const DataManagementPage = () => {
  // Check authentication on component mount
  useEffect(() => {
    requireAuth();
  }, []);

  const [showHelp, setShowHelp] = useState(false);
  const [activeFeature, setActiveFeature] = useState('overview');

  const dataFeatures = [
    {
      id: 'overview',
      title: 'Data Overview',
      icon: FiEye,
      description: 'Complete visibility into your financial data',
      features: [
        'Real-time data synchronization',
        'Cross-device data access',
        'Automatic backup systems',
        'Data integrity monitoring',
        'Performance analytics'
      ]
    },
    {
      id: 'import',
      title: 'Data Import',
      icon: FiUpload,
      description: 'Bring your existing financial data',
      features: [
        'CSV file import support',
        'Bank statement uploads',
        'Excel file compatibility',
        'Manual data entry',
        'Bulk transaction import'
      ]
    },
    {
      id: 'export',
      title: 'Data Export',
      icon: FiDownload,
      description: 'Export your data in multiple formats',
      features: [
        'PDF report generation',
        'CSV data export',
        'Excel spreadsheet export',
        'JSON data format',
        'Custom date ranges'
      ]
    },
    {
      id: 'sync',
      title: 'Synchronization',
      icon: FiRefreshCw,
      description: 'Keep data in sync across devices',
      features: [
        'Real-time cloud sync',
        'Offline data support',
        'Conflict resolution',
        'Version control',
        'Automatic updates'
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: FiShield,
      description: 'Protect your financial information',
      features: [
        'End-to-end encryption',
        'Two-factor authentication',
        'Secure data transmission',
        'Privacy controls',
        'GDPR compliance'
      ]
    }
  ];

  const dataManagementTips = [
    {
      icon: FiTarget,
      title: 'Regular Backups',
      description: 'Set up automatic backups to ensure your data is always safe and recoverable.'
    },
    {
      icon: FiEye,
      title: 'Monitor Data Health',
      description: 'Regularly check data integrity and resolve any synchronization issues promptly.'
    },
    {
      icon: FiShield,
      title: 'Secure Access',
      description: 'Use strong passwords and enable two-factor authentication for enhanced security.'
    },
    {
      icon: FiRefreshCw,
      title: 'Stay Updated',
      description: 'Keep your app updated to benefit from the latest security and performance improvements.'
    }
  ];

  const gettingStartedSteps = [
    {
      step: 1,
      title: 'Review Data Status',
      description: 'Check the current health and synchronization status of your financial data.'
    },
    {
      step: 2,
      title: 'Import Existing Data',
      description: 'Upload your current financial records from other applications or bank statements.'
    },
    {
      step: 3,
      title: 'Set Up Sync Preferences',
      description: 'Configure how often and when your data should synchronize across devices.'
    },
    {
      step: 4,
      title: 'Enable Auto-Backup',
      description: 'Turn on automatic backup features to protect your data from loss.'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Data Management</h1>
              <p className="text-purple-100 text-lg">
                Import, export, and synchronize your financial data securely
              </p>
            </div>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-3 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"
              title="Data Management Help"
            >
              <FiHelpCircle size={24} />
            </button>
          </div>
        </div>

        {/* Help Section */}
        {showHelp && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <FiBook className="text-purple-500" size={28} />
              Data Management Guide
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Core Features</h3>
                <div className="space-y-3">
                  {dataFeatures.map((feature) => (
                    <div 
                      key={feature.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        activeFeature === feature.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                      }`}
                      onClick={() => setActiveFeature(feature.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <feature.icon className="text-purple-600 dark:text-purple-400" size={20} />
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Management Tips</h3>
                <div className="space-y-3">
                  {dataManagementTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <tip.icon className="text-purple-600 dark:text-purple-400" size={16} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{tip.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Getting Started */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiInfo className="text-blue-500" size={20} />
                Getting Started with Data Management
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {gettingStartedSteps.map((step) => (
                    <li key={step.step} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
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

            {/* Security Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiShield className="text-green-500" size={20} />
                Security & Privacy
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Data Protection</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• End-to-end encryption</li>
                    <li>• Secure cloud storage</li>
                    <li>• Regular security audits</li>
                    <li>• Compliance with regulations</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Privacy Controls</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Data anonymization</li>
                    <li>• User consent management</li>
                    <li>• Data deletion options</li>
                    <li>• Transparent data practices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FiUpload className="text-purple-600 dark:text-purple-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Import Options</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">Multiple Formats</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <FiDownload className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Export Formats</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">PDF, CSV, Excel</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FiRefreshCw className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sync Status</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">Real-time</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Data Management Component */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <DataManagement />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DataManagementPage;

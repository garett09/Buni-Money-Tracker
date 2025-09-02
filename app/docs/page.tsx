'use client';

import React, { useState } from 'react';
import { FiBook, FiSearch, FiArrowRight, FiCode, FiPlay, FiSettings, FiDatabase, FiTarget, FiTrendingUp, FiDollarSign, FiShield, FiFileText, FiStar, FiClock, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

const DocumentationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');

  const tutorialSteps = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: FiPlay,
      color: 'from-blue-500 to-cyan-600',
      steps: [
        { 
          id: 'step-1', 
          title: 'Step 1: Create Your Account', 
          description: 'Sign up and get started in minutes',
          stepNumber: 1,
          estimatedTime: '2 minutes'
        },
        { 
          id: 'step-2', 
          title: 'Step 2: Add Your First Bank Account', 
          description: 'Connect your primary bank account',
          stepNumber: 2,
          estimatedTime: '3 minutes'
        },
        { 
          id: 'step-3', 
          title: 'Step 3: Set Up Your Budget', 
          description: 'Create your first monthly budget',
          stepNumber: 3,
          estimatedTime: '5 minutes'
        },
        { 
          id: 'step-4', 
          title: 'Step 4: Track Your First Transaction', 
          description: 'Record your first expense or income',
          stepNumber: 4,
          estimatedTime: '2 minutes'
        }
      ]
    },
    {
      id: 'core-features',
      title: 'Master the Basics',
      icon: FiSettings,
      color: 'from-emerald-500 to-green-600',
      steps: [
        { 
          id: 'step-5', 
          title: 'Step 5: Dashboard Navigation', 
          description: 'Learn to navigate your financial dashboard',
          stepNumber: 5,
          estimatedTime: '4 minutes'
        },
        { 
          id: 'step-6', 
          title: 'Step 6: Budget Management', 
          description: 'Create and manage monthly budgets',
          stepNumber: 6,
          estimatedTime: '6 minutes'
        },
        { 
          id: 'step-7', 
          title: 'Step 7: Expense Tracking', 
          description: 'Track daily expenses and categorize spending',
          stepNumber: 7,
          estimatedTime: '5 minutes'
        },
        { 
          id: 'step-8', 
          title: 'Step 8: Income Management', 
          description: 'Manage multiple income sources',
          stepNumber: 8,
          estimatedTime: '4 minutes'
        }
      ]
    },
    {
      id: 'advanced-features',
      title: 'Advanced Techniques',
      icon: FiCode,
      color: 'from-purple-500 to-pink-600',
      steps: [
        { 
          id: 'step-9', 
          title: 'Step 9: Savings Goals', 
          description: 'Set and track financial objectives',
          stepNumber: 9,
          estimatedTime: '7 minutes'
        },
        { 
          id: 'step-10', 
          title: 'Step 10: Analytics & Reports', 
          description: 'Analyze your financial patterns',
          stepNumber: 10,
          estimatedTime: '8 minutes'
        },
        { 
          id: 'step-11', 
          title: 'Step 11: AI Notifications', 
          description: 'Set up smart financial alerts',
          stepNumber: 11,
          estimatedTime: '5 minutes'
        },
        { 
          id: 'step-12', 
          title: 'Step 12: Shared Expenses', 
          description: 'Split bills with family and friends',
          stepNumber: 12,
          estimatedTime: '6 minutes'
        }
      ]
    },
    {
      id: 'data-management',
      title: 'Data & Security',
      icon: FiDatabase,
      color: 'from-orange-500 to-red-600',
      steps: [
        { 
          id: 'step-13', 
          title: 'Step 13: Import & Export', 
          description: 'Transfer data from other financial apps',
          stepNumber: 13,
          estimatedTime: '5 minutes'
        },
        { 
          id: 'step-14', 
          title: 'Step 14: Backup & Restore', 
          description: 'Secure your financial data',
          stepNumber: 14,
          estimatedTime: '4 minutes'
        },
        { 
          id: 'step-15', 
          title: 'Step 15: Data Sync', 
          description: 'Keep data in sync across devices',
          stepNumber: 15,
          estimatedTime: '3 minutes'
        }
      ]
    },
    {
      id: 'pro-tips',
      title: 'Pro Tips & Tricks',
      icon: FiStar,
      color: 'from-indigo-500 to-purple-600',
      steps: [
        { 
          id: 'step-16', 
          title: 'Step 16: Keyboard Shortcuts', 
          description: 'Speed up your workflow',
          stepNumber: 16,
          estimatedTime: '3 minutes'
        },
        { 
          id: 'step-17', 
          title: 'Step 17: Custom Categories', 
          description: 'Create personalized spending categories',
          stepNumber: 17,
          estimatedTime: '4 minutes'
        },
        { 
          id: 'step-18', 
          title: 'Step 18: Mobile Optimization', 
          description: 'Get the most from mobile app',
          stepNumber: 18,
          estimatedTime: '5 minutes'
        }
      ]
    }
  ];

  const filteredSections = tutorialSteps.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.steps.some(step =>
      step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      step.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderTutorialContent = (activeSection: string) => {
    // If no specific step is selected, show section overview
    if (!activeSection.includes('-')) {
      const section = tutorialSteps.find(s => s.id === activeSection);
      if (!section) return <div>Select a tutorial section to begin</div>;
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center mx-auto mb-4`}>
              <section.icon size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Follow these steps to master {section.title.toLowerCase()}
            </p>
          </div>
          
          <div className="grid gap-4">
            {section.steps.map((step) => (
              <div key={step.id} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">{step.stepNumber}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">{step.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-2">
                        <FiClock size={16} />
                        {step.estimatedTime}
                      </span>
                      <button 
                        onClick={() => setActiveSection(`${section.id}-${step.id}`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Start Step
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Show specific step content
    const [sectionId, stepId] = activeSection.split('-');
    const section = tutorialSteps.find(s => s.id === sectionId);
    const step = section?.steps.find(st => st.id === stepId);
    
    if (!section || !step) return <div>Step not found</div>;
    
    return (
      <div className="space-y-6">
        {/* Step Header */}
        <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button 
              onClick={() => setActiveSection(sectionId)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowRight size={20} className="rotate-180" />
            </button>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${section.color} flex items-center justify-center`}>
              <span className="text-white font-bold text-lg">{step.stepNumber}</span>
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold">{step.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <FiClock size={16} />
              Estimated time: {step.estimatedTime}
            </span>
            <span className="flex items-center gap-2">
              <FiTarget size={16} />
              {section.title}
            </span>
          </div>
        </div>
        
        {/* Step Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {renderStepContent(sectionId, stepId)}
        </div>
        
        {/* Step Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => navigateToStep(sectionId, step.stepNumber - 1)}
            disabled={step.stepNumber === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous Step
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {step.stepNumber} of {section.steps.length}
          </div>
          
          <button 
            onClick={() => navigateToStep(sectionId, step.stepNumber + 1)}
            disabled={step.stepNumber === section.steps.length}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Step →
          </button>
        </div>
      </div>
    );
  };
  
  const navigateToStep = (sectionId: string, stepNumber: number) => {
    const section = tutorialSteps.find(s => s.id === sectionId);
    if (!section) return;
    
    const step = section.steps.find(st => st.stepNumber === stepNumber);
    if (step) {
      setActiveSection(`${sectionId}-${step.id}`);
    }
  };
  
  const renderStepContent = (sectionId: string, stepId: string) => {
    const content: Record<string, Record<string, { title: string; content: string; tips?: string[]; warnings?: string[] }>> = {
      'getting-started': {
        'step-1': {
          title: 'Create Your Account',
          content: `
            <h3>Welcome to Buni Money Tracker!</h3>
            <p>Let's get you started with your financial journey. This first step will take you just 2 minutes.</p>
            
            <h4>What You'll Need</h4>
            <ul>
              <li>A valid email address</li>
              <li>A strong password</li>
              <li>Basic personal information</li>
            </ul>
            
            <h4>Step-by-Step Instructions</h4>
            <ol>
              <li><strong>Visit the Website</strong>: Go to <code>https://buni-money-tracker.vercel.app</code></li>
              <li><strong>Click Sign Up</strong>: Look for the "Sign Up" or "Create Account" button</li>
              <li><strong>Fill in Your Details</strong>:
                <ul>
                  <li>Enter your full name</li>
                  <li>Provide your email address</li>
                  <li>Create a secure password</li>
                  <li>Confirm your password</li>
                </ul>
              </li>
              <li><strong>Verify Your Email</strong>: Check your inbox and click the verification link</li>
              <li><strong>Complete Setup</strong>: Log in to your new account</li>
            </ol>
            
            <h4>Security Tips</h4>
            <ul>
              <li>Use a unique password that you don't use elsewhere</li>
              <li>Enable two-factor authentication if available</li>
              <li>Keep your login credentials secure</li>
            </ul>
          `,
          tips: [
            'Use a password manager for better security',
            'Consider using your real name for better personalization',
            'Bookmark the login page for easy access'
          ],
          warnings: [
            'Never share your login credentials',
            'Use a private device for account creation',
            'Avoid using public Wi-Fi for sensitive information'
          ]
        },
        'step-2': {
          title: 'Add Your First Bank Account',
          content: `
            <h3>Connect Your Primary Bank Account</h3>
            <p>Now that you have an account, let's connect your first bank account to start tracking your finances.</p>
            
            <h4>Before You Begin</h4>
            <ul>
              <li>Have your bank account information ready</li>
              <li>Know your current account balance</li>
              <li>Ensure you have internet banking access</li>
            </ul>
            
            <h4>Step-by-Step Instructions</h4>
            <ol>
              <li><strong>Navigate to Accounts</strong>: From the dashboard, click on "Accounts" in the sidebar</li>
              <li><strong>Add New Account</strong>: Click the "Add Account" or "+" button</li>
              <li><strong>Select Account Type</strong>:
                <ul>
                  <li>Savings Account</li>
                  <li>Checking Account</li>
                  <li>Credit Card</li>
                  <li>Investment Account</li>
                </ul>
              </li>
              <li><strong>Enter Account Details</strong>:
                <ul>
                  <li>Bank name (e.g., "Bank of America", "Chase")</li>
                  <li>Account nickname (e.g., "Main Checking", "Emergency Fund")</li>
                  <li>Current balance</li>
                  <li>Account number (optional for manual tracking)</li>
                </ul>
              </li>
              <li><strong>Set Account Color</strong>: Choose a color to distinguish this account</li>
              <li><strong>Save Account</strong>: Click "Save" to add the account</li>
            </ol>
            
            <h4>Account Organization Tips</h4>
            <ul>
              <li>Use descriptive nicknames for easy identification</li>
              <li>Group similar accounts with similar colors</li>
              <li>Start with your primary checking and savings accounts</li>
            </ul>
          `,
          tips: [
            'Start with your main checking account',
            'Use the current balance as of today',
            'You can always update the balance later'
          ],
          warnings: [
            'Never enter your actual account password',
            'Only share account numbers if you trust the platform',
            'Consider using account nicknames instead of real account numbers'
          ]
        }
      }
    };
    
    const stepContent = content[sectionId]?.[stepId];
    if (!stepContent) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mx-auto mb-6">
            <FiBook size={48} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tutorial Content Coming Soon</h3>
          <p className="text-gray-600 dark:text-gray-300">
            We're working on comprehensive tutorial content for this step. Check back soon!
          </p>
        </div>
      );
    }
    
    return (
      <div>
        <div dangerouslySetInnerHTML={{ __html: stepContent.content }} />
        
        {stepContent.tips && stepContent.tips.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
              <FiCheckCircle size={20} className="text-green-600" />
              Pro Tips
            </h4>
            <ul className="space-y-1">
              {stepContent.tips.map((tip, index) => (
                <li key={index} className="text-green-700 dark:text-green-300 text-sm">• {tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {stepContent.warnings && stepContent.warnings.length > 0 && (
          <div className="mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
              <FiAlertTriangle size={20} className="text-yellow-600" />
              Important Warnings
            </h4>
            <ul className="space-y-1">
              {stepContent.warnings.map((warning, index) => (
                <li key={index} className="text-yellow-700 dark:text-yellow-300 text-sm">• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

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
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiBook size={16} className="sm:text-xl text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Tutorial</h1>
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
                    placeholder="Search tutorial steps..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Tutorial Navigation */}
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-left transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <section.icon size={18} className="sm:text-xl" />
                      <span className="font-medium text-sm sm:text-base">{section.title}</span>
                    </button>
                    
                    {activeSection === section.id && (
                      <div className="ml-4 sm:ml-8 space-y-1">
                        {section.steps.map((step) => (
                          <button
                            key={step.id}
                            onClick={() => setActiveSection(`${section.id}-${step.id}`)}
                            className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                              activeSection === `${section.id}-${step.id}`
                                ? 'text-blue-600 dark:text-blue-400 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                                {step.stepNumber}
                              </span>
                              <span className="truncate">{step.title}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
              {renderTutorialContent(activeSection)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;

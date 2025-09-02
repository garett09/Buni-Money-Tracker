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
    },
    {
      id: 'core-features',
      title: 'Core Features',
      icon: FiCode,
      color: 'from-green-500 to-teal-600',
      description: 'The foundation of financial mastery',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Core Features - The Foundation of Financial Mastery</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            The core features of Buni Money Tracker form the backbone of your financial management experience. Each feature is designed with precision and purpose, working together to provide you with comprehensive control over your financial life. These features are not just tools—they are intelligent systems that learn, adapt, and grow with you.
          </p>
          
          <div className="space-y-8">
            {/* Transaction Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <FiDollarSign className="text-green-500" size={24} />
                Transaction Management - The Heart of Your Financial Data
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Transaction management is the fundamental building block of Buni Money Tracker. This sophisticated system handles every aspect of your financial transactions, from initial capture to final analysis. The system operates on a real-time basis, ensuring that your financial picture is always current and accurate.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Income Tracking & Management</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Multiple Income Sources</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The platform automatically detects and categorizes different types of income, including salary, freelance work, investment returns, rental income, and side hustles. Each income source is tracked separately, allowing you to analyze which streams are most profitable and reliable.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Recurring Income Setup</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The system intelligently identifies recurring income patterns and automatically sets up income schedules. It can handle complex scenarios like bi-weekly paychecks, monthly bonuses, quarterly dividends, and irregular freelance payments. This automation ensures you never miss tracking an income source.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Income Categorization</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Using advanced natural language processing, the platform automatically categorizes income based on transaction descriptions, sender information, and historical patterns. It learns from your corrections to improve accuracy over time, creating a personalized income classification system.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Income vs Expense Analysis</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The system continuously analyzes your income-to-expense ratio, providing real-time insights into your financial health. It tracks trends over time, identifying periods of financial strength and vulnerability, and suggests strategies to improve your financial position.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Expense Tracking & Intelligence</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Real-time Expense Logging</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Every expense is captured in real-time as it occurs, whether through automatic bank synchronization or manual entry. The system processes transactions immediately, updating your budget, spending categories, and financial insights in real-time. This instant feedback helps you make informed decisions about your spending.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Smart Categorization Engine</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The AI-powered categorization system analyzes multiple data points to accurately classify expenses: transaction descriptions, merchant names, amounts, timing, location data, and historical patterns. It can distinguish between essential expenses (groceries, utilities) and discretionary spending (entertainment, dining out).
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Receipt Management & Storage</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The platform allows you to photograph and store receipts digitally, automatically extracting key information like amounts, dates, and merchant details. These receipts are securely stored and linked to their corresponding transactions, providing a complete audit trail for tax purposes and expense verification.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Intelligent Spending Alerts</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The system monitors your spending patterns and sends intelligent alerts when unusual activity is detected. It can identify potential fraud, overspending in specific categories, or deviations from your normal spending patterns. These alerts are personalized and avoid notification fatigue.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <FiTarget className="text-blue-500" size={24} />
                Budget Management - Your Financial Roadmap to Success
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Budget management in Buni Money Tracker goes far beyond simple spending limits. It's an intelligent, adaptive system that learns your financial behavior, predicts future needs, and automatically adjusts to help you achieve your financial goals. The system operates on multiple levels, from broad monthly budgets to granular category-specific allocations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Monthly Budget Architecture</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Custom Budget Categories</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The platform provides a comprehensive set of predefined budget categories while allowing complete customization. You can create subcategories, merge categories, or create entirely new ones. The system learns from your categorization preferences and suggests improvements based on your spending patterns.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Budget vs Actual Tracking</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Real-time comparison between your budgeted amounts and actual spending provides immediate feedback on your financial discipline. The system calculates variance percentages, identifies over-budget categories, and suggests adjustments to keep you on track. This tracking happens continuously, not just at month-end.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Budget Rollover Options</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Flexible rollover options allow you to carry forward unused budget amounts to future periods. You can choose which categories roll over, how much rolls over, and whether rollovers are automatic or require approval. This feature helps you build savings in specific areas over time.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Intelligent Budget Notifications</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The system sends proactive notifications based on your spending pace and budget status. It can warn you when you're approaching budget limits, suggest category adjustments when you're under-budget, and provide early warnings about potential overspending. These notifications are timed to be actionable.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Category Budget Intelligence</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Essential Living Expenses</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Core categories like housing, utilities, groceries, and transportation are automatically prioritized in your budget. The system analyzes your historical spending in these areas to suggest realistic budget amounts, accounting for seasonal variations and lifestyle changes.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Discretionary Spending Control</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Entertainment, dining out, shopping, and other discretionary categories are carefully managed to prevent overspending. The system can implement spending limits, require approval for large purchases, or suggest alternatives when you're approaching limits in these areas.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Savings & Investment Allocation</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The platform automatically allocates portions of your income to savings and investment categories based on your financial goals. It can implement the 50/30/20 rule, prioritize emergency fund contributions, or follow custom allocation strategies you define.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Dynamic Budget Adjustments</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The system continuously monitors your financial situation and suggests budget adjustments when needed. It can recommend increasing certain categories during high-spending periods, suggest cuts when income decreases, or reallocate funds to take advantage of savings opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <FiPieChart className="text-purple-500" size={24} />
                Account Management - Centralized Control of All Your Financial Assets
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Account management provides you with a unified view of all your financial accounts, regardless of where they're held. This system goes beyond simple balance tracking to provide comprehensive account analysis, optimization recommendations, and strategic insights that help you make the most of your financial resources.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Comprehensive Account Types</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Deposit Accounts</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Checking and savings accounts are automatically categorized and monitored for optimal cash flow management. The system tracks interest rates, fees, and minimum balance requirements, suggesting ways to maximize your returns and minimize costs. It can also identify opportunities to move funds between accounts for better rates.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Credit & Loan Accounts</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Credit cards, personal loans, and other debt accounts are carefully monitored for optimal management. The system tracks interest rates, payment due dates, and credit utilization, suggesting strategies to minimize interest costs and improve your credit score. It can also recommend debt consolidation opportunities.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Investment & Retirement Accounts</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Investment accounts, 401(k)s, IRAs, and other retirement vehicles are tracked for performance and contribution optimization. The system monitors asset allocation, suggests rebalancing opportunities, and ensures you're maximizing tax-advantaged contributions. It can also identify opportunities to increase investment contributions.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Alternative Financial Instruments</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The platform can track cryptocurrency holdings, peer-to-peer lending accounts, and other alternative financial instruments. It provides risk assessment, performance tracking, and integration with traditional financial planning to give you a complete picture of your financial position.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Advanced Account Features</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Real-time Balance Tracking</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        All account balances are updated in real-time through secure API connections, providing you with an accurate, current view of your financial position. The system can handle multiple currencies, account types, and financial institutions simultaneously, ensuring comprehensive coverage of your financial landscape.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Account Reconciliation & Verification</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The platform automatically reconciles transactions across accounts, identifying discrepancies, duplicate entries, and potential errors. It provides detailed reconciliation reports and can flag unusual activity that might require your attention. This feature ensures the accuracy and integrity of your financial data.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Intelligent Transfer Management</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        The system can suggest optimal transfer strategies between accounts, such as moving excess funds from checking to high-yield savings, or consolidating balances to meet minimum requirements for better rates. It can also automate recurring transfers based on your financial goals and cash flow patterns.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Strategic Account Grouping</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Accounts can be grouped by purpose (daily spending, emergency savings, long-term investments) or by financial institution for easier management. The system can provide insights on how to optimize your account structure, suggesting ways to reduce fees, increase returns, or improve your financial organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Analytics */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-3">�� Advanced Analytics & Insights</h3>
              <p className="text-indigo-800 dark:text-indigo-200 mb-4">
                Beyond basic tracking, the platform provides sophisticated analytics that transform raw financial data into actionable insights. These analytics operate on multiple levels, from individual transaction analysis to comprehensive financial health scoring.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Spending Pattern Analysis</h4>
                  <ul className="space-y-2 text-indigo-800 dark:text-indigo-200 text-sm">
                    <li>• Seasonal spending variations and trend identification</li>
                    <li>• Merchant and category spending correlations</li>
                    <li>• Behavioral spending pattern recognition</li>
                    <li>• Anomaly detection for fraud prevention</li>
                    <li>• Predictive spending forecasting</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Financial Health Metrics</h4>
                  <ul className="space-y-2 text-indigo-800 dark:text-indigo-200 text-sm">
                    <li>• Net worth tracking and trend analysis</li>
                    <li>• Debt-to-income ratio monitoring</li>
                    <li>• Savings rate calculation and optimization</li>
                    <li>• Emergency fund adequacy assessment</li>
                    <li>• Retirement readiness scoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'savings-goals',
      title: 'Savings Goals',
      icon: FiGift,
      color: 'from-yellow-500 to-orange-600',
      description: 'Achieve your financial dreams with Buni Money Tracker',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Savings Goals - Achieve Your Financial Dreams</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Buni Money Tracker empowers you to set and track your financial goals with precision. Whether you're saving for a vacation, a down payment on a house, or planning for retirement, the platform provides the tools and insights to make your dreams a reality.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-100 mb-3">�� Savings Goals</h3>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
                <li>• Set specific, measurable, achievable, relevant, and time-bound (SMART) savings goals</li>
                <li>• Track progress towards your goals in real-time</li>
                <li>• Receive personalized recommendations for achieving your goals</li>
                <li>• Visualize your savings journey with progress bars and charts</li>
                <li>• Get alerts when you're on track or need to adjust</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-red-800 dark:text-red-200">
                <li>• Define your savings goals (e.g., $10,000 for vacation, $50,000 for house)</li>
                <li>• Set a target date for each goal</li>
                <li>• Track your current savings and expenses</li>
                <li>• Use the platform's budgeting and analytics features to guide your savings</li>
                <li>• Regularly review and adjust your goals as your financial situation changes</li>
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
                <p className="text-sm text-purple-800 dark:text-purple-200">Define Goal</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Track Progress</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Achieve</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: FiBarChart,
      color: 'from-indigo-500 to-purple-600',
      description: 'Make informed decisions with powerful reports and analytics',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Reports & Analytics - Make Informed Decisions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Buni Money Tracker provides comprehensive reports and analytics that empower you to understand your financial history, identify trends, and make data-driven decisions. Whether you're a beginner or an experienced investor, these reports will help you gain clarity and confidence in your financial journey.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <h3 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-3">📊 Reports & Analytics</h3>
              <ul className="space-y-2 text-indigo-800 dark:text-indigo-200">
                <li>• Detailed transaction history and categorization</li>
                <li>• Real-time spending and income trends</li>
                <li>• Budget vs Actual comparison</li>
                <li>• Category-specific spending breakdowns</li>
                <li>• Net worth and asset allocation reports</li>
                <li>• Debt-to-income ratio analysis</li>
                <li>• Savings rate and efficiency metrics</li>
                <li>• Investment performance tracking</li>
                <li>• Retirement readiness assessment</li>
                <li>• Customizable report generation</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• Review your transaction history to understand your spending patterns</li>
                <li>• Analyze trends in income, expenses, and savings</li>
                <li>• Identify areas where you can optimize your spending</li>
                <li>• Use the platform's budgeting and goal-setting features to guide your financial decisions</li>
                <li>• Regularly generate reports to track your progress</li>
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
                <p className="text-sm text-purple-800 dark:text-purple-200">Review History</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Analyze Trends</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Make Decisions</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: FiShield,
      color: 'from-red-500 to-pink-600',
      description: 'Your financial data is protected with the highest standards',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Security & Privacy - Your Financial Data is Protected</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Buni Money Tracker prioritizes the security and privacy of your financial data. We employ industry-standard encryption, secure data storage, and strict access controls to ensure your sensitive information remains confidential and protected.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">🔒 Security & Privacy</h3>
              <ul className="space-y-2 text-red-800 dark:text-red-200">
                <li>• End-to-end encryption for all data in transit and at rest</li>
                <li>• Secure multi-factor authentication</li>
                <li>• Two-factor verification for critical actions</li>
                <li>• Regular security audits and penetration testing</li>
                <li>• Strict access controls and role-based permissions</li>
                <li>• Secure data storage in ISO 27001 certified data centers</li>
                <li>• Encrypted backups and disaster recovery</li>
                <li>• Secure API integrations with banks and financial institutions</li>
                <li>• Transparency about data usage and sharing</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• Enable two-factor authentication on your account</li>
                <li>• Use strong, unique passwords for all your accounts</li>
                <li>• Regularly review your account activity and settings</li>
                <li>• Be cautious of phishing attempts and suspicious links</li>
                <li>• Keep your device and app updated with the latest security patches</li>
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
                <p className="text-sm text-purple-800 dark:text-purple-200">Enable 2FA</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Review Activity</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Stay Secure</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mobile-app',
      title: 'Mobile App',
      icon: FiSmartphone,
      color: 'from-teal-500 to-cyan-600',
      description: 'Track your finances on the go with our intuitive mobile app',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Mobile App - Track Your Finances on the Go</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Buni Money Tracker is available on iOS and Android, providing you with the freedom to manage your finances from anywhere, at any time. Our mobile app is designed with simplicity and efficiency in mind, ensuring you can stay on top of your financial life even on the move.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 p-6 rounded-xl border border-teal-200 dark:border-teal-800">
              <h3 className="text-xl font-semibold text-teal-900 dark:text-teal-100 mb-3">📱 Mobile App</h3>
              <ul className="space-y-2 text-teal-800 dark:text-teal-200">
                <li>• Real-time financial data synchronization</li>
                <li>• Secure login and session management</li>
                <li>• Push notifications for important alerts</li>
                <li>• Offline transaction capture</li>
                <li>• Quick access to reports and analytics</li>
                <li>• Seamless integration with your bank accounts</li>
                <li>• Dark mode for night-time use</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• Download the app from your device's app store</li>
                <li>• Connect your bank accounts securely</li>
                <li>• Set up your first budget and savings goal</li>
                <li>• Start tracking transactions and expenses</li>
                <li>• Explore all features on your mobile device</li>
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
                <p className="text-sm text-purple-800 dark:text-purple-200">Download App</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Connect Bank</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Track</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: FiHelpCircle,
      color: 'from-gray-500 to-gray-600',
      description: 'Frequently asked questions about Buni Money Tracker',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">FAQ - Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            If you have any questions about Buni Money Tracker, we've got answers. From how to get started to understanding advanced features, our FAQ section is designed to help you find the information you need quickly and easily.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">🤔 Common Questions</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li>
                  <h4 className="font-medium text-gray-900 dark:text-white">How do I add a new bank account?</h4>
                  <p>You can add a bank account by clicking on the "Add Account" button in the dashboard and following the secure connection process with your financial institution. Buni Money Tracker uses secure OAuth 2.0 and Open Banking standards to connect your accounts.</p>
                </li>
                <li>
                  <h4 className="font-medium text-gray-900 dark:text-white">Can I manually enter transactions?</h4>
                  <p>Yes, you can manually enter transactions for any account, including bank accounts, credit cards, or cash. This is useful for transactions that might not be automatically synced or for manual expenses/income.</p>
                </li>
                <li>
                  <h4 className="font-medium text-gray-900 dark:text-white">How accurate is the AI categorization?</h4>
                  <p>The AI categorization engine is highly accurate and learns from your corrections. It uses advanced natural language processing, machine learning, and historical patterns to categorize transactions. However, you can always manually correct or refine the categorization.</p>
                </li>
                <li>
                  <h4 className="font-medium text-gray-900 dark:text-white">Is my data encrypted in transit and at rest?</h4>
                  <p>Yes, all data transmitted between your device and our servers is encrypted using TLS 1.2 or higher. Your data is also encrypted at rest in our ISO 27001 certified data centers and backed up securely.</p>
                </li>
                <li>
                  <h4 className="font-medium text-gray-900 dark:text-white">Can I export my financial data?</h4>
                  <p>Yes, you can export your financial data in various formats including CSV, PDF, and Excel. This is particularly useful for tax purposes or for long-term data retention.</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• Check the FAQ section for answers to your questions</li>
                <li>• If your question is not answered, you can contact our support team</li>
                <li>• We are constantly updating and expanding the FAQ</li>
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
                <p className="text-sm text-purple-800 dark:text-purple-200">Check FAQ</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Contact Support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Stay Informed</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API & Integrations',
      icon: FiZap,
      color: 'from-purple-500 to-pink-600',
      description: 'Extend Buni Money Tracker with custom integrations and automation',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">API & Integrations - Extend Your Financial Management</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Buni Money Tracker's robust API allows you to integrate with other applications, automate tasks, and build custom solutions. Whether you're a developer, a financial advisor, or a business owner, the API enables you to create powerful, data-driven applications that work seamlessly with your existing tools.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">🔌 API & Integrations</h3>
              <ul className="space-y-2 text-purple-800 dark:text-purple-200">
                <li>• Secure, RESTful API for programmatic access to your financial data</li>
                <li>• Comprehensive documentation and examples for common use cases</li>
                <li>• Real-time data synchronization</li>
                <li>• Webhook notifications for important events</li>
                <li>• OAuth 2.0 for secure authentication</li>
                <li>• Rate limiting and API keys for security</li>
                <li>• Flexible data export options</li>
                <li>• Comprehensive error handling and logging</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• Review our API documentation for detailed information</li>
                <li>• Sign up for an API key and test the API endpoints</li>
                <li>• Explore available integrations and third-party tools</li>
                <li>• Build your own custom application or integration</li>
                <li>• Join our developer community for support and feedback</li>
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
                <p className="text-sm text-purple-800 dark:text-purple-200">Review API Docs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Test Endpoints</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Build Integration</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'support',
      title: 'Support',
      icon: FiMessageCircle,
      color: 'from-red-500 to-pink-600',
      description: 'Get help and assistance whenever you need it',
      content: (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Support - Get Help and Assistance</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Buni Money Tracker offers multiple channels for support to ensure you get the help you need, whenever you need it. Whether you're a new user or an experienced user, our friendly support team is here to assist you.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-3">📞 Support</h3>
              <ul className="space-y-2 text-red-800 dark:text-red-200">
                <li>• Email support: [support@bunimoneytracker.com]</li>
                <li>• Phone support: [+1 (800) 123-4567]</li>
                <li>• Live chat: Available on our website</li>
                <li>• Knowledge base: Comprehensive guides and articles</li>
                <li>• Community forums: Share tips and ask questions</li>
                <li>• Priority support for premium users</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">🚀 Getting Started</h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• Check our knowledge base for answers to common questions</li>
                <li>• If you need immediate assistance, contact our support team</li>
                <li>• We strive to respond to all inquiries within 24 hours</li>
                <li>• Join our community for additional support and tips</li>
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
                <p className="text-sm text-purple-800 dark:text-purple-200">Check KB</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">2</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Contact Support</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-700 dark:text-purple-300 font-bold">3</span>
                </div>
                <p className="text-sm text-purple-800 dark:text-purple-200">Stay Informed</p>
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
              {/* Beautiful Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="relative p-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                <div className="relative">
                  {theme === 'dark' ? (
                    <FiSun size={22} className="text-yellow-500 drop-shadow-lg animate-pulse" />
                  ) : (
                    <FiMoon size={22} className="text-indigo-600 drop-shadow-lg" />
                  )}
                  {/* Glow effect */}
                  <div className={`absolute inset-0 rounded-full blur-md ${
                    theme === 'dark' 
                      ? 'bg-yellow-400/30 animate-ping' 
                      : 'bg-indigo-400/30'
                  }`}></div>
                </div>
              </button>
              
              {/* Logo */}
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                <FiBook size={20} className="text-white drop-shadow-md" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Buni Money Tracker Docs
              </h1>
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
                  <button
                    onClick={() => setActiveSection('core-features')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    💰 Core Features
                  </button>
                  <button
                    onClick={() => setActiveSection('savings-goals')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    🎯 Savings Goals
                  </button>
                  <button
                    onClick={() => setActiveSection('reports')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    📊 Reports & Analytics
                  </button>
                  <button
                    onClick={() => setActiveSection('security')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    🔒 Security & Privacy
                  </button>
                  <button
                    onClick={() => setActiveSection('mobile-app')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    📱 Mobile App
                  </button>
                  <button
                    onClick={() => setActiveSection('faq')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    ❓ FAQ
                  </button>
                  <button
                    onClick={() => setActiveSection('api')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    🔌 API & Integrations
                  </button>
                  <button
                    onClick={() => setActiveSection('support')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    📞 Support
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

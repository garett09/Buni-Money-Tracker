'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiBell, 
  FiX, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiInfo, 
  FiTrendingUp, 
  FiTrendingDown,
  FiTarget,
  FiShield,
  FiDollarSign,
  FiClock,
  FiStar,
  FiZap
} from 'react-icons/fi';
import { getUserMonthlyBudget } from '@/app/lib/currency';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  icon: any;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  priority: 'low' | 'medium' | 'high';
}

interface SmartNotificationsProps {
  incomeTransactions: any[];
  expenseTransactions: any[];
  savingsGoals: any[];
  selectedPeriod: string;
}

const SmartNotifications: React.FC<SmartNotificationsProps> = ({
  incomeTransactions,
  expenseTransactions,
  savingsGoals,
  selectedPeriod
}) => {
  // Ensure props are arrays with fallbacks
  const safeIncomeTransactions = Array.isArray(incomeTransactions) ? incomeTransactions : [];
  const safeExpenseTransactions = Array.isArray(expenseTransactions) ? expenseTransactions : [];
  const safeSavingsGoals = Array.isArray(savingsGoals) ? savingsGoals : [];

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    generateNotifications();
  }, [safeIncomeTransactions, safeExpenseTransactions, safeSavingsGoals, selectedPeriod]);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const generateNotifications = () => {
    try {
      const newNotifications: Notification[] = [];

      // Use the safe arrays we defined at component level
      const incomeArray = safeIncomeTransactions;
      const expenseArray = safeExpenseTransactions;



            // Calculate financial metrics
      const totalIncome = incomeArray.reduce((sum, t) => sum + Math.abs(t?.amount || 0), 0);
      const totalExpenses = expenseArray.reduce((sum, t) => sum + Math.abs(t?.amount || 0), 0);
      const netBalance = totalIncome - totalExpenses;
      const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;
      // Monthly budget in Philippine Peso (₱)
      const monthlyBudget = getUserMonthlyBudget(); // User's current monthly budget
      const budgetUsagePercent = selectedPeriod === 'all-time' ? 0 : (totalExpenses / monthlyBudget) * 100;

      // Spending velocity analysis
      const dailySpending = totalExpenses / 30;
      const weeklySpending = dailySpending * 7;
      const monthlyProjection = dailySpending * 30;

      // Anomaly detection
      const amounts = expenseArray.map(t => Math.abs(t?.amount || 0)).filter(amount => amount > 0);
      const mean = amounts.length > 0 ? amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length : 0;
      const variance = amounts.length > 0 ? amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length : 0;
      const standardDeviation = Math.sqrt(variance);
      const unusualSpending = expenseArray.filter(t => Math.abs(t?.amount || 0) > mean + (2 * standardDeviation));

      // Category analysis
      const categoryBreakdown: { [key: string]: number } = {};
      expenseArray.forEach(t => {
        const category = t?.category || 'Other';
        const amount = Math.abs(t?.amount || 0);
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + amount;
      });

    const topCategory = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0];

    // Generate notifications based on financial health

    // Budget alerts
    if (budgetUsagePercent > 90) {
      newNotifications.push({
        id: `budget-alert-${Date.now()}`,
        type: 'error',
        title: 'Budget Alert',
        message: `You've used ${budgetUsagePercent.toFixed(1)}% of your monthly budget. Consider reducing non-essential expenses.`,
        icon: FiAlertTriangle,
        timestamp: new Date(),
        read: false,
        priority: 'high',
        action: {
          label: 'Review Budget',
          onClick: () => {}
        }
      });
    } else if (budgetUsagePercent > 80) {
      newNotifications.push({
        id: `budget-warning-${Date.now()}`,
        type: 'warning',
        title: 'Budget Warning',
        message: `You're approaching your budget limit at ${budgetUsagePercent.toFixed(1)}% usage.`,
        icon: FiShield,
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      });
    }

    // Savings rate alerts
    if (savingsRate < 10) {
      newNotifications.push({
        id: `savings-alert-${Date.now()}`,
        type: 'warning',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider increasing it to at least 20% for better financial security.`,
        icon: FiTarget,
        timestamp: new Date(),
        read: false,
        priority: 'medium',
        action: {
          label: 'Set Savings Goal',
          onClick: () => {}
        }
      });
    }

    // Unusual spending alerts
    if (unusualSpending.length > 0) {
      newNotifications.push({
        id: `unusual-spending-${Date.now()}`,
        type: 'info',
        title: 'Unusual Spending Detected',
        message: `${unusualSpending.length} transaction(s) are significantly higher than your average. Review these for potential savings.`,
        icon: FiInfo,
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      });
    }

    // Top spending category insights
    if (topCategory && topCategory[1] > totalExpenses * 0.4) {
      newNotifications.push({
        id: `category-insight-${Date.now()}`,
        type: 'info',
        title: 'Spending Insight',
        message: `${topCategory[0]} accounts for ${((topCategory[1] / totalExpenses) * 100).toFixed(1)}% of your expenses.`,
        icon: FiTrendingDown,
        timestamp: new Date(),
        read: false,
        priority: 'low'
      });
    }

    // Positive notifications
    if (netBalance > 0 && savingsRate > 20) {
      newNotifications.push({
        id: `positive-feedback-${Date.now()}`,
        type: 'success',
        title: 'Great Job!',
        message: `You're saving ${savingsRate.toFixed(1)}% of your income. Keep up the excellent work!`,
        icon: FiCheckCircle,
        timestamp: new Date(),
        read: false,
        priority: 'low'
      });
    }

    // Savings goals progress
    savingsGoals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      if (progress >= 100) {
        newNotifications.push({
          id: `goal-completed-${goal.id}`,
          type: 'success',
          title: 'Goal Achieved!',
          message: `Congratulations! You've reached your savings goal: ${goal.name}`,
          icon: FiStar,
          timestamp: new Date(),
          read: false,
          priority: 'medium'
        });
      } else if (progress >= 75) {
        newNotifications.push({
          id: `goal-progress-${goal.id}`,
          type: 'info',
          title: 'Goal Progress',
          message: `You're ${progress.toFixed(1)}% towards your goal: ${goal.name}`,
          icon: FiTarget,
          timestamp: new Date(),
          read: false,
          priority: 'low'
        });
      }
    });

    // Spending velocity alerts
    if (monthlyProjection > monthlyBudget) {
      newNotifications.push({
        id: `velocity-warning-${Date.now()}`,
        type: 'warning',
        title: 'Spending Velocity Alert',
        message: `At your current spending rate, you'll exceed your monthly budget by ₱${(monthlyProjection - monthlyBudget).toLocaleString()}.`,
        icon: FiTrendingUp,
        timestamp: new Date(),
        read: false,
        priority: 'high'
      });
    }

    // Income insights
    if (incomeArray.length > 0) {
      const recentIncome = incomeArray
        .sort((a, b) => new Date(b?.date || new Date()).getTime() - new Date(a?.date || new Date()).getTime())
        .slice(0, 3);
      
      const averageIncome = recentIncome.reduce((sum, t) => sum + Math.abs(t?.amount || 0), 0) / recentIncome.length;
      
      if (averageIncome > totalIncome / incomeArray.length * 1.2) {
        newNotifications.push({
          id: `income-trend-${Date.now()}`,
          type: 'success',
          title: 'Income Trend',
          message: 'Your recent income is trending upward. Great job!',
          icon: FiTrendingUp,
          timestamp: new Date(),
          read: false,
          priority: 'low'
        });
      }
    }

    // Emergency fund check
    const emergencyFundRatio = totalExpenses > 0 ? netBalance / (totalExpenses * 3) : 1;
    if (emergencyFundRatio < 0.5) {
      newNotifications.push({
        id: `emergency-fund-${Date.now()}`,
        type: 'warning',
        title: 'Emergency Fund Alert',
        message: 'Consider building an emergency fund covering at least 3 months of expenses.',
        icon: FiShield,
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      });
    }

    // Set notifications with deduplication
    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const uniqueNewNotifications = newNotifications.filter(n => !existingIds.has(n.id));
      return [...prev, ...uniqueNewNotifications];
    });
    } catch (error) {
      // Set a fallback notification
      setNotifications(prev => {
        const errorNotification = {
          id: `error-${Date.now()}`,
          type: 'error' as const,
          title: 'Notification Error',
          message: 'There was an error generating notifications. Please refresh the page.',
          icon: FiAlertTriangle,
          timestamp: new Date(),
          read: false,
          priority: 'high' as const
        };
        return [errorNotification, ...prev];
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (notification: Notification) => {
    const IconComponent = notification.icon;
    return <IconComponent size={20} />;
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const sortedNotifications = notifications
    .sort((a, b) => {
      // Sort by priority first, then by timestamp
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
        title="Notifications"
      >
        <FiBell size={20} style={{ color: 'var(--text-muted)' }} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Notifications
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <FiX size={16} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-2">
            {sortedNotifications.length === 0 ? (
              <div className="text-center py-8">
                <FiBell size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-muted)' }}>No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-xl border-l-4 transition-all duration-300 ${
                      getPriorityColor(notification.priority)
                    } ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'bg-white/5' : 'bg-white/2'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-semibold text-sm ${
                            !notification.read ? 'font-bold' : ''
                          }`} style={{ color: 'var(--text-primary)' }}>
                            {notification.title}
                          </h4>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
                          >
                            <FiX size={12} style={{ color: 'var(--text-muted)' }} />
                          </button>
                        </div>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {notification.timestamp.toLocaleTimeString()}
                          </span>
                          {notification.action && (
                            <button
                              onClick={() => {
                                notification.action!.onClick();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {notification.action.label}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartNotifications;

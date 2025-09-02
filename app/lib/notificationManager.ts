// Notification Manager for Redis-based Persistent Notifications
// Handles storage, retrieval, and management of notifications using Redis

export interface PersistentNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  icon: string; // Store icon name as string for persistence
  timestamp: number; // Store as number for JSON serialization
  read: boolean;
  action?: {
    label: string;
    actionType: string; // Store action type as string
    actionData?: any;
  };
  priority: 'low' | 'medium' | 'high';
  category: 'budget' | 'spending' | 'savings' | 'income' | 'system' | 'historical';
  expiresAt?: number; // Optional expiration timestamp
  userId: string;
  metadata?: {
    budgetUsagePercent?: number;
    savingsRate?: number;
    category?: string;
    amount?: number;
    month?: string;
    year?: number;
  };
}

export interface NotificationSettings {
  userId: string;
  enabled: boolean;
  budgetAlerts: boolean;
  spendingAlerts: boolean;
  savingsAlerts: boolean;
  incomeAlerts: boolean;
  historicalInsights: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
  retentionDays: number;
  maxNotifications: number;
}

import { redis } from './redis';

export class NotificationManager {
  private static readonly NOTIFICATIONS_KEY = 'buni:notifications';
  private static readonly SETTINGS_KEY = 'buni:notification_settings';
  private static readonly DEFAULT_RETENTION_DAYS = 30;
  private static readonly DEFAULT_MAX_NOTIFICATIONS = 100;

  // Get all notifications for a user
  static async getNotifications(userId: string): Promise<PersistentNotification[]> {
    try {
      const key = `${this.NOTIFICATIONS_KEY}:${userId}`;
      const stored = await redis.get(key);
      
      if (!stored) return [];

      const notifications: PersistentNotification[] = Array.isArray(stored) ? stored : [];
      
      // Filter out expired notifications
      const currentTime = this.getCurrentTime();
      const validNotifications = notifications.filter(notification => 
        !notification.expiresAt || notification.expiresAt > currentTime
      );

      // Update storage if some notifications were expired
      if (validNotifications.length !== notifications.length) {
        await this.saveNotifications(userId, validNotifications);
      }

      return validNotifications;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return [];
    }
  }

  // Save notifications for a user
  static async saveNotifications(userId: string, notifications: PersistentNotification[]): Promise<boolean> {
    try {
      // Clean old notifications based on retention policy
      const settings = await this.getNotificationSettings(userId);
      const retentionDays = settings.retentionDays || this.DEFAULT_RETENTION_DAYS;
      const cutoffTime = this.getCurrentTime() - (retentionDays * 24 * 60 * 60 * 1000);
      
      const filteredNotifications = notifications
        .filter(notification => notification.timestamp > cutoffTime)
        .slice(0, settings.maxNotifications || this.DEFAULT_MAX_NOTIFICATIONS);

      const key = `${this.NOTIFICATIONS_KEY}:${userId}`;
      await redis.set(key, filteredNotifications);
      return true;
    } catch (error) {
      console.error('Failed to save notifications:', error);
      return false;
    }
  }

  // Add a new notification
  static async addNotification(userId: string, notification: Omit<PersistentNotification, 'id' | 'timestamp' | 'userId'>): Promise<string> {
    try {
      const notifications = await this.getNotifications(userId);
      const currentTime = this.getCurrentTime();
      const newNotification: PersistentNotification = {
        ...notification,
        id: `${notification.category}-${currentTime}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: currentTime,
        userId
      };

      notifications.unshift(newNotification); // Add to beginning
      await this.saveNotifications(userId, notifications);
      
      return newNotification.id;
    } catch (error) {
      console.error('Failed to add notification:', error);
      return '';
    }
  }

  // Helper method to get current time (can be mocked in tests)
  private static getCurrentTime(): number {
    return Date.now();
  }

  // Mark notification as read
  static async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    try {
      const notifications = await this.getNotifications(userId);
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      
      return await this.saveNotifications(userId, updatedNotifications);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const notifications = await this.getNotifications(userId);
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      return await this.saveNotifications(userId, updatedNotifications);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }

  // Delete a notification
  static async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    try {
      const notifications = await this.getNotifications(userId);
      const filteredNotifications = notifications.filter(notification => notification.id !== notificationId);
      
      return await this.saveNotifications(userId, filteredNotifications);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  }

  // Clear all notifications
  static async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      return await this.saveNotifications(userId, []);
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      return false;
    }
  }

  // Get notification settings
  static async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    try {
      const key = `${this.SETTINGS_KEY}:${userId}`;
      const stored = await redis.get(key);
      
      if (!stored) {
        // Return default settings
        const defaultSettings: NotificationSettings = {
          userId,
          enabled: true,
          budgetAlerts: true,
          spendingAlerts: true,
          savingsAlerts: true,
          incomeAlerts: true,
          historicalInsights: true,
          quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00"
          },
          retentionDays: this.DEFAULT_RETENTION_DAYS,
          maxNotifications: this.DEFAULT_MAX_NOTIFICATIONS
        };
        
        await this.saveNotificationSettings(userId, defaultSettings);
        return defaultSettings;
      }

      return stored as NotificationSettings;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return {
        userId,
        enabled: true,
        budgetAlerts: true,
        spendingAlerts: true,
        savingsAlerts: true,
        incomeAlerts: true,
        historicalInsights: true,
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "08:00"
        },
        retentionDays: this.DEFAULT_RETENTION_DAYS,
        maxNotifications: this.DEFAULT_MAX_NOTIFICATIONS
      };
    }
  }

  // Save notification settings
  static async saveNotificationSettings(userId: string, settings: NotificationSettings): Promise<boolean> {
    try {
      const key = `${this.SETTINGS_KEY}:${userId}`;
      await redis.set(key, settings);
      return true;
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      return false;
    }
  }

  // Generate budget-related notifications
  static async generateBudgetNotifications(userId: string, budgetData: {
    monthlyBudget: number;
    totalExpenses: number;
    budgetUsagePercent: number;
    month: string;
    year: number;
  }): Promise<void> {
    try {
      const settings = await this.getNotificationSettings(userId);
      if (!settings.enabled || !settings.budgetAlerts) return;

      const { budgetUsagePercent, monthlyBudget, totalExpenses, month, year } = budgetData;

      // Budget alerts
      if (budgetUsagePercent > 100) {
        await this.addNotification(userId, {
          type: 'error',
          title: 'Budget Exceeded',
          message: `You've exceeded your monthly budget by ₱${(totalExpenses - monthlyBudget).toLocaleString()}.`,
          icon: 'FiAlertTriangle',
          read: false,
          priority: 'high',
          category: 'budget',
          metadata: {
            budgetUsagePercent,
            month,
            year
          }
        });
      } else if (budgetUsagePercent > 90) {
        await this.addNotification(userId, {
          type: 'warning',
          title: 'Budget Warning',
          message: `You've used ${budgetUsagePercent.toFixed(1)}% of your monthly budget.`,
          icon: 'FiShield',
          read: false,
          priority: 'high',
          category: 'budget',
          metadata: {
            budgetUsagePercent,
            month,
            year
          }
        });
      } else if (budgetUsagePercent > 80) {
        await this.addNotification(userId, {
          type: 'warning',
          title: 'Budget Alert',
          message: `You're approaching your budget limit at ${budgetUsagePercent.toFixed(1)}% usage.`,
          icon: 'FiShield',
          read: false,
          priority: 'medium',
          category: 'budget',
          metadata: {
            budgetUsagePercent,
            month,
            year
          }
        });
      }
    } catch (error) {
      console.error('Failed to generate budget notifications:', error);
    }
  }

  // Generate spending-related notifications
  static async generateSpendingNotifications(userId: string, spendingData: {
    totalExpenses: number;
    dailyAverage: number;
    unusualTransactions: number;
    topCategories: { category: string; amount: number; percentage: number }[];
    month: string;
    year: number;
  }): Promise<void> {
    try {
      const settings = await this.getNotificationSettings(userId);
      if (!settings.enabled || !settings.spendingAlerts) return;

      const { unusualTransactions, topCategories, month, year } = spendingData;

      // Unusual spending alerts
      if (unusualTransactions > 0) {
        await this.addNotification(userId, {
          type: 'info',
          title: 'Unusual Spending Detected',
          message: `${unusualTransactions} transaction(s) are significantly higher than your average.`,
          icon: 'FiInfo',
          read: false,
          priority: 'medium',
          category: 'spending',
          metadata: {
            month,
            year
          }
        });
      }

      // Top spending category insights
      if (topCategories.length > 0) {
        const topCategory = topCategories[0];
        if (topCategory.percentage > 40) {
          await this.addNotification(userId, {
            type: 'info',
            title: 'Spending Insight',
            message: `${topCategory.category} accounts for ${topCategory.percentage.toFixed(1)}% of your expenses.`,
            icon: 'FiTrendingDown',
            read: false,
            priority: 'low',
            category: 'spending',
            metadata: {
              category: topCategory.category,
              amount: topCategory.amount,
              month,
              year
            }
          });
        }
      }
    } catch (error) {
      console.error('Failed to generate spending notifications:', error);
    }
  }

  // Generate savings-related notifications
  static async generateSavingsNotifications(userId: string, savingsData: {
    totalIncome: number;
    netBalance: number;
    savingsRate: number;
    month: string;
    year: number;
  }): Promise<void> {
    try {
      const settings = await this.getNotificationSettings(userId);
      if (!settings.enabled || !settings.savingsAlerts) return;

      const { savingsRate, month, year } = savingsData;

      // Savings rate alerts
      if (savingsRate < 10) {
        await this.addNotification(userId, {
          type: 'warning',
          title: 'Low Savings Rate',
          message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider increasing it to at least 20%.`,
          icon: 'FiTarget',
          read: false,
          priority: 'medium',
          category: 'savings',
          metadata: {
            savingsRate,
            month,
            year
          }
        });
      } else if (savingsRate > 30) {
        await this.addNotification(userId, {
          type: 'success',
          title: 'Excellent Savings!',
          message: `You're saving ${savingsRate.toFixed(1)}% of your income. Outstanding work!`,
          icon: 'FiStar',
          read: false,
          priority: 'low',
          category: 'savings',
          metadata: {
            savingsRate,
            month,
            year
          }
        });
      }
    } catch (error) {
      console.error('Failed to generate savings notifications:', error);
    }
  }

  // Generate historical insights notifications
  static async generateHistoricalNotifications(userId: string, historicalData: {
    month: string;
    year: number;
    budgetAdherenceChange: number;
    savingsTrend: string;
    spendingTrend: string;
    insights: string[];
  }): Promise<void> {
    try {
      const settings = await this.getNotificationSettings(userId);
      if (!settings.enabled || !settings.historicalInsights) return;

      const { budgetAdherenceChange, savingsTrend, spendingTrend, month, year } = historicalData;

      // Budget adherence improvements
      if (budgetAdherenceChange > 5) {
        await this.addNotification(userId, {
          type: 'success',
          title: 'Budget Improvement',
          message: `Your budget adherence improved by ${budgetAdherenceChange.toFixed(1)}% this month!`,
          icon: 'FiTrendingUp',
          read: false,
          priority: 'low',
          category: 'historical',
          metadata: {
            month,
            year
          }
        });
      }

      // Spending trend insights
      if (spendingTrend === 'decreasing') {
        await this.addNotification(userId, {
          type: 'success',
          title: 'Spending Trend',
          message: 'Great news! Your spending is trending downward this month.',
          icon: 'FiTrendingDown',
          read: false,
          priority: 'low',
          category: 'historical',
          metadata: {
            month,
            year
          }
        });
      }

      // Savings trend insights
      if (savingsTrend === 'increasing') {
        await this.addNotification(userId, {
          type: 'success',
          title: 'Savings Trend',
          message: 'Excellent! Your savings rate is trending upward this month.',
          icon: 'FiTrendingUp',
          read: false,
          priority: 'low',
          category: 'historical',
          metadata: {
            month,
            year
          }
        });
      }
    } catch (error) {
      console.error('Failed to generate historical notifications:', error);
    }
  }

  // Check if notifications should be shown (quiet hours)
  static async shouldShowNotifications(userId: string): Promise<boolean> {
    try {
      const settings = await this.getNotificationSettings(userId);
      if (!settings.enabled) return false;
      if (!settings.quietHours.enabled) return true;

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const [startHour, startMin] = settings.quietHours.start.split(':').map(Number);
      const [endHour, endMin] = settings.quietHours.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      // Handle overnight quiet hours
      if (startTime > endTime) {
        return currentTime < startTime && currentTime > endTime;
      } else {
        return currentTime < startTime || currentTime > endTime;
      }
    } catch (error) {
      console.error('Failed to check quiet hours:', error);
      return true;
    }
  }

  // Get unread notification count
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getNotifications(userId);
      return notifications.filter(notification => !notification.read).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  // Clean up old notifications
  static async cleanupOldNotifications(userId: string): Promise<boolean> {
    try {
      const notifications = await this.getNotifications(userId);
      const settings = await this.getNotificationSettings(userId);
      const retentionDays = settings.retentionDays || this.DEFAULT_RETENTION_DAYS;
      const cutoffTime = this.getCurrentTime() - (retentionDays * 24 * 60 * 60 * 1000);
      
      const validNotifications = notifications.filter(notification => 
        notification.timestamp > cutoffTime
      );

      if (validNotifications.length !== notifications.length) {
        return await this.saveNotifications(userId, validNotifications);
      }

      return true;
    } catch (error) {
      console.error('Failed to cleanup old notifications:', error);
      return false;
    }
  }
}

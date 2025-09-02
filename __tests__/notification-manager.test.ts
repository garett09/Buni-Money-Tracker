import { NotificationManager, PersistentNotification, NotificationSettings } from '../app/lib/notificationManager';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  storage: {} as { [key: string]: string }
};

// Mock Date.now for consistent testing
jest.useFakeTimers();
jest.setSystemTime(new Date('2022-01-01T00:00:00.000Z'));

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('NotificationManager', () => {
  const testUserId = 'test-user-123';
  
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.storage = {};
    localStorageMock.getItem.mockImplementation((key: string) => localStorageMock.storage[key] || null);
    localStorageMock.setItem.mockImplementation((key: string, value: string) => {
      localStorageMock.storage[key] = value;
    });
    
    // Reset timers for each test
    jest.setSystemTime(new Date('2022-01-01T00:00:00.000Z'));
  });

  describe('Notification Storage and Retrieval', () => {
    it('should store and retrieve notifications', async () => {
      const testNotification: Omit<PersistentNotification, 'id' | 'timestamp' | 'userId'> = {
        type: 'warning',
        title: 'Test Notification',
        message: 'This is a test notification',
        icon: 'FiAlertTriangle',
        read: false,
        priority: 'medium',
        category: 'budget'
      };

      const notificationId = await NotificationManager.addNotification(testUserId, testNotification);
      expect(notificationId).toBeTruthy();

      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications).toHaveLength(1);
      expect(notifications[0].title).toBe('Test Notification');
      expect(notifications[0].userId).toBe(testUserId);
    });

    it('should handle empty storage gracefully', async () => {
      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications).toEqual([]);
    });

    it('should filter out expired notifications', async () => {
      // Mock expired notification
      const expiredNotification: PersistentNotification = {
        id: 'expired-1',
        type: 'info',
        title: 'Expired Notification',
        message: 'This notification has expired',
        icon: 'FiInfo',
        timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: false,
        priority: 'low',
        category: 'system',
        userId: testUserId,
        expiresAt: Date.now() - (1 * 24 * 60 * 60 * 1000) // Expired 1 day ago
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify([expiredNotification]));
      
      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications).toHaveLength(0);
    });
  });

  describe('Notification Management', () => {
    it('should mark notification as read', async () => {
      const testNotification: Omit<PersistentNotification, 'id' | 'timestamp' | 'userId'> = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification',
        icon: 'FiInfo',
        read: false,
        priority: 'low',
        category: 'system'
      };

      const notificationId = await NotificationManager.addNotification(testUserId, testNotification);
      const success = await NotificationManager.markAsRead(testUserId, notificationId);
      
      expect(success).toBe(true);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const notification = notifications.find(n => n.id === notificationId);
      expect(notification?.read).toBe(true);
    });

    it('should mark all notifications as read', async () => {
      // Add multiple notifications
      const notifications = [
        { type: 'info' as const, title: 'First', message: 'First notification', icon: 'FiInfo', read: false, priority: 'low' as const, category: 'system' as const },
        { type: 'warning' as const, title: 'Second', message: 'Second notification', icon: 'FiAlertTriangle', read: false, priority: 'medium' as const, category: 'budget' as const }
      ];

      for (const notification of notifications) {
        await NotificationManager.addNotification(testUserId, notification);
      }

      const success = await NotificationManager.markAllAsRead(testUserId);
      expect(success).toBe(true);

      const allNotifications = await NotificationManager.getNotifications(testUserId);
      expect(allNotifications.every(n => n.read)).toBe(true);
    });

    it('should delete notification', async () => {
      const testNotification: Omit<PersistentNotification, 'id' | 'timestamp' | 'userId'> = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification',
        icon: 'FiInfo',
        read: false,
        priority: 'low',
        category: 'system'
      };

      const notificationId = await NotificationManager.addNotification(testUserId, testNotification);
      const success = await NotificationManager.deleteNotification(testUserId, notificationId);
      
      expect(success).toBe(true);

      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications).toHaveLength(0);
    });

    it('should clear all notifications', async () => {
      // Add a notification first
      const testNotification: Omit<PersistentNotification, 'id' | 'timestamp' | 'userId'> = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification',
        icon: 'FiInfo',
        read: false,
        priority: 'low',
        category: 'system'
      };

      await NotificationManager.addNotification(testUserId, testNotification);
      
      const success = await NotificationManager.clearAllNotifications(testUserId);
      expect(success).toBe(true);

      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications).toHaveLength(0);
    });
  });

  describe('Notification Settings', () => {
    it('should return default settings for new user', async () => {
      const settings = await NotificationManager.getNotificationSettings(testUserId);
      
      expect(settings.userId).toBe(testUserId);
      expect(settings.enabled).toBe(true);
      expect(settings.budgetAlerts).toBe(true);
      expect(settings.spendingAlerts).toBe(true);
      expect(settings.savingsAlerts).toBe(true);
      expect(settings.incomeAlerts).toBe(true);
      expect(settings.historicalInsights).toBe(true);
      expect(settings.retentionDays).toBe(30);
      expect(settings.maxNotifications).toBe(100);
    });

    it('should save and retrieve custom settings', async () => {
      const customSettings: NotificationSettings = {
        userId: testUserId,
        enabled: false,
        budgetAlerts: false,
        spendingAlerts: true,
        savingsAlerts: false,
        incomeAlerts: true,
        historicalInsights: false,
        quietHours: {
          enabled: true,
          start: "23:00",
          end: "07:00"
        },
        retentionDays: 60,
        maxNotifications: 50
      };

      const saveSuccess = await NotificationManager.saveNotificationSettings(testUserId, customSettings);
      expect(saveSuccess).toBe(true);

      const retrievedSettings = await NotificationManager.getNotificationSettings(testUserId);
      expect(retrievedSettings).toEqual(customSettings);
    });
  });

  describe('Budget Notifications', () => {
    it('should generate budget exceeded notification', async () => {
      const budgetData = {
        monthlyBudget: 50000,
        totalExpenses: 60000,
        budgetUsagePercent: 120,
        month: '2024-01',
        year: 2024
      };

      await NotificationManager.generateBudgetNotifications(testUserId, budgetData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const budgetNotification = notifications.find(n => n.category === 'budget');
      
      expect(budgetNotification).toBeDefined();
      expect(budgetNotification?.type).toBe('error');
      expect(budgetNotification?.title).toBe('Budget Exceeded');
      expect(budgetNotification?.priority).toBe('high');
    });

    it('should generate budget warning notification', async () => {
      const budgetData = {
        monthlyBudget: 50000,
        totalExpenses: 47000,
        budgetUsagePercent: 94,
        month: '2024-01',
        year: 2024
      };

      await NotificationManager.generateBudgetNotifications(testUserId, budgetData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const budgetNotification = notifications.find(n => n.category === 'budget');
      
      expect(budgetNotification).toBeDefined();
      expect(budgetNotification?.type).toBe('warning');
      expect(budgetNotification?.title).toBe('Budget Warning');
      expect(budgetNotification?.priority).toBe('high');
    });

    it('should generate budget alert notification', async () => {
      const budgetData = {
        monthlyBudget: 50000,
        totalExpenses: 42000,
        budgetUsagePercent: 84,
        month: '2024-01',
        year: 2024
      };

      await NotificationManager.generateBudgetNotifications(testUserId, budgetData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const budgetNotification = notifications.find(n => n.category === 'budget');
      
      expect(budgetNotification).toBeDefined();
      expect(budgetNotification?.type).toBe('warning');
      expect(budgetNotification?.title).toBe('Budget Alert');
      expect(budgetNotification?.priority).toBe('medium');
    });
  });

  describe('Spending Notifications', () => {
    it('should generate unusual spending notification', async () => {
      const spendingData = {
        totalExpenses: 50000,
        dailyAverage: 1667,
        unusualTransactions: 3,
        topCategories: [
          { category: 'Food', amount: 15000, percentage: 30 }
        ],
        month: '2024-01',
        year: 2024
      };

      await NotificationManager.generateSpendingNotifications(testUserId, spendingData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const spendingNotification = notifications.find(n => n.category === 'spending');
      
      expect(spendingNotification).toBeDefined();
      expect(spendingNotification?.type).toBe('info');
      expect(spendingNotification?.title).toBe('Unusual Spending Detected');
    });

    it('should generate spending insight notification', async () => {
      const spendingData = {
        totalExpenses: 50000,
        dailyAverage: 1667,
        unusualTransactions: 0,
        topCategories: [
          { category: 'Food', amount: 25000, percentage: 50 }
        ],
        month: '2024-01',
        year: 2024
      };

      await NotificationManager.generateSpendingNotifications(testUserId, spendingData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const insightNotification = notifications.find(n => n.title === 'Spending Insight');
      
      expect(insightNotification).toBeDefined();
      expect(insightNotification?.message).toContain('Food accounts for 50.0% of your expenses');
    });
  });

  describe('Savings Notifications', () => {
    it('should generate low savings rate warning', async () => {
      const savingsData = {
        totalIncome: 80000,
        netBalance: 4000,
        savingsRate: 5,
        month: '2024-01',
        year: 2024
      };

      await NotificationManager.generateSavingsNotifications(testUserId, savingsData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const savingsNotification = notifications.find(n => n.category === 'savings');
      
      expect(savingsNotification).toBeDefined();
      expect(savingsNotification?.type).toBe('warning');
      expect(savingsNotification?.title).toBe('Low Savings Rate');
    });

    it('should generate excellent savings notification', async () => {
      const savingsData = {
        totalIncome: 80000,
        netBalance: 32000,
        savingsRate: 40,
        month: '2024-01',
        year: 2024
      };

      await NotificationManager.generateSavingsNotifications(testUserId, savingsData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const savingsNotification = notifications.find(n => n.category === 'savings');
      
      expect(savingsNotification).toBeDefined();
      expect(savingsNotification?.type).toBe('success');
      expect(savingsNotification?.title).toBe('Excellent Savings!');
    });
  });

  describe('Historical Notifications', () => {
    it('should generate budget improvement notification', async () => {
      const historicalData = {
        month: '2024-01',
        year: 2024,
        budgetAdherenceChange: 8.5,
        savingsTrend: 'increasing',
        spendingTrend: 'decreasing',
        insights: []
      };

      await NotificationManager.generateHistoricalNotifications(testUserId, historicalData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const budgetNotification = notifications.find(n => n.title === 'Budget Improvement');
      
      expect(budgetNotification).toBeDefined();
      expect(budgetNotification?.type).toBe('success');
      expect(budgetNotification?.title).toBe('Budget Improvement');
    });

    it('should generate spending trend notification', async () => {
      const historicalData = {
        month: '2024-01',
        year: 2024,
        budgetAdherenceChange: 2.0,
        savingsTrend: 'stable',
        spendingTrend: 'decreasing',
        insights: []
      };

      await NotificationManager.generateHistoricalNotifications(testUserId, historicalData);

      const notifications = await NotificationManager.getNotifications(testUserId);
      const trendNotification = notifications.find(n => n.title === 'Spending Trend');
      
      expect(trendNotification).toBeDefined();
      expect(trendNotification?.type).toBe('success');
    });
  });

  describe('Quiet Hours', () => {
    it('should respect quiet hours when enabled', async () => {
      // Mock settings with quiet hours enabled
      const quietHoursSettings: NotificationSettings = {
        userId: testUserId,
        enabled: true,
        budgetAlerts: true,
        spendingAlerts: true,
        savingsAlerts: true,
        incomeAlerts: true,
        historicalInsights: true,
        quietHours: {
          enabled: true,
          start: "22:00",
          end: "08:00"
        },
        retentionDays: 30,
        maxNotifications: 100
      };

      await NotificationManager.saveNotificationSettings(testUserId, quietHoursSettings);

      // Mock current time to be during quiet hours (23:00)
      const mockDate = new Date('2024-01-01T23:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const shouldShow = await NotificationManager.shouldShowNotifications(testUserId);
      expect(shouldShow).toBe(false);

      // Mock current time to be outside quiet hours (14:00)
      const mockDate2 = new Date('2024-01-01T14:00:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate2 as any);

      const shouldShow2 = await NotificationManager.shouldShowNotifications(testUserId);
      expect(shouldShow2).toBe(true);

      // Clean up
      jest.restoreAllMocks();
    });
  });

  describe('Data Cleanup', () => {
    it('should cleanup old notifications based on retention policy', async () => {
      // Mock old notification (40 days ago, which exceeds the 30-day retention policy)
      const oldNotification: PersistentNotification = {
        id: 'old-1',
        type: 'info',
        title: 'Old Notification',
        message: 'This is an old notification',
        icon: 'FiInfo',
        timestamp: Date.now() - (40 * 24 * 60 * 60 * 1000), // 40 days ago
        read: false,
        priority: 'low',
        category: 'system',
        userId: testUserId
      };

      // Store the old notification directly
      localStorageMock.storage[`buni_notifications_${testUserId}`] = JSON.stringify([oldNotification]);
      
      const success = await NotificationManager.cleanupOldNotifications(testUserId);
      expect(success).toBe(true);

      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications).toHaveLength(0);
    });

    it('should respect max notifications limit', async () => {
      // Mock settings with low max notifications
      const limitedSettings: NotificationSettings = {
        userId: testUserId,
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
        retentionDays: 30,
        maxNotifications: 2
      };

      await NotificationManager.saveNotificationSettings(testUserId, limitedSettings);

      // Add 3 notifications
      for (let i = 0; i < 3; i++) {
        await NotificationManager.addNotification(testUserId, {
          type: 'info',
          title: `Notification ${i + 1}`,
          message: `This is notification ${i + 1}`,
          icon: 'FiInfo',
          read: false,
          priority: 'low',
          category: 'system'
        });
      }

      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const success = await NotificationManager.addNotification(testUserId, {
        type: 'info',
        title: 'Test',
        message: 'Test message',
        icon: 'FiInfo',
        read: false,
        priority: 'low',
        category: 'system'
      });

      expect(success).toBe('');
    });

    it('should handle malformed JSON gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-json');

      const notifications = await NotificationManager.getNotifications(testUserId);
      expect(notifications).toEqual([]);
    });
  });
});

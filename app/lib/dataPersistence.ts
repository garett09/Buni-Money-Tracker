import { redis } from './redis';

// Data persistence interface
export interface DataBackup {
  timestamp: number;
  data: any;
  version: string;
  checksum: string;
}

// Enhanced data persistence class
export class DataPersistence {
  private static readonly VERSION = '1.0.0';
  // Backup snapshots are kept for 30 days, but your main data is stored permanently
  private static readonly BACKUP_RETENTION_DAYS = 30;
  private static readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

  // Store data with automatic backup
  static async storeData(userId: string, dataType: string, data: any): Promise<boolean> {
    try {
      const timestamp = Date.now();
      const checksum = this.generateChecksum(data);
      
      // Store main data
      const mainKey = `user:${userId}:${dataType}`;
      await redis.set(mainKey, JSON.stringify({
        data,
        timestamp,
        version: this.VERSION,
        checksum
      }));

      // Create backup
      await this.createBackup(userId, dataType, data, timestamp, checksum);

      // Store in user's data index
      await redis.sadd(`user:${userId}:dataIndex`, dataType);

      console.log(`✅ Data stored successfully: ${dataType} for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to store data: ${dataType}`, error);
      return false;
    }
  }

  // Retrieve data with fallback to backup
  static async getData(userId: string, dataType: string): Promise<any> {
    try {
      const mainKey = `user:${userId}:${dataType}`;
      const mainData = await redis.get(mainKey);

      if (mainData) {
        const parsed = JSON.parse(mainData);
        
        // Verify data integrity
        if (this.verifyChecksum(parsed.data, parsed.checksum)) {
          console.log(`✅ Data retrieved successfully: ${dataType} for user ${userId}`);
          return parsed.data;
        } else {
          console.warn(`⚠️ Data corruption detected: ${dataType}, attempting backup recovery`);
        }
      }

      // Try to recover from backup
      const backupData = await this.recoverFromBackup(userId, dataType);
      if (backupData) {
        // Restore main data from backup
        await this.storeData(userId, dataType, backupData);
        return backupData;
      }

      console.log(`ℹ️ No data found: ${dataType} for user ${userId}`);
      return null;
    } catch (error) {
      console.error(`❌ Failed to retrieve data: ${dataType}`, error);
      return null;
    }
  }

  // Store list data (for transactions, accounts, etc.)
  static async storeListData(userId: string, dataType: string, items: any[]): Promise<boolean> {
    try {
      const timestamp = Date.now();
      const checksum = this.generateChecksum(items);
      
      // Store main list data
      const mainKey = `user:${userId}:${dataType}:list`;
      await redis.set(mainKey, JSON.stringify({
        items,
        timestamp,
        version: this.VERSION,
        checksum
      }));

      // Store individual items for quick access
      const itemsKey = `user:${userId}:${dataType}:items`;
      await redis.del(itemsKey); // Clear existing items
      
      for (const item of items) {
        await redis.lpush(itemsKey, JSON.stringify(item));
      }

      // Create backup
      await this.createBackup(userId, dataType, items, timestamp, checksum);

      // Store in user's data index
      await redis.sadd(`user:${userId}:dataIndex`, dataType);

      console.log(`✅ List data stored successfully: ${dataType} (${items.length} items) for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to store list data: ${dataType}`, error);
      return false;
    }
  }

  // Retrieve list data
  static async getListData(userId: string, dataType: string): Promise<any[]> {
    try {
      const mainKey = `user:${userId}:${dataType}:list`;
      const mainData = await redis.get(mainKey);

      if (mainData) {
        const parsed = JSON.parse(mainData);
        
        // Verify data integrity
        if (this.verifyChecksum(parsed.items, parsed.checksum)) {
          console.log(`✅ List data retrieved successfully: ${dataType} (${parsed.items.length} items) for user ${userId}`);
          return parsed.items;
        } else {
          console.warn(`⚠️ List data corruption detected: ${dataType}, attempting backup recovery`);
        }
      }

      // Try to recover from backup
      const backupData = await this.recoverFromBackup(userId, dataType);
      if (backupData && Array.isArray(backupData)) {
        // Restore main data from backup
        await this.storeListData(userId, dataType, backupData);
        return backupData;
      }

      console.log(`ℹ️ No list data found: ${dataType} for user ${userId}`);
      return [];
    } catch (error) {
      console.error(`❌ Failed to retrieve list data: ${dataType}`, error);
      return [];
    }
  }

  // Add item to list data
  static async addListItem(userId: string, dataType: string, item: any): Promise<boolean> {
    try {
      const items = await this.getListData(userId, dataType);
      items.unshift(item); // Add to beginning
      return await this.storeListData(userId, dataType, items);
    } catch (error) {
      console.error(`❌ Failed to add list item: ${dataType}`, error);
      return false;
    }
  }

  // Update item in list data
  static async updateListItem(userId: string, dataType: string, itemId: number, updates: any): Promise<boolean> {
    try {
      const items = await this.getListData(userId, dataType);
      const index = items.findIndex(item => item.id === itemId);
      
      if (index !== -1) {
        items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
        return await this.storeListData(userId, dataType, items);
      }
      
      return false;
    } catch (error) {
      console.error(`❌ Failed to update list item: ${dataType}`, error);
      return false;
    }
  }

  // Delete item from list data
  static async deleteListItem(userId: string, dataType: string, itemId: number): Promise<boolean> {
    try {
      const items = await this.getListData(userId, dataType);
      const filteredItems = items.filter(item => item.id !== itemId);
      return await this.storeListData(userId, dataType, filteredItems);
    } catch (error) {
      console.error(`❌ Failed to delete list item: ${dataType}`, error);
      return false;
    }
  }

  // Create backup
  private static async createBackup(userId: string, dataType: string, data: any, timestamp: number, checksum: string): Promise<void> {
    try {
      const backup: DataBackup = {
        timestamp,
        data,
        version: this.VERSION,
        checksum
      };

      const backupKey = `user:${userId}:${dataType}:backup:${timestamp}`;
      await redis.set(backupKey, JSON.stringify(backup));

      // Store backup reference
      const backupIndexKey = `user:${userId}:${dataType}:backups`;
      await redis.zadd(backupIndexKey, timestamp, backupKey);

      // Clean old backups
      await this.cleanOldBackups(userId, dataType);
    } catch (error) {
      console.error(`❌ Failed to create backup: ${dataType}`, error);
    }
  }

  // Recover from backup
  private static async recoverFromBackup(userId: string, dataType: string): Promise<any> {
    try {
      const backupIndexKey = `user:${userId}:${dataType}:backups`;
      

      
      const backupKeys = await redis.zrevrange(backupIndexKey, 0, 0); // Get most recent backup

      if (backupKeys.length > 0) {
        const backupData = await redis.get(backupKeys[0]);
        if (backupData) {
          const backup: DataBackup = JSON.parse(backupData);
          console.log(`✅ Data recovered from backup: ${dataType} for user ${userId}`);
          return backup.data;
        }
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to recover from backup: ${dataType}`, error);
      return null;
    }
  }

  // Clean old backup snapshots (main data is stored permanently)
  private static async cleanOldBackups(userId: string, dataType: string): Promise<void> {
    try {
      const cutoffTime = Date.now() - (this.BACKUP_RETENTION_DAYS * 24 * 60 * 60 * 1000);
      const backupIndexKey = `user:${userId}:${dataType}:backups`;
      
      const oldBackupKeys = await redis.zrangebyscore(backupIndexKey, 0, cutoffTime);
      
      for (const backupKey of oldBackupKeys) {
        await redis.del(backupKey);
        await redis.zrem(backupIndexKey, backupKey);
      }

      if (oldBackupKeys.length > 0) {
        console.log(`🧹 Cleaned ${oldBackupKeys.length} old backup snapshots for ${dataType} (main data preserved)`);
      }
    } catch (error) {
      console.error(`❌ Failed to clean old backups: ${dataType}`, error);
    }
  }

  // Generate checksum for data integrity
  private static generateChecksum(data: any): string {
    const dataString = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Verify checksum
  private static verifyChecksum(data: any, checksum: string): boolean {
    return this.generateChecksum(data) === checksum;
  }

  // Get user's data index
  static async getUserDataIndex(userId: string): Promise<string[]> {
    try {
      return await redis.smembers(`user:${userId}:dataIndex`);
    } catch (error) {
      console.error(`❌ Failed to get user data index for user ${userId}`, error);
      return [];
    }
  }

  // Export user data (for backup/download)
  static async exportUserData(userId: string): Promise<any> {
    try {
      const dataTypes = await this.getUserDataIndex(userId);
      const exportData: any = {
        userId,
        exportDate: new Date().toISOString(),
        version: this.VERSION,
        data: {}
      };

      for (const dataType of dataTypes) {
        const data = await this.getData(userId, dataType);
        if (data) {
          exportData.data[dataType] = data;
        }
      }

      return exportData;
    } catch (error) {
      console.error(`❌ Failed to export user data for user ${userId}`, error);
      return null;
    }
  }

  // Import user data (for restore/upload)
  static async importUserData(userId: string, importData: any): Promise<boolean> {
    try {
      if (importData.data) {
        for (const [dataType, data] of Object.entries(importData.data)) {
          if (Array.isArray(data)) {
            await this.storeListData(userId, dataType, data as any[]);
          } else {
            await this.storeData(userId, dataType, data);
          }
        }
      }

      console.log(`✅ User data imported successfully for user ${userId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to import user data for user ${userId}`, error);
      return false;
    }
  }

  // Sync data across devices (for real-time updates)
  static async syncData(userId: string, dataType: string, lastSyncTime: number): Promise<{ data: any, timestamp: number } | null> {
    try {
      const mainKey = `user:${userId}:${dataType}`;
      const mainData = await redis.get(mainKey);

      if (mainData) {
        const parsed = JSON.parse(mainData);
        
        // Only return data if it's newer than last sync
        if (parsed.timestamp > lastSyncTime) {
          return {
            data: parsed.data,
            timestamp: parsed.timestamp
          };
        }
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to sync data: ${dataType}`, error);
      return null;
    }
  }

  // Health check for data persistence
  static async healthCheck(userId: string): Promise<{ status: string, details: any }> {
    try {
      const dataTypes = await this.getUserDataIndex(userId);
      const healthDetails: any = {
        totalDataTypes: dataTypes.length,
        dataTypes: [],
        lastBackup: null,
        storageSize: 0
      };

      for (const dataType of dataTypes) {
        const data = await this.getData(userId, dataType);
        const backupIndexKey = `user:${userId}:${dataType}:backups`;
        const backupCount = await redis.zcard(backupIndexKey);
        
        healthDetails.dataTypes.push({
          type: dataType,
          hasData: !!data,
          dataSize: data ? JSON.stringify(data).length : 0,
          backupCount
        });

        if (data) {
          healthDetails.storageSize += JSON.stringify(data).length;
        }
      }

      // Get last backup time
      const allBackups = await Promise.all(
        dataTypes.map(async (dataType) => {
          const backupIndexKey = `user:${userId}:${dataType}:backups`;
          const latestBackup = await redis.zrevrange(backupIndexKey, 0, 0);
          return latestBackup.length > 0 ? parseInt(latestBackup[0].split(':').pop() || '0') : 0;
        })
      );

      healthDetails.lastBackup = Math.max(...allBackups, 0);

      return {
        status: 'healthy',
        details: healthDetails
      };
    } catch (error) {
      console.error(`❌ Health check failed for user ${userId}`, error);
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

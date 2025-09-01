'use client';

import React, { useState, useEffect } from 'react';
import { ApiClient } from '@/app/lib/api';
import toast from 'react-hot-toast';
import { 
  FiDownload, 
  FiUpload, 
  FiActivity, 
  FiShield, 
  FiRefreshCw,
  FiCheckCircle,
  FiAlertTriangle,
  FiInfo,
  FiDatabase,
  FiClock,
  FiHardDrive
} from 'react-icons/fi';

interface DataHealthStatus {
  status: string;
  details: {
    totalDataTypes: number;
    dataTypes: Array<{
      type: string;
      hasData: boolean;
      dataSize: number;
      backupCount: number;
    }>;
    lastBackup: number;
    storageSize: number;
  };
}

const DataManagement: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<DataHealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [lastSync, setLastSync] = useState<{ [key: string]: number }>({});

  // Load health status on component mount
  useEffect(() => {
    loadHealthStatus();
  }, []);

  const loadHealthStatus = async () => {
    try {
      setLoading(true);
      const status = await ApiClient.checkDataHealth();
      setHealthStatus(status);
    } catch (error) {
      console.error('Failed to load health status:', error);
      toast.error('Failed to load data health status');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      setExporting(true);
      const blob = await ApiClient.exportUserData();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buni-money-tracker-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      
      // Read file content
      const text = await file.text();
      const importData = JSON.parse(text);
      
      // Validate import data
      if (!importData.data || typeof importData.data !== 'object') {
        throw new Error('Invalid backup file format');
      }
      
      // Import data
      await ApiClient.importUserData(importData);
      
      // Reload health status
      await loadHealthStatus();
      
      toast.success('Data imported successfully!');
    } catch (error) {
      console.error('Failed to import data:', error);
      toast.error('Failed to import data. Please check the file format.');
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const syncData = async (dataType: string) => {
    try {
      const lastSyncTime = lastSync[dataType] || 0;
      const result = await ApiClient.syncData(dataType, lastSyncTime);
      
      if (result.hasUpdates) {
        setLastSync(prev => ({ ...prev, [dataType]: result.timestamp }));
        toast.success(`${dataType} synced successfully!`);
      } else {
        toast(`${dataType} is already up to date`);
      }
    } catch (error) {
      console.error(`Failed to sync ${dataType}:`, error);
      toast.error(`Failed to sync ${dataType}`);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'unhealthy': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <FiCheckCircle className="text-green-400" />;
      case 'unhealthy': return <FiAlertTriangle className="text-red-400" />;
      default: return <FiInfo className="text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Data Management
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Manage your data, backups, and sync across devices
          </p>
        </div>
        <button
          onClick={loadHealthStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
        >
          <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
          <span style={{ color: 'var(--text-primary)' }}>Refresh</span>
        </button>
      </div>

      {/* Data Health Status */}
      <div className="liquid-card p-8 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <FiActivity size={24} style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Data Health Status
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <FiRefreshCw className="animate-spin mx-auto mb-4" size={32} style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>Checking data health...</p>
          </div>
        ) : healthStatus ? (
          <div className="space-y-6">
            {/* Overall Status */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
              {getStatusIcon(healthStatus.status)}
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Overall Status: <span className={getStatusColor(healthStatus.status)}>
                    {healthStatus.status.charAt(0).toUpperCase() + healthStatus.status.slice(1)}
                  </span>
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {healthStatus.details.totalDataTypes} data types • {formatBytes(healthStatus.details.storageSize)} total
                </p>
              </div>
            </div>

            {/* Data Types Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthStatus.details.dataTypes.map((dataType, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {dataType.type}
                    </span>
                    {dataType.hasData ? (
                      <FiCheckCircle size={16} className="text-green-400" />
                    ) : (
                      <FiAlertTriangle size={16} className="text-yellow-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Size: {formatBytes(dataType.dataSize)}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      Backups: {dataType.backupCount}
                    </p>
                  </div>
                  <button
                    onClick={() => syncData(dataType.type)}
                    className="mt-3 w-full px-3 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Sync Now
                  </button>
                </div>
              ))}
            </div>

            {/* Last Backup Info */}
            {healthStatus.details.lastBackup > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <FiClock size={20} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Last Backup
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(healthStatus.details.lastBackup)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiDatabase size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p style={{ color: 'var(--text-muted)' }}>No health data available</p>
          </div>
        )}
      </div>

      {/* Data Export/Import */}
      <div className="liquid-card p-8 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <FiShield size={24} style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Backup & Restore
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Data */}
          <div className="p-6 rounded-xl bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <FiDownload size={20} className="text-green-400" />
              <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Export Data
              </h4>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Download a complete backup of all your data. This includes transactions, accounts, settings, and more.
            </p>
            <button
              onClick={exportData}
              disabled={exporting}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
            >
              {exporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>

          {/* Import Data */}
          <div className="p-6 rounded-xl bg-white/5">
            <div className="flex items-center gap-3 mb-4">
              <FiUpload size={20} className="text-blue-400" />
              <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Import Data
              </h4>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Restore your data from a backup file. This will replace your current data.
            </p>
            <label className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 cursor-pointer inline-block text-center">
              {importing ? 'Importing...' : 'Import Data'}
              <input
                type="file"
                accept=".json"
                onChange={importData}
                disabled={importing}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Data Security Info */}
      <div className="liquid-card p-8 rounded-3xl">
        <div className="flex items-center gap-3 mb-6">
          <FiHardDrive size={24} style={{ color: 'var(--text-muted)' }} />
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Data Security & Storage
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiShield size={20} className="text-green-400 mt-1" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Secure Cloud Storage
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Your data is stored securely in the cloud using Redis with automatic backups and encryption.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FiCheckCircle size={20} className="text-green-400 mt-1" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Cross-Device Sync
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Access your data from any device. Changes sync automatically across all your devices.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FiActivity size={20} className="text-blue-400 mt-1" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Automatic Backups
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Your data is stored permanently in the cloud. Automatic backup snapshots are kept for 30 days for recovery purposes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FiInfo size={20} className="text-purple-400 mt-1" />
              <div>
                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Data Integrity
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Checksums verify data integrity. Corrupted data is automatically recovered from backups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;

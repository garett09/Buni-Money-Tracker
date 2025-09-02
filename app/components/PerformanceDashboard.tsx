'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PerformanceMonitor } from '@/app/lib/performance';
import { 
  FiActivity, 
  FiZap, 
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiRefreshCw
} from 'react-icons/fi';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'error';
  target: number;
  description: string;
}

export const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Performance thresholds
  const thresholds = {
    fcp: { good: 1800, warning: 2500, error: 3000 },
    lcp: { good: 2500, warning: 4000, error: 5000 },
    fid: { good: 100, warning: 300, error: 500 },
    cls: { good: 0.1, warning: 0.25, error: 0.4 },
  };

  // Get performance status
  const getStatus = (metric: string, value: number): 'good' | 'warning' | 'error' => {
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return 'good';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.warning) return 'warning';
    return 'error';
  };

  // Update metrics
  const updateMetrics = useCallback(() => {
    const webVitals = PerformanceMonitor.getMetrics('webVitals') as any[];
    const pageLoad = PerformanceMonitor.getMetrics('pageLoad') as any[];
    const memory = PerformanceMonitor.getMetrics('memory') as any[];
    
    if (!webVitals || !pageLoad || !memory) return;

    const latestWebVitals = webVitals[webVitals.length - 1];
    const latestPageLoad = pageLoad[pageLoad.length - 1];
    const latestMemory = memory[memory.length - 1];

    const newMetrics: PerformanceMetric[] = [];

    // FCP
    if (latestWebVitals?.fcp) {
      newMetrics.push({
        name: 'First Contentful Paint',
        value: latestWebVitals.fcp,
        unit: 'ms',
        status: getStatus('fcp', latestWebVitals.fcp),
        target: thresholds.fcp.good,
        description: 'Time until first content is painted on screen'
      });
    }

    // LCP
    if (latestWebVitals?.lcp) {
      newMetrics.push({
        name: 'Largest Contentful Paint',
        value: latestWebVitals.lcp,
        unit: 'ms',
        status: getStatus('lcp', latestWebVitals.lcp),
        target: thresholds.lcp.good,
        description: 'Time until largest content is painted on screen'
      });
    }

    // FID
    if (latestWebVitals?.fid) {
      newMetrics.push({
        name: 'First Input Delay',
        value: latestWebVitals.fid,
        unit: 'ms',
        status: getStatus('fid', latestWebVitals.fid),
        target: thresholds.fid.good,
        description: 'Time from user interaction to browser response'
      });
    }

    // CLS
    if (latestWebVitals?.cls) {
      newMetrics.push({
        name: 'Cumulative Layout Shift',
        value: latestWebVitals.cls,
        unit: '',
        status: getStatus('cls', latestWebVitals.cls),
        target: thresholds.cls.good,
        description: 'Measure of visual stability'
      });
    }

    // Page Load Time
    if (latestPageLoad?.loadTime) {
      newMetrics.push({
        name: 'Page Load Time',
        value: latestPageLoad.loadTime,
        unit: 'ms',
        status: latestPageLoad.loadTime < 2000 ? 'good' : 
                latestPageLoad.loadTime < 4000 ? 'warning' : 'error',
        target: 2000,
        description: 'Total time to load the page'
      });
    }

    // Memory Usage
    if (latestMemory?.memoryUsage) {
      newMetrics.push({
        name: 'Memory Usage',
        value: latestMemory.memoryUsage,
        unit: 'MB',
        status: latestMemory.memoryUsage < 100 ? 'good' : 
                latestMemory.memoryUsage < 200 ? 'warning' : 'error',
        target: 100,
        description: 'Current JavaScript heap memory usage'
      });
    }

    setMetrics(newMetrics);
    setLastUpdate(new Date());
  }, []);

  // Auto-update metrics
  useEffect(() => {
    updateMetrics();
    
    const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Toggle visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Get status icon
  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <FiAlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <FiAlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  // Performance score
  const performanceScore = useMemo(() => {
    if (metrics.length === 0) return 0;
    
    const goodCount = metrics.filter(m => m.status === 'good').length;
    const warningCount = metrics.filter(m => m.status === 'warning').length;
    const errorCount = metrics.filter(m => m.status === 'error').length;
    
    return Math.round((goodCount * 100 + warningCount * 60 + errorCount * 20) / metrics.length);
  }, [metrics]);

  // Performance grade
  const performanceGrade = useMemo(() => {
    if (performanceScore >= 90) return { grade: 'A', color: 'text-green-600' };
    if (performanceScore >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (performanceScore >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (performanceScore >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  }, [performanceScore]);

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Show Performance Dashboard"
      >
        <FiActivity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <FiZap className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Performance Dashboard</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={updateMetrics}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh metrics"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={toggleVisibility}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Hide dashboard"
          >
            <FiInfo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Performance Score */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Performance Score</span>
          <div className="flex items-center space-x-2">
            <span className={`text-2xl font-bold ${performanceGrade.color}`}>
              {performanceGrade.grade}
            </span>
            <span className="text-sm text-gray-500">({performanceScore}/100)</span>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              performanceScore >= 90 ? 'bg-green-500' :
              performanceScore >= 80 ? 'bg-blue-500' :
              performanceScore >= 70 ? 'bg-yellow-500' :
              performanceScore >= 60 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${performanceScore}%` }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="max-h-64 overflow-y-auto p-4 space-y-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getStatusColor(metric.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(metric.status)}
                <span className="text-sm font-medium text-gray-900">
                  {metric.name}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {metric.value.toFixed(1)}{metric.unit}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Target: {metric.target}{metric.unit}</span>
              <span>{metric.description}</span>
            </div>
          </div>
        ))}
        
        {metrics.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FiActivity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No performance data available</p>
            <p className="text-xs">Metrics will appear as you use the app</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PerformanceDashboard;

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
        return 'var(--accent-green)';
      case 'warning':
        return 'var(--accent-yellow)';
      case 'error':
        return 'var(--accent-red)';
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
    if (performanceScore >= 90) return { grade: 'A', color: 'var(--accent-green)' };
    if (performanceScore >= 80) return { grade: 'B', color: 'var(--accent-blue)' };
    if (performanceScore >= 70) return { grade: 'C', color: 'var(--accent-yellow)' };
    if (performanceScore >= 60) return { grade: 'D', color: 'var(--accent-orange)' };
    return { grade: 'F', color: 'var(--accent-red)' };
  }, [performanceScore]);

  if (!isVisible) {
    return (
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg transition-colors z-50"
        style={{ background: 'var(--accent-blue)', color: 'white' }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-blue-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-blue)'}
        title="Show Performance Dashboard"
      >
        <FiActivity className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 rounded-lg shadow-xl border z-50 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-center space-x-2">
          <FiZap className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Performance Dashboard</h3>
        </div>
                  <div className="flex items-center space-x-2">
            <button
              onClick={updateMetrics}
              className="p-1 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Refresh metrics"
            >
              <FiRefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleVisibility}
              className="p-1 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Hide dashboard"
            >
              <FiInfo className="w-4 h-4" />
            </button>
          </div>
      </div>

      {/* Performance Score */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Performance Score</span>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold" style={{ color: performanceGrade.color }}>
              {performanceGrade.grade}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>({performanceScore}/100)</span>
          </div>
        </div>
        <div className="mt-2 w-full rounded-full h-2" style={{ background: 'var(--overlay-light)' }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${performanceScore}%`,
              background: performanceScore >= 90 ? 'var(--accent-green)' :
                         performanceScore >= 80 ? 'var(--accent-blue)' :
                         performanceScore >= 70 ? 'var(--accent-yellow)' :
                         performanceScore >= 60 ? 'var(--accent-orange)' : 'var(--accent-red)'
            }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="max-h-64 overflow-y-auto p-4 space-y-3">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border"
            style={{ 
              borderColor: getStatusColor(metric.status),
              background: 'var(--card-bg)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(metric.status)}
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {metric.name}
                </span>
              </div>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {metric.value.toFixed(1)}{metric.unit}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Target: {metric.target}{metric.unit}</span>
              <span>{metric.description}</span>
            </div>
          </div>
        ))}
        
        {metrics.length === 0 && (
          <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
            <FiActivity className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
            <p>No performance data available</p>
            <p className="text-xs">Metrics will appear as you use the app</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-xs text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default PerformanceDashboard;

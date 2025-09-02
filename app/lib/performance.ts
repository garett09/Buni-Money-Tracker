// Performance monitoring and optimization utilities

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  timestamp?: number;
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
}

interface PerformanceObserver {
  name: string;
  callback: (metrics: PerformanceMetrics) => void;
}

class PerformanceMonitor {
  private static observers: PerformanceObserver[] = [];
  private static metrics: Map<string, PerformanceMetrics[]> = new Map();
  private static isMonitoring = false;


  // Start performance monitoring
  static startMonitoring() {
    if (this.isMonitoring || typeof window === 'undefined') return;
    
    this.isMonitoring = true;
    
    // Monitor page load performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.measurePageLoad();
        }, 0);
      });
    }

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        this.measureMemoryUsage();
      }, 30000); // Every 30 seconds
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) { // Tasks longer than 50ms
              console.warn('Long task detected:', entry);
              this.recordMetric('longTasks', {
                loadTime: entry.duration,
                renderTime: 0,
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported');
      }
    }

    // Monitor Web Vitals
    this.startWebVitalsMonitoring();
  }

  // Start Web Vitals monitoring
  private static startWebVitalsMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordMetric('webVitals', {
            loadTime: 0,
            renderTime: 0,
            fcp: lastEntry.startTime,
          });
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.recordMetric('webVitals', {
            loadTime: 0,
            renderTime: 0,
            lcp: lastEntry.startTime,
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          const fidEntry = entry as PerformanceEventTiming;
          if (fidEntry.processingStart) {
            this.recordMetric('webVitals', {
              loadTime: 0,
              renderTime: 0,
              fid: fidEntry.processingStart - fidEntry.startTime,
            });
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        }
        this.recordMetric('webVitals', {
          loadTime: 0,
          renderTime: 0,
          cls: clsValue,
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.warn('Web Vitals monitoring not supported:', error);
    }
  }

  // Measure page load performance
  private static measurePageLoad() {
    if (!('performance' in window)) return;

    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    const metrics: PerformanceMetrics = {
      loadTime: navigation.loadEventEnd - navigation.loadEventStart,
      renderTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    };

    this.recordMetric('pageLoad', metrics);
    this.notifyObservers('pageLoad', metrics);
  }

  // Measure memory usage
  private static measureMemoryUsage() {
    if (!('memory' in performance)) return;

    const memory = (performance as any).memory;
    const metrics: PerformanceMetrics = {
      loadTime: 0,
      renderTime: 0,
      memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
    };

    this.recordMetric('memory', metrics);
    this.notifyObservers('memory', metrics);
  }

  // Record performance metric
  static recordMetric(name: string, metrics: PerformanceMetrics) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push({
      ...metrics,
      timestamp: Date.now(),
    });

    // Keep only last 100 metrics
    const metricList = this.metrics.get(name)!;
    if (metricList.length > 100) {
      metricList.splice(0, metricList.length - 100);
    }
  }

  // Add performance observer
  static addObserver(name: string, callback: (metrics: PerformanceMetrics) => void) {
    this.observers.push({ name, callback });
  }



  // Notify observers
  private static notifyObservers(metricName: string, metrics: PerformanceMetrics) {
    this.observers.forEach(observer => {
      try {
        observer.callback(metrics);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  // Get performance metrics
  static getMetrics(name?: string): PerformanceMetrics[] | Map<string, PerformanceMetrics[]> {
    if (name) {
      return this.metrics.get(name) || [];
    }
    return this.metrics;
  }

}

// Performance optimization utilities
export const optimizeImages = () => {
  if (typeof window === 'undefined') return;

  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading="lazy" to images below the fold
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    
    // Add decoding="async" for better performance
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
  });
};

export const optimizeFonts = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@400;500;600;700&display=swap',
  ];

  criticalFonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    document.head.appendChild(link);
  });
};

// Resource hints for performance
export const addResourceHints = () => {
  if (typeof window === 'undefined') return;

  // DNS prefetch for external domains
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',

  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  });

  // Preconnect to critical domains
  const criticalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ];

  criticalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = `https://${domain}`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
  } catch (error) {
    console.warn('Service Worker registration failed:', error);
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = async () => {
  if (typeof window === 'undefined') return;

  try {
    // This would typically be done at build time
    // For runtime, we can optimize by removing non-critical CSS
    const nonCriticalLinks = document.querySelectorAll('link[data-critical="false"]');
    nonCriticalLinks.forEach(link => {
      const linkElement = link as HTMLLinkElement;
      linkElement.media = 'print';
      linkElement.onload = () => {
        linkElement.media = 'all';
      };
    });
  } catch (error) {
    console.warn('Critical CSS optimization failed:', error);
  }
};



// Export the PerformanceMonitor
export { PerformanceMonitor };

// Start monitoring automatically in development
if (process.env.NODE_ENV === 'development') {
  PerformanceMonitor.startMonitoring();
}

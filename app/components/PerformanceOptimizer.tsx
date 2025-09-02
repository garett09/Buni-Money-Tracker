'use client';

import { useEffect, useRef } from 'react';
import { 
  PerformanceMonitor, 
  addResourceHints, 
  registerServiceWorker,
  inlineCriticalCSS,
  optimizeImages,
  optimizeFonts
} from '@/app/lib/performance';

export const PerformanceOptimizer = () => {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Start performance monitoring
    PerformanceMonitor.startMonitoring();

    // Add resource hints
    addResourceHints();

    // Register service worker
    if (process.env.NEXT_PUBLIC_ENABLE_SERVICE_WORKER === 'true') {
      registerServiceWorker().catch(console.warn);
    }

    // Optimize images and fonts
    optimizeImages();
    optimizeFonts();

    // Inline critical CSS
    inlineCriticalCSS();

    // Prefetch critical data
    prefetchCriticalData();

    // Add intersection observer for lazy loading
    setupIntersectionObserver();

    // Setup performance budget monitoring
    setupPerformanceBudget();

  }, []);

  // Prefetch critical data
  const prefetchCriticalData = async () => {
    try {
      // Prefetch critical API endpoints
      const criticalEndpoints = [
        '/api/accounts',
        '/api/transactions/income',
        '/api/transactions/expenses',
      ];

      // Use requestIdleCallback for non-critical prefetching
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          criticalEndpoints.forEach(endpoint => {
            fetch(endpoint, { 
              method: 'HEAD',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
            }).catch(() => {}); // Ignore errors for prefetch
          });
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          criticalEndpoints.forEach(endpoint => {
            fetch(endpoint, { 
              method: 'HEAD',
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
            }).catch(() => {});
          });
        }, 1000);
      }
    } catch (error) {
      console.warn('Failed to prefetch critical data:', error);
    }
  };

  // Setup intersection observer for lazy loading
  const setupIntersectionObserver = () => {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1,
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  };

  // Setup performance budget monitoring
  const setupPerformanceBudget = () => {
    // Monitor performance metrics and warn if they exceed budget
    PerformanceMonitor.addObserver('performance-budget', (metrics) => {
      const budget = {
        fcp: 1800, // 1.8s
        lcp: 2500, // 2.5s
        fid: 100,  // 100ms
        cls: 0.1,  // 0.1
      };

      const violations = [];
      
      if (metrics.fcp && metrics.fcp > budget.fcp) {
        violations.push(`FCP: ${metrics.fcp}ms (budget: ${budget.fcp}ms)`);
      }
      
      if (metrics.lcp && metrics.lcp > budget.lcp) {
        violations.push(`LCP: ${metrics.lcp}ms (budget: ${budget.lcp}ms)`);
      }
      
      if (metrics.fid && metrics.fid > budget.fid) {
        violations.push(`FID: ${metrics.fid}ms (budget: ${budget.fid}ms)`);
      }
      
      if (metrics.cls && metrics.cls > budget.cls) {
        violations.push(`CLS: ${metrics.cls} (budget: ${budget.cls})`);
      }

      if (violations.length > 0) {
        console.warn('Performance budget violations:', violations);
        
        // Send to analytics if available
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'performance_budget_violation', {
            violations: violations.join(', '),
            page: window.location.pathname,
          });
        }
      }
    });
  };

  // Component doesn't render anything
  return null;
};

// Declare global types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

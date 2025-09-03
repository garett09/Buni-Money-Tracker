'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface PageTransitionOptimizerProps {
  children: React.ReactNode;
}

export const PageTransitionOptimizer: React.FC<PageTransitionOptimizerProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const previousPath = useRef<string>('');
  const transitionTimeout = useRef<NodeJS.Timeout | null>(null);
  const prefetchCache = useRef<Set<string>>(new Set());

  // Prefetch critical routes for faster navigation
  const prefetchRoute = useCallback(async (route: string) => {
    if (prefetchCache.current.has(route)) return;
    
    try {
      // Prefetch the route data
      await router.prefetch(route);
      prefetchCache.current.add(route);
    } catch (error) {
      // Ignore prefetch errors
    }
  }, [router]);

  // Optimize page transitions
  const optimizeTransition = useCallback((newPath: string) => {
    if (previousPath.current === newPath) return;

    // Clear any existing transition timeout
    if (transitionTimeout.current) {
      clearTimeout(transitionTimeout.current);
    }

    // Add loading state for smooth transitions
    document.body.classList.add('page-transitioning');

    // Remove loading state after transition
    transitionTimeout.current = setTimeout(() => {
      document.body.classList.remove('page-transitioning');
    }, 300);

    previousPath.current = newPath;
  }, []);

  // Prefetch critical routes on mount
  useEffect(() => {
    const criticalRoutes = [
      '/dashboard',
      '/dashboard/income',
      '/dashboard/expenses',
      '/dashboard/transactions',
      '/dashboard/accounts',
      '/dashboard/savings',
      '/dashboard/shared',
      '/dashboard/data'
    ];

    // Prefetch critical routes in background
    criticalRoutes.forEach(route => {
      if (route !== pathname) {
        prefetchRoute(route);
      }
    });
  }, [pathname, prefetchRoute]);

  // Optimize transitions when pathname changes
  useEffect(() => {
    optimizeTransition(pathname);
  }, [pathname, optimizeTransition]);

  // Prefetch routes on hover for better UX
  const handleRouteHover = () => {
    // This will be implemented when we add the component to the layout
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeout.current) {
        clearTimeout(transitionTimeout.current);
        transitionTimeout.current = null;
      }
    };
  }, []);

  return <>{children}</>;
};

export default PageTransitionOptimizer;

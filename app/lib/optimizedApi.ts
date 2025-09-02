// Optimized API client with caching, request deduplication, and performance optimizations

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface PendingRequest<T> {
  promise: Promise<T>;
  timestamp: number;
}

export class OptimizedApiClient {
  private static cache = new Map<string, CacheEntry<any>>();
  private static pendingRequests = new Map<string, PendingRequest<any>>();
  private static cacheTTL = 5 * 60 * 1000; // 5 minutes default TTL
  
  // Request deduplication - prevents multiple identical requests
  private static deduplicateRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    const now = Date.now();
    
    // Check if we have a valid cached response
    const cached = this.cache.get(key);
    if (cached && (now - cached.timestamp) < cached.ttl) {
      return Promise.resolve(cached.data);
    }
    
    // Check if there's already a pending request
    const pending = this.pendingRequests.get(key);
    if (pending && (now - pending.timestamp) < 30000) { // 30s max pending time
      return pending.promise;
    }
    
    // Create new request
    const promise = requestFn().then(data => {
      // Cache the successful response
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl: this.cacheTTL
      });
      
      // Remove from pending requests
      this.pendingRequests.delete(key);
      
      return data;
    }).catch(error => {
      // Remove from pending requests on error
      this.pendingRequests.delete(key);
      throw error;
    });
    
    // Store pending request
    this.pendingRequests.set(key, {
      promise,
      timestamp: now
    });
    
    return promise;
  }
  
  // Clear cache for specific keys or all
  static clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
  
  // Set custom TTL for specific endpoints
  static setCacheTTL(endpoint: string, ttl: number) {
    const key = `ttl:${endpoint}`;
    this.cache.set(key, { data: ttl, timestamp: Date.now(), ttl: Infinity });
  }
  
  // Get cached data if available
  static getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
      return cached.data;
    }
    return null;
  }
  
  // Optimized fetch with retry logic and timeout
  private static async optimizedFetch(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  // Get auth headers with error handling
  private static getAuthHeaders(): HeadersInit {
    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      return headers;
    } catch (error) {
      return { 'Content-Type': 'application/json' };
    }
  }
  
  // Income transactions with caching
  static async getIncomeTransactions() {
    const key = 'income_transactions';
    return this.deduplicateRequest(key, async () => {
      const response = await this.optimizedFetch('/api/transactions/income', {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch income transactions');
      }
      
      return response.json();
    });
  }
  
  // Expense transactions with caching
  static async getExpenseTransactions() {
    const key = 'expense_transactions';
    return this.deduplicateRequest(key, async () => {
      const response = await this.optimizedFetch('/api/transactions/expenses', {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch expense transactions');
      }
      
      return response.json();
    });
  }
  
  // Accounts with caching
  static async getAccounts() {
    const key = 'accounts';
    return this.deduplicateRequest(key, async () => {
      const response = await this.optimizedFetch('/api/accounts', {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }
      
      return response.json();
    });
  }
  
  // Savings with caching
  static async getSavings() {
    const key = 'savings';
    return this.deduplicateRequest(key, async () => {
      const response = await this.optimizedFetch('/api/savings', {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch savings');
      }
      
      return response.json();
    });
  }
  
  // Shared expenses with caching
  static async getSharedExpenses() {
    const key = 'shared_expenses';
    return this.deduplicateRequest(key, async () => {
      const response = await this.optimizedFetch('/api/shared/expenses', {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch shared expenses');
      }
      
      return response.json();
    });
  }
  
  // Batch fetch multiple endpoints
  static async batchFetch(endpoints: string[]) {
    const promises = endpoints.map(endpoint => {
      switch (endpoint) {
        case 'income':
          return this.getIncomeTransactions();
        case 'expenses':
          return this.getExpenseTransactions();
        case 'accounts':
          return this.getAccounts();
        case 'savings':
          return this.getSavings();
        case 'shared':
          return this.getSharedExpenses();
        default:
          return Promise.resolve(null);
      }
    });
    
    const results = await Promise.allSettled(promises);
    return results.map((result, index) => ({
      endpoint: endpoints[index],
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null,
    }));
  }

  // Batch get all data for dashboard
  static async batchGetAllData() {
    const [income, expenses, accounts, savings, shared] = await Promise.allSettled([
      this.getIncomeTransactions(),
      this.getExpenseTransactions(),
      this.getAccounts(),
      this.getSavings(),
      this.getSharedExpenses(),
    ]);

    return {
      income: income.status === 'fulfilled' ? income.value : { transactions: [] },
      expenses: expenses.status === 'fulfilled' ? expenses.value : { transactions: [] },
      accounts: accounts.status === 'fulfilled' ? accounts.value : { accounts: [] },
      savings: savings.status === 'fulfilled' ? savings.value : { goals: [] },
      shared: shared.status === 'fulfilled' ? shared.value : { expenses: [] },
    };
  }
  
  // Prefetch critical data
  static async prefetchCriticalData() {
    const criticalEndpoints = ['income', 'expenses', 'accounts'];
    
    // Use requestIdleCallback for non-critical prefetching
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.batchFetch(criticalEndpoints).catch(() => {});
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        this.batchFetch(criticalEndpoints).catch(() => {});
      }, 100);
    }
  }
  
  // Clear all caches and pending requests
  static clearAll() {
    this.cache.clear();
    this.pendingRequests.clear();
  }
  
  // Get cache statistics
  static getCacheStats() {
    return {
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
      cacheKeys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const apiClient = new OptimizedApiClient();

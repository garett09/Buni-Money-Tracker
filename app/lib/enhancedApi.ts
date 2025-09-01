// Enhanced API Client for Buni Money Tracker
// Provides reliable data fetching with caching, retry logic, and validation

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class EnhancedApiClient {
  private static instance: EnhancedApiClient;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private retryAttempts: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  private constructor() {}

  static getInstance(): EnhancedApiClient {
    if (!EnhancedApiClient.instance) {
      EnhancedApiClient.instance = new EnhancedApiClient();
    }
    return EnhancedApiClient.instance;
  }

  private getApiBase(): string {
    if (process.env.NODE_ENV === 'production') {
      return 'https://your-vercel-app.vercel.app';
    }
    
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    
    // Use environment variable if available
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    
    // In production, use relative URLs (handled by Vercel)
    if (process.env.NODE_ENV === 'production' as any) {
      return '';
    }
    
    // Development fallback - use relative URLs for simplicity
    return '';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  private generateCacheKey(endpoint: string, params?: any): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  private isCacheValid(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() < entry.expiresAt;
  }

  private getCachedData<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      const entry = this.cache.get(key);
      return entry?.data || null;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_DURATION
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    cacheKey: string,
    endpoint: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const result = await requestFn();
        this.retryAttempts.delete(cacheKey);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`API request failed (attempt ${attempt}/${this.MAX_RETRIES}):`, error);
        
        if (attempt < this.MAX_RETRIES) {
          const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
          await this.delay(delay);
        }
      }
    }
    
    this.retryAttempts.set(cacheKey, Date.now());
    throw lastError!;
  }

  private validateTransaction(transaction: any): boolean {
    return (
      transaction &&
      typeof transaction.amount === 'number' &&
      transaction.amount > 0 &&
      transaction.date &&
      typeof transaction.description === 'string' &&
      transaction.description.trim().length > 0
    );
  }

  private validateSavingsGoal(goal: any): boolean {
    return (
      goal &&
      typeof goal.targetAmount === 'number' &&
      goal.targetAmount > 0 &&
      typeof goal.name === 'string' &&
      goal.name.trim().length > 0
    );
  }

  private sanitizeTransaction(transaction: any): any {
    return {
      id: transaction.id || Date.now() + Math.random(),
      amount: Math.abs(transaction.amount),
      description: (transaction.description || '').trim(),
      category: transaction.category || 'Other',
      date: transaction.date,
      account: transaction.account || 'Default',
      tags: Array.isArray(transaction.tags) ? transaction.tags : [],
      recurring: Boolean(transaction.recurring),
      merchant: transaction.merchant || 'Unknown'
    };
  }

  private sanitizeSavingsGoal(goal: any): any {
    return {
      id: goal.id || Date.now() + Math.random(),
      name: (goal.name || '').trim(),
      targetAmount: Math.abs(goal.targetAmount),
      currentAmount: Math.abs(goal.currentAmount || 0),
      deadline: goal.deadline || null,
      description: goal.description || '',
      priority: goal.priority || 'medium'
    };
  }

  async getIncomeTransactions(useCache: boolean = true): Promise<ApiResponse<any[]>> {
    const cacheKey = this.generateCacheKey('income-transactions');
    
    if (useCache) {
      const cached = this.getCachedData<any[]>(cacheKey);
      if (cached) {
        return { success: true, data: cached, timestamp: Date.now() };
      }
    }

    try {
      const response = await this.retryRequest(
        async () => {
          const res = await fetch(`${this.getApiBase()}/api/transactions/income`, {
            headers: this.getAuthHeaders(),
          });
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          return res.json();
        },
        cacheKey,
        'income-transactions'
      );

      const transactions = response.transactions || [];
      const validTransactions = transactions
        .filter(this.validateTransaction)
        .map(this.sanitizeTransaction);

      this.setCachedData(cacheKey, validTransactions);
      
      return {
        success: true,
        data: validTransactions,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to fetch income transactions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async getExpenseTransactions(useCache: boolean = true): Promise<ApiResponse<any[]>> {
    const cacheKey = this.generateCacheKey('expense-transactions');
    
    if (useCache) {
      const cached = this.getCachedData<any[]>(cacheKey);
      if (cached) {
        return { success: true, data: cached, timestamp: Date.now() };
      }
    }

    try {
      const response = await this.retryRequest(
        async () => {
          const res = await fetch(`${this.getApiBase()}/api/transactions/expenses`, {
            headers: this.getAuthHeaders(),
          });
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          return res.json();
        },
        cacheKey,
        'expense-transactions'
      );

      const transactions = response.transactions || [];
      const validTransactions = transactions
        .filter(this.validateTransaction)
        .map(this.sanitizeTransaction);

      this.setCachedData(cacheKey, validTransactions);
      
      return {
        success: true,
        data: validTransactions,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to fetch expense transactions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async getSavingsGoals(useCache: boolean = true): Promise<ApiResponse<any[]>> {
    const cacheKey = this.generateCacheKey('savings-goals');
    
    if (useCache) {
      const cached = this.getCachedData<any[]>(cacheKey);
      if (cached) {
        return { success: true, data: cached, timestamp: Date.now() };
      }
    }

    try {
      const response = await this.retryRequest(
        async () => {
          const res = await fetch(`${this.getApiBase()}/api/savings`, {
            headers: this.getAuthHeaders(),
          });
          
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          
          return res.json();
        },
        cacheKey,
        'savings-goals'
      );

      const goals = response.goals || [];
      const validGoals = goals
        .filter(this.validateSavingsGoal)
        .map(this.sanitizeSavingsGoal);

      this.setCachedData(cacheKey, validGoals);
      
      return {
        success: true,
        data: validGoals,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to fetch savings goals:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async addIncomeTransaction(transactionData: any): Promise<ApiResponse<any>> {
    try {
      if (!this.validateTransaction(transactionData)) {
        throw new Error('Invalid transaction data');
      }

      const sanitizedData = this.sanitizeTransaction(transactionData);
      
      const response = await fetch(`${this.getApiBase()}/api/transactions/income`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(sanitizedData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Invalidate cache
      this.cache.delete(this.generateCacheKey('income-transactions'));
      
      return {
        success: true,
        data: result,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to add income transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async addExpenseTransaction(transactionData: any): Promise<ApiResponse<any>> {
    try {
      if (!this.validateTransaction(transactionData)) {
        throw new Error('Invalid transaction data');
      }

      const sanitizedData = this.sanitizeTransaction(transactionData);
      
      const response = await fetch(`${this.getApiBase()}/api/transactions/expenses`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(sanitizedData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Invalidate cache
      this.cache.delete(this.generateCacheKey('expense-transactions'));
      
      return {
        success: true,
        data: result,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to add expense transaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async addSavingsGoal(goalData: any): Promise<ApiResponse<any>> {
    try {
      if (!this.validateSavingsGoal(goalData)) {
        throw new Error('Invalid savings goal data');
      }

      const sanitizedData = this.sanitizeSavingsGoal(goalData);
      
      const response = await fetch(`${this.getApiBase()}/api/savings`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(sanitizedData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Invalidate cache
      this.cache.delete(this.generateCacheKey('savings-goals'));
      
      return {
        success: true,
        data: result,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Failed to add savings goal:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  // Cache management methods
  clearCache(): void {
    this.cache.clear();
  }

  clearCacheForEndpoint(endpoint: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(endpoint)) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getApiBase()}/api/hello`, {
        headers: this.getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Batch operations for better performance
  async batchGetData(): Promise<{
    income: ApiResponse<any[]>;
    expenses: ApiResponse<any[]>;
    savings: ApiResponse<any[]>;
  }> {
    const [income, expenses, savings] = await Promise.all([
      this.getIncomeTransactions(),
      this.getExpenseTransactions(),
      this.getSavingsGoals()
    ]);

    return { income, expenses, savings };
  }
}

// Export singleton instance
export const enhancedApiClient = EnhancedApiClient.getInstance();

// Export types for external use
export type { ApiResponse, CacheEntry };

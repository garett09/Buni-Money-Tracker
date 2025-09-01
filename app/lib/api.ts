// API helper functions for authenticated requests

// Get the correct API base URL
const getApiBase = () => {
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
};

const API_BASE = getApiBase();

export class ApiClient {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('Auth token:', token ? 'Present' : 'Missing');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Income transactions
  static async getIncomeTransactions() {
    const response = await fetch(`${API_BASE}/api/transactions/income`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch income transactions');
    }
    
    return response.json();
  }

  static async addIncomeTransaction(transactionData: any) {
    const response = await fetch(`${API_BASE}/api/transactions/income`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add income transaction');
    }
    
    return response.json();
  }

  static async updateIncomeTransaction(transactionId: number, updates: any) {
    const response = await fetch(`${API_BASE}/api/transactions/income`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ transactionId, updates }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update income transaction');
    }
    
    return response.json();
  }

  static async deleteIncomeTransaction(transactionId: number) {
    const response = await fetch(`${API_BASE}/api/transactions/income`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ transactionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete income transaction');
    }
    
    return response.json();
  }

  // Expense transactions
  static async getExpenseTransactions() {
    const response = await fetch(`${API_BASE}/api/transactions/expenses`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch expense transactions');
    }
    
    return response.json();
  }

  static async addExpenseTransaction(transactionData: any) {
    const response = await fetch(`${API_BASE}/api/transactions/expenses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add expense transaction');
    }
    
    return response.json();
  }

  static async updateExpenseTransaction(transactionId: number, updates: any) {
    const response = await fetch(`${API_BASE}/api/transactions/expenses`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ transactionId, updates }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update expense transaction');
    }
    
    return response.json();
  }

  static async deleteExpenseTransaction(transactionId: number) {
    const response = await fetch(`${API_BASE}/api/transactions/expenses`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ transactionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete expense transaction');
    }
    
    return response.json();
  }

  // Savings goals
  static async getSavingsGoals() {
    const response = await fetch(`${API_BASE}/api/savings`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch savings goals');
    }
    
    return response.json();
  }

  static async addSavingsGoal(goalData: any) {
    const response = await fetch(`${API_BASE}/api/savings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(goalData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add savings goal');
    }
    
    return response.json();
  }

  static async updateSavingsGoal(goalId: number, updates: any) {
    const response = await fetch(`${API_BASE}/api/savings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ goalId, updates }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update savings goal');
    }
    
    return response.json();
  }

  static async deleteSavingsGoal(goalId: number) {
    const response = await fetch(`${API_BASE}/api/savings`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ goalId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete savings goal');
    }
    
    return response.json();
  }

  // User management
  static async getUserProfile() {
    const response = await fetch(`${API_BASE}/api/users`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    return response.json();
  }

  static async updateUserProfile(updates: any) {
    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    
    return response.json();
  }

  static async deleteUserAccount() {
    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user account');
    }
    
    return response.json();
  }

  // Shared expenses
  static async getSharedExpenses() {
    const response = await fetch(`${API_BASE}/api/shared/expenses`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch shared expenses');
    }
    
    return response.json();
  }

  static async enableExpenseSharing(partnerEmail: string, partnerName?: string) {
    const response = await fetch(`${API_BASE}/api/shared/expenses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ action: 'enable', partnerEmail, partnerName }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to enable expense sharing');
    }
    
    return response.json();
  }

  static async disableExpenseSharing() {
    const response = await fetch(`${API_BASE}/api/shared/expenses`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ action: 'disable' }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to disable expense sharing');
    }
    
    return response.json();
  }

  // Accounts management
  static async getAccounts() {
    const url = `${API_BASE}/api/accounts`;
    console.log('API_BASE:', API_BASE);
    console.log('Full URL:', url);
    
    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Get accounts API error:', response.status, errorText);
      throw new Error(`Failed to fetch accounts: ${response.status} ${errorText}`);
    }
    
    return response.json();
  }

  static async addAccount(accountData: any) {
    const response = await fetch(`${API_BASE}/api/accounts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(accountData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add account');
    }
    
    return response.json();
  }

  static async updateAccount(accountId: number, updates: any) {
    const response = await fetch(`${API_BASE}/api/accounts`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ accountId, updates }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update account');
    }
    
    return response.json();
  }

  static async deleteAccount(accountId: number) {
    const response = await fetch(`${API_BASE}/api/accounts`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ accountId }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Delete account API error:', response.status, errorText);
      throw new Error(`Failed to delete account: ${response.status} ${errorText}`);
    }
    
    return response.json();
  }

  // Data management and backup
  static async exportUserData(): Promise<Blob> {
    const response = await fetch(`${API_BASE}/api/data/export`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to export user data');
    }
    
    return response.blob();
  }

  static async importUserData(importData: any) {
    const response = await fetch(`${API_BASE}/api/data/import`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(importData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to import user data');
    }
    
    return response.json();
  }

  static async checkDataHealth() {
    const response = await fetch(`${API_BASE}/api/data/health`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to check data health');
    }
    
    return response.json();
  }

  // Sync data across devices
  static async syncData(dataType: string, lastSyncTime: number) {
    const response = await fetch(`${API_BASE}/api/data/sync`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ dataType, lastSyncTime }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync data');
    }
    
    return response.json();
  }
}

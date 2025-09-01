// API helper functions for authenticated requests

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-app.vercel.app' 
  : '';

export class ApiClient {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
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
}

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
}

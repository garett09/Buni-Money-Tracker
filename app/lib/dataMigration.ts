// Data migration utility to move localStorage data to database

import { ApiClient } from './api';

export class DataMigration {
  // Migrate localStorage data to database
  static async migrateLocalDataToDatabase() {
    try {
      console.log('Starting data migration from localStorage to database...');
      
      // Get localStorage data
      const localIncome = localStorage.getItem('incomeTransactions');
      const localExpenses = localStorage.getItem('expenseTransactions');
      
      let migratedCount = 0;
      
      // Migrate income transactions
      if (localIncome) {
        const incomeTransactions = JSON.parse(localIncome);
        for (const transaction of incomeTransactions) {
          try {
            // Remove the id and createdAt to let the API generate new ones
            const { id, createdAt, ...transactionData } = transaction;
            await ApiClient.addIncomeTransaction(transactionData);
            migratedCount++;
          } catch (error) {
            console.error('Error migrating income transaction:', error);
          }
        }
      }
      
      // Migrate expense transactions
      if (localExpenses) {
        const expenseTransactions = JSON.parse(localExpenses);
        for (const transaction of expenseTransactions) {
          try {
            // Remove the id and createdAt to let the API generate new ones
            const { id, createdAt, ...transactionData } = transaction;
            await ApiClient.addExpenseTransaction(transactionData);
            migratedCount++;
          } catch (error) {
            console.error('Error migrating expense transaction:', error);
          }
        }
      }
      
      console.log(`Data migration completed. ${migratedCount} transactions migrated.`);
      return { success: true, migratedCount };
      
    } catch (error) {
      console.error('Data migration failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Check if user has localStorage data that needs migration
  static hasLocalDataToMigrate(): boolean {
    const localIncome = localStorage.getItem('incomeTransactions');
    const localExpenses = localStorage.getItem('expenseTransactions');
    
    if (localIncome) {
      const incomeTransactions = JSON.parse(localIncome);
      if (incomeTransactions.length > 0) return true;
    }
    
    if (localExpenses) {
      const expenseTransactions = JSON.parse(localExpenses);
      if (expenseTransactions.length > 0) return true;
    }
    
    return false;
  }
  
  // Clear localStorage data after successful migration
  static clearLocalData() {
    localStorage.removeItem('incomeTransactions');
    localStorage.removeItem('expenseTransactions');
    console.log('LocalStorage data cleared after migration');
  }
}

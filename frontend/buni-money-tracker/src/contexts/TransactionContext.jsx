import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_PATHS, getAuthHeaders } from "../utils/apiPaths";
import toast from "react-hot-toast";

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    transactionCount: 0,
    categoryBreakdown: []
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch transactions
  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_PATHS.TRANSACTIONS}?${params}`, {
        headers: getAuthHeaders(),
      });
      
      setTransactions(response.data.transactions);
      return response.data;
    } catch (error) {
      console.error("Fetch transactions error:", error);
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_PATHS.TRANSACTION_STATS}?${params}`, {
        headers: getAuthHeaders(),
      });
      
      setStats(response.data);
      return response.data;
    } catch (error) {
      console.error("Fetch stats error:", error);
      toast.error("Failed to fetch statistics");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_PATHS.TRANSACTION_CATEGORIES, {
        headers: getAuthHeaders(),
      });
      
      setCategories(response.data.categories);
      return response.data.categories;
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  // Create transaction
  const createTransaction = async (transactionData) => {
    try {
      const response = await axios.post(API_PATHS.TRANSACTIONS, transactionData, {
        headers: getAuthHeaders(),
      });
      
      setTransactions(prev => [response.data.transaction, ...prev]);
      await fetchStats(); // Refresh stats
      
      toast.success("Transaction created successfully!");
      return { success: true, transaction: response.data.transaction };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create transaction";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await axios.put(`${API_PATHS.TRANSACTIONS}/${id}`, transactionData, {
        headers: getAuthHeaders(),
      });
      
      setTransactions(prev => 
        prev.map(t => t._id === id ? response.data.transaction : t)
      );
      await fetchStats(); // Refresh stats
      
      toast.success("Transaction updated successfully!");
      return { success: true, transaction: response.data.transaction };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update transaction";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_PATHS.TRANSACTIONS}/${id}`, {
        headers: getAuthHeaders(),
      });
      
      setTransactions(prev => prev.filter(t => t._id !== id));
      await fetchStats(); // Refresh stats
      
      toast.success("Transaction deleted successfully!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete transaction";
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Get transaction by ID
  const getTransaction = async (id) => {
    try {
      const response = await axios.get(`${API_PATHS.TRANSACTIONS}/${id}`, {
        headers: getAuthHeaders(),
      });
      
      return response.data.transaction;
    } catch (error) {
      console.error("Get transaction error:", error);
      toast.error("Failed to fetch transaction");
      return null;
    }
  };

  // Refresh all data
  const refreshData = async (filters = {}) => {
    await Promise.all([
      fetchTransactions(filters),
      fetchStats(filters),
      fetchCategories()
    ]);
  };

  const value = {
    transactions,
    stats,
    categories,
    loading,
    fetchTransactions,
    fetchStats,
    fetchCategories,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    refreshData,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
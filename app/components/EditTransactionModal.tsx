'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { incomeCategories, expenseCategories } from '@/app/lib/categories';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  type: 'income' | 'expense';
  onUpdate: (updatedTransaction: any) => void;
  onDelete: (transactionId: number) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  type,
  onUpdate,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    subcategory: '',
    date: '',
    recurring: false,
    frequency: 'monthly',
    accountId: ''
  });
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  // Load accounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const { ApiClient } = await import('@/app/lib/api');
        const response = await ApiClient.getAccounts();
        setAccounts(response.accounts || []);
      } catch (error) {
        console.log('Failed to load accounts, using empty array');
        setAccounts([]);
      }
    };

    loadAccounts();
  }, []);

  useEffect(() => {
    if (transaction && isOpen) {
      setFormData({
        amount: transaction.amount?.toString() || '',
        description: transaction.description || '',
        category: transaction.category || '',
        subcategory: transaction.subcategory || '',
        date: transaction.date || '',
        recurring: transaction.recurring || false,
        frequency: transaction.frequency || 'monthly',
        accountId: transaction.accountId || ''
      });

      const category = categories.find(cat => cat.name === transaction.category);
      setSelectedCategory(category);
    }
  }, [transaction, isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'category') {
      const category = categories.find(cat => cat.name === value);
      setSelectedCategory(category);
      setFormData({
        ...formData,
        [name]: value,
        subcategory: '', // Reset subcategory when category changes
        accountId: formData.accountId // Preserve accountId
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedTransaction = {
        ...transaction,
        ...formData,
        amount: parseFloat(formData.amount),
        updatedAt: new Date().toISOString()
      };

      onUpdate(updatedTransaction);
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} updated successfully!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to update ${type === 'income' ? 'income' : 'expense'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      onDelete(transaction.id);
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} deleted successfully!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to delete ${type === 'income' ? 'income' : 'expense'}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="liquid-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-display text-2xl font-semibold text-white flex items-center gap-2">
            <FiEdit3 size={24} />
            Edit {type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiX size={20} className="text-white/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="amount" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Amount (₱)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="liquid-input w-full px-6 py-4 focus:outline-none text-lg resize-none"
              placeholder={`Describe your ${type}...`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="subcategory" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Subcategory
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
                disabled={!selectedCategory}
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg disabled:opacity-50"
              >
                <option value="">Select subcategory</option>
                {selectedCategory?.subcategories.map((sub: any) => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="accountId" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
              Account
            </label>
            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              required
              className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName} - ₱{account.currentBalance?.toLocaleString() || '0'}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="recurring"
                checked={formData.recurring}
                onChange={handleChange}
                className="w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-blue-500"
              />
              <span className="text-white/80">Recurring {type === 'income' ? 'Income' : 'Expense'}</span>
            </label>
            {formData.recurring && (
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="liquid-input px-4 py-2 rounded-xl focus:outline-none"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 liquid-button text-white py-4 px-6 font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Transaction"}
            </button>
            
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="px-6 py-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FiTrash2 size={20} />
              Delete
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="liquid-card max-w-md w-full">
            <div className="p-6">
              <h3 className="text-display text-xl font-semibold text-white mb-4">
                Confirm Deletion
              </h3>
              <p className="text-white/70 mb-6">
                Are you sure you want to delete this {type} transaction? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTransactionModal;

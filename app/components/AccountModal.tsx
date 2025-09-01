'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiEdit3, FiTrash2, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { 
  philippineBanks, 
  creditCards, 
  digitalWallets, 
  accountTypes,
  getAccountTypeOptions,
  getBankById,
  getCreditCardById,
  getDigitalWalletById
} from '@/app/lib/accounts';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account?: any;
  onSave: (accountData: any) => void;
  onDelete?: (accountId: number) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  account,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    name: '',
    accountType: '',
    bankId: '',
    creditCardId: '',
    digitalWalletId: '',
    accountNumber: '',
    currentBalance: '',
    description: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (account && isOpen) {
      setFormData({
        name: account.name || '',
        accountType: account.accountType || '',
        bankId: account.bankId || '',
        creditCardId: account.creditCardId || '',
        digitalWalletId: account.digitalWalletId || '',
        accountNumber: account.accountNumber || '',
        currentBalance: account.currentBalance?.toString() || '',
        description: account.description || '',
        isActive: account.isActive !== false
      });
    } else if (isOpen) {
      setFormData({
        name: '',
        accountType: '',
        bankId: '',
        creditCardId: '',
        digitalWalletId: '',
        accountNumber: '',
        currentBalance: '',
        description: '',
        isActive: true
      });
    }
  }, [account, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accountData = {
        ...formData,
        currentBalance: parseFloat(formData.currentBalance) || 0,
        id: account?.id || Date.now()
      };

      onSave(accountData);
      toast.success(`Account ${account ? 'updated' : 'added'} successfully!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${account ? 'update' : 'add'} account`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!account || !onDelete) return;
    
    setLoading(true);
    try {
      onDelete(account.id);
      toast.success('Account deleted successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const getAccountTypeOptionsForSelection = () => {
    if (formData.bankId) {
      return getAccountTypeOptions(formData.bankId);
    }
    return accountTypes;
  };

  const getInstitutionOptions = () => {
    switch (formData.accountType) {
      case 'credit-card':
        return creditCards;
      case 'digital-wallet':
        return digitalWallets;
      default:
        return philippineBanks;
    }
  };

  const getInstitutionFieldName = () => {
    switch (formData.accountType) {
      case 'credit-card':
        return 'creditCardId';
      case 'digital-wallet':
        return 'digitalWalletId';
      default:
        return 'bankId';
    }
  };

  const getSelectedInstitution = () => {
    switch (formData.accountType) {
      case 'credit-card':
        return getCreditCardById(formData.creditCardId);
      case 'digital-wallet':
        return getDigitalWalletById(formData.digitalWalletId);
      default:
        return getBankById(formData.bankId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="liquid-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-display text-2xl font-semibold text-white flex items-center gap-2">
            {account ? <FiEdit3 size={24} /> : <FiPlus size={24} />}
            {account ? 'Edit Account' : 'Add New Account'}
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
              <label htmlFor="name" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Account Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                placeholder="e.g., My BPI Savings"
              />
            </div>
            
            <div>
              <label htmlFor="accountType" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Account Type
              </label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
                required
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
              >
                <option value="">Select account type</option>
                {getAccountTypeOptionsForSelection().map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.accountType && (
            <div>
              <label htmlFor={getInstitutionFieldName()} className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                {formData.accountType === 'credit-card' ? 'Credit Card' : 
                 formData.accountType === 'digital-wallet' ? 'Digital Wallet' : 'Bank'}
              </label>
              <select
                id={getInstitutionFieldName()}
                name={getInstitutionFieldName()}
                value={formData[getInstitutionFieldName() as keyof typeof formData] as string}
                onChange={handleChange}
                required
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
              >
                <option value="">Select {formData.accountType === 'credit-card' ? 'credit card' : 
                                   formData.accountType === 'digital-wallet' ? 'digital wallet' : 'bank'}</option>
                {getInstitutionOptions().map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.icon} {institution.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="accountNumber" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                placeholder="Enter account number"
              />
            </div>
            
            <div>
              <label htmlFor="currentBalance" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
                Current Balance (₱)
              </label>
              <input
                type="number"
                id="currentBalance"
                name="currentBalance"
                value={formData.currentBalance}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="liquid-input w-full px-6 py-4 focus:outline-none text-lg resize-none"
              placeholder="Add any additional notes about this account..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded border-2 border-white/30 bg-transparent checked:bg-blue-500"
            />
            <label htmlFor="isActive" className="text-white/80 cursor-pointer">
              Account is active
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 liquid-button text-white py-4 px-6 font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : account ? "Update Account" : "Add Account"}
            </button>
            
            {account && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="px-6 py-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiTrash2 size={20} />
                Delete
              </button>
            )}
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
                Are you sure you want to delete this account? This action cannot be undone.
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

export default AccountModal;

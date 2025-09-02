// Philippine Banks, Credit Cards, and Digital Wallets

export interface AccountType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Bank {
  id: string;
  name: string;
  type: 'traditional' | 'digital' | 'rural';
  icon: string;
  color: string;
  accountTypes: string[];
}

export interface CreditCard {
  id: string;
  name: string;
  bank: string;
  icon: string;
  color: string;
}

export interface DigitalWallet {
  id: string;
  name: string;
  type: 'e-wallet' | 'neobank' | 'fintech';
  icon: string;
  color: string;
}

export const accountTypes: AccountType[] = [
  { id: 'savings', name: 'Savings Account', icon: '🏦', color: 'from-blue-500 to-blue-600' },
  { id: 'checking', name: 'Checking Account', icon: '💳', color: 'from-green-500 to-green-600' },
  { id: 'time-deposit', name: 'Time Deposit', icon: '⏰', color: 'from-purple-500 to-purple-600' },
  { id: 'credit-card', name: 'Credit Card', icon: '💳', color: 'from-red-500 to-red-600' },
  { id: 'digital-wallet', name: 'Digital Wallet', icon: '📱', color: 'from-cyan-500 to-cyan-600' },
  { id: 'investment', name: 'Investment Account', icon: '📈', color: 'from-yellow-500 to-yellow-600' },
];

export const philippineBanks: Bank[] = [
  // Traditional Banks
  {
    id: 'bpi',
    name: 'Bank of the Philippine Islands (BPI)',
    type: 'traditional',
    icon: '🏦',
    color: 'from-red-500 to-red-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'bdo',
    name: 'BDO Unibank',
    type: 'traditional',
    icon: '🏦',
    color: 'from-blue-500 to-blue-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'metrobank',
    name: 'Metropolitan Bank & Trust Company',
    type: 'traditional',
    icon: '🏦',
    color: 'from-orange-500 to-orange-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'security-bank',
    name: 'Security Bank',
    type: 'traditional',
    icon: '🏦',
    color: 'from-indigo-500 to-indigo-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'eastwest',
    name: 'EastWest Bank',
    type: 'traditional',
    icon: '🏦',
    color: 'from-pink-500 to-pink-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'chinabank',
    name: 'China Banking Corporation',
    type: 'traditional',
    icon: '🏦',
    color: 'from-yellow-500 to-yellow-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'psbank',
    name: 'Philippine Savings Bank (PSBank)',
    type: 'traditional',
    icon: '🏦',
    color: 'from-teal-500 to-teal-600',
    accountTypes: ['savings', 'checking', 'time-deposit']
  },
  {
    id: 'rcbc',
    name: 'Rizal Commercial Banking Corporation (RCBC)',
    type: 'traditional',
    icon: '🏦',
    color: 'from-emerald-500 to-emerald-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'unionbank',
    name: 'Union Bank of the Philippines',
    type: 'traditional',
    icon: '🏦',
    color: 'from-violet-500 to-violet-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'landbank',
    name: 'Land Bank of the Philippines',
    type: 'traditional',
    icon: '🏦',
    color: 'from-green-600 to-green-700',
    accountTypes: ['savings', 'checking', 'time-deposit']
  },
  {
    id: 'dbs',
    name: 'DBS Bank Philippines',
    type: 'traditional',
    icon: '🏦',
    color: 'from-red-600 to-red-700',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },
  {
    id: 'hsbc',
    name: 'HSBC Philippines',
    type: 'traditional',
    icon: '🏦',
    color: 'from-red-500 to-red-600',
    accountTypes: ['savings', 'checking', 'time-deposit', 'credit-card']
  },

  // Digital Banks
  {
    id: 'seabank',
    name: 'SeaBank Philippines',
    type: 'digital',
    icon: '🌊',
    color: 'from-blue-400 to-blue-500',
    accountTypes: ['savings', 'digital-wallet']
  },
  {
    id: 'gotyme',
    name: 'GoTyme Bank',
    type: 'digital',
    icon: '⏰',
    color: 'from-purple-400 to-purple-500',
    accountTypes: ['savings', 'digital-wallet']
  },
  {
    id: 'maya',
    name: 'Maya Bank',
    type: 'digital',
    icon: '💜',
    color: 'from-purple-500 to-purple-600',
    accountTypes: ['savings', 'digital-wallet']
  },
  {
    id: 'tonik',
    name: 'Tonik Bank',
    type: 'digital',
    icon: '💎',
    color: 'from-cyan-400 to-cyan-500',
    accountTypes: ['savings', 'digital-wallet']
  },
  {
    id: 'uno',
    name: 'UNO Digital Bank',
    type: 'digital',
    icon: '🔵',
    color: 'from-blue-500 to-blue-600',
    accountTypes: ['savings', 'digital-wallet']
  },
  {
    id: 'diskartech',
    name: 'DiskarTech',
    type: 'digital',
    icon: '💙',
    color: 'from-blue-600 to-blue-700',
    accountTypes: ['savings', 'digital-wallet']
  },

  // Rural Banks
  {
    id: 'rural-bank',
    name: 'Rural Bank',
    type: 'rural',
    icon: '🏘️',
    color: 'from-green-500 to-green-600',
    accountTypes: ['savings', 'checking']
  }
];

export const creditCards: CreditCard[] = [
  { id: 'bpi-cc', name: 'BPI Credit Card', bank: 'BPI', icon: '💳', color: 'from-red-500 to-red-600' },
  { id: 'bdo-cc', name: 'BDO Credit Card', bank: 'BDO', icon: '💳', color: 'from-blue-500 to-blue-600' },
  { id: 'metrobank-cc', name: 'Metrobank Credit Card', bank: 'Metrobank', icon: '💳', color: 'from-orange-500 to-orange-600' },
  { id: 'security-bank-cc', name: 'Security Bank Credit Card', bank: 'Security Bank', icon: '💳', color: 'from-indigo-500 to-indigo-600' },
  { id: 'eastwest-cc', name: 'EastWest Credit Card', bank: 'EastWest', icon: '💳', color: 'from-pink-500 to-pink-600' },
  { id: 'rcbc-cc', name: 'RCBC Credit Card', bank: 'RCBC', icon: '💳', color: 'from-emerald-500 to-emerald-600' },
  { id: 'unionbank-cc', name: 'UnionBank Credit Card', bank: 'UnionBank', icon: '💳', color: 'from-violet-500 to-violet-600' },
  { id: 'hsbc-cc', name: 'HSBC Credit Card', bank: 'HSBC', icon: '💳', color: 'from-red-500 to-red-600' },
  { id: 'citi-cc', name: 'Citi Credit Card', bank: 'Citi', icon: '💳', color: 'from-blue-600 to-blue-700' },
  { id: 'amex-cc', name: 'American Express', bank: 'Amex', icon: '💳', color: 'from-green-600 to-green-700' },
];

export const digitalWallets: DigitalWallet[] = [
  { id: 'gcash', name: 'GCash', type: 'e-wallet', icon: '📱', color: 'from-blue-500 to-blue-600' },
  { id: 'paymaya', name: 'PayMaya', type: 'e-wallet', icon: '💜', color: 'from-purple-500 to-purple-600' },
  { id: 'grabpay', name: 'GrabPay', type: 'e-wallet', icon: '🚗', color: 'from-green-500 to-green-600' },
  { id: 'coins', name: 'Coins.ph', type: 'e-wallet', icon: '🪙', color: 'from-yellow-500 to-yellow-600' },
  { id: 'paymongo', name: 'PayMongo', type: 'fintech', icon: '💳', color: 'from-indigo-500 to-indigo-600' },
  { id: 'dragonpay', name: 'DragonPay', type: 'fintech', icon: '🐉', color: 'from-red-500 to-red-600' },
  { id: 'paynamics', name: 'Paynamics', type: 'fintech', icon: '💎', color: 'from-cyan-500 to-cyan-600' },
  { id: 'bux', name: 'BUX', type: 'e-wallet', icon: '📦', color: 'from-orange-500 to-orange-600' },
  { id: 'shopee-pay', name: 'ShopeePay', type: 'e-wallet', icon: '🛒', color: 'from-orange-400 to-orange-500' },
  { id: 'lazada-wallet', name: 'Lazada Wallet', type: 'e-wallet', icon: '🛍️', color: 'from-red-400 to-red-500' },
];

// Helper functions
export const getAllBanks = () => philippineBanks;
export const getTraditionalBanks = () => philippineBanks.filter(bank => bank.type === 'traditional');
export const getDigitalBanks = () => philippineBanks.filter(bank => bank.type === 'digital');
export const getRuralBanks = () => philippineBanks.filter(bank => bank.type === 'rural');
export const getAllCreditCards = () => creditCards;
export const getAllDigitalWallets = () => digitalWallets;

export const getBankById = (id: string) => philippineBanks.find(bank => bank.id === id);
export const getCreditCardById = (id: string) => creditCards.find(cc => cc.id === id);
export const getDigitalWalletById = (id: string) => digitalWallets.find(wallet => wallet.id === id);
export const getAccountTypeById = (id: string) => accountTypes.find(type => type.id === id);

export const getAccountTypeOptions = (bankId?: string) => {
  if (!bankId) return accountTypes;
  
  const bank = getBankById(bankId);
  if (!bank) return accountTypes;
  
  return accountTypes.filter(type => bank.accountTypes.includes(type.id));
};

// Utility function to update account balance based on transactions
export const updateAccountBalance = async (accountId: string, transactionType: 'income' | 'expense', amount: number, action: 'add' | 'update' | 'delete', previousAmount?: number) => {
  try {
    // Get current accounts
    const savedAccounts = localStorage.getItem('userAccounts');
    if (!savedAccounts) return;
    
    const accounts = JSON.parse(savedAccounts);
    const accountIndex = accounts.findIndex((acc: any) => acc.id.toString() === accountId);
    
    if (accountIndex === -1) return;
    
    const account = accounts[accountIndex];
    let balanceChange = 0;
    
    switch (action) {
      case 'add':
        balanceChange = transactionType === 'income' ? amount : -amount;
        break;
      case 'update':
        if (previousAmount !== undefined) {
          // Remove the old amount and add the new amount
          const oldBalanceChange = transactionType === 'income' ? previousAmount : -previousAmount;
          const newBalanceChange = transactionType === 'income' ? amount : -amount;
          balanceChange = newBalanceChange - oldBalanceChange;
        }
        break;
      case 'delete':
        balanceChange = transactionType === 'income' ? -amount : amount; // Reverse the transaction
        break;
    }
    
    // Update the account balance
    accounts[accountIndex].currentBalance = (account.currentBalance || 0) + balanceChange;
    
    // Save updated accounts
    localStorage.setItem('userAccounts', JSON.stringify(accounts));
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('accountsUpdated', { detail: accounts }));
    
    // Try to update via API as well
    try {
      const { ApiClient } = await import('./api');
      await ApiClient.updateAccount(account.id, { currentBalance: accounts[accountIndex].currentBalance });
    } catch (error) {
      // API update failed, changes saved locally only
    }
    
    return accounts[accountIndex];
  } catch (error) {
    // Error updating account balance
  }
};

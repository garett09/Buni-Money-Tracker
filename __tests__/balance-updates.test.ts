import { updateAccountBalance } from '@/app/lib/accounts';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.dispatchEvent
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn()
});

describe('Account Balance Updates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify([
      {
        id: 1,
        name: 'Test Account',
        currentBalance: 1000,
        accountType: 'savings'
      }
    ]));
  });

  test('should add income to account balance', async () => {
    await updateAccountBalance('1', 'income', 500, 'add');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'userAccounts',
      JSON.stringify([
        {
          id: 1,
          name: 'Test Account',
          currentBalance: 1500, // 1000 + 500
          accountType: 'savings'
        }
      ])
    );
  });

  test('should subtract expense from account balance', async () => {
    await updateAccountBalance('1', 'expense', 300, 'add');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'userAccounts',
      JSON.stringify([
        {
          id: 1,
          name: 'Test Account',
          currentBalance: 700, // 1000 - 300
          accountType: 'savings'
        }
      ])
    );
  });

  test('should update balance when transaction is modified', async () => {
    await updateAccountBalance('1', 'income', 600, 'update', 500);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'userAccounts',
      JSON.stringify([
        {
          id: 1,
          name: 'Test Account',
          currentBalance: 1100, // 1000 + (600 - 500)
          accountType: 'savings'
        }
      ])
    );
  });

  test('should reverse transaction when deleted', async () => {
    await updateAccountBalance('1', 'income', 500, 'delete');
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'userAccounts',
      JSON.stringify([
        {
          id: 1,
          name: 'Test Account',
          currentBalance: 500, // 1000 - 500
          accountType: 'savings'
        }
      ])
    );
  });

  test('should handle account not found gracefully', async () => {
    const result = await updateAccountBalance('999', 'income', 500, 'add');
    
    expect(result).toBeUndefined();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  test('should handle missing localStorage data gracefully', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const result = await updateAccountBalance('1', 'income', 500, 'add');
    
    expect(result).toBeUndefined();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});

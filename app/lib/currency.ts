/**
 * Currency utility functions for Philippine Peso (₱)
 */

/**
 * Format a number as Philippine Peso with proper formatting
 * @param amount - The amount to format
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted currency string
 */
export const formatPHP = (
  amount: number, 
  options: Intl.NumberFormatOptions = {}
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  };

  return new Intl.NumberFormat('en-PH', defaultOptions).format(amount);
};

/**
 * Format a number as Philippine Peso with the ₱ symbol
 * @param amount - The amount to format
 * @param showDecimals - Whether to show decimal places
 * @returns Formatted currency string with ₱ symbol
 */
export const formatPeso = (amount: number, showDecimals: boolean = false): string => {
  if (showDecimals) {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₱${amount.toLocaleString('en-PH')}`;
};

/**
 * Format a number as Philippine Peso with compact notation (K, M, B)
 * @param amount - The amount to format
 * @returns Formatted currency string with compact notation
 */
export const formatPesoCompact = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    notation: 'compact',
    maximumFractionDigits: 1
  });
  
  return formatter.format(amount);
};

/**
 * Parse a Philippine Peso string back to a number
 * @param pesoString - The formatted peso string (e.g., "₱1,234.56")
 * @returns The parsed number
 */
export const parsePeso = (pesoString: string): number => {
  // Remove ₱ symbol and commas, then parse
  const cleanString = pesoString.replace(/[₱,]/g, '');
  const parsed = parseFloat(cleanString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get the default monthly budget for Philippine Peso
 * @returns Default monthly budget in PHP
 */
export const getDefaultMonthlyBudget = (): number => {
  // Get user's saved budget or use a reasonable default
  if (typeof window !== 'undefined') {
    const savedBudget = localStorage.getItem('userMonthlyBudget');
    if (savedBudget) {
      return parseFloat(savedBudget);
    }
  }
  return 30000; // ₱30,000 as a more reasonable starting point
};

/**
 * Set the user's monthly budget
 * @param amount - The monthly budget amount in PHP
 */
export const setUserMonthlyBudget = (amount: number): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userMonthlyBudget', amount.toString());
  }
};

/**
 * Get the user's current monthly budget
 * @returns Current monthly budget in PHP
 */
export const getUserMonthlyBudget = (): number => {
  return getDefaultMonthlyBudget();
};

/**
 * Validate if an amount is within reasonable Philippine Peso ranges
 * @param amount - The amount to validate
 * @returns Whether the amount is valid
 */
export const isValidPesoAmount = (amount: number): boolean => {
  return amount >= 0 && amount <= 1000000000; // ₱0 to ₱1B
};

/**
 * Round amount to nearest peso (no decimals)
 * @param amount - The amount to round
 * @returns Rounded amount
 */
export const roundToPeso = (amount: number): number => {
  return Math.round(amount);
};

/**
 * Round amount to nearest centavo (2 decimal places)
 * @param amount - The amount to round
 * @returns Rounded amount
 */
export const roundToCentavo = (amount: number): number => {
  return Math.round(amount * 100) / 100;
};

import moment from "moment";

// Format currency
export const formatCurrency = (amount, currency = "₱") => {
  return `${currency}${parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Format date
export const formatDate = (date, format = "MMM DD, YYYY") => {
  return moment(date).format(format);
};

// Format date for input
export const formatDateForInput = (date) => {
  return moment(date).format("YYYY-MM-DD");
};

// Get current month range
export const getCurrentMonthRange = () => {
  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment().endOf("month");
  
  return {
    startDate: startOfMonth.format("YYYY-MM-DD"),
    endDate: endOfMonth.format("YYYY-MM-DD"),
  };
};

// Get last 30 days range
export const getLast30DaysRange = () => {
  const endDate = moment();
  const startDate = moment().subtract(30, "days");
  
  return {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
  };
};

// Get last 7 days range
export const getLast7DaysRange = () => {
  const endDate = moment();
  const startDate = moment().subtract(7, "days");
  
  return {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: endDate.format("YYYY-MM-DD"),
  };
};

// Validate email
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const minLength = 6;
  return password.length >= minLength;
};

// Generate random color for charts
export const generateRandomColor = () => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
    "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get category icon
export const getCategoryIcon = (category) => {
  const icons = {
    food: "🍕",
    transportation: "🚗",
    entertainment: "🎬",
    shopping: "🛍️",
    health: "💊",
    education: "📚",
    bills: "📄",
    salary: "💰",
    freelance: "💼",
    investment: "📈",
    gift: "🎁",
    other: "📌"
  };
  
  return icons[category.toLowerCase()] || icons.other;
};

// Get payment method icon
export const getPaymentMethodIcon = (method) => {
  const icons = {
    cash: "💵",
    card: "💳",
    bank_transfer: "🏦",
    digital_wallet: "📱",
    other: "💳"
  };
  
  return icons[method] || icons.other;
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
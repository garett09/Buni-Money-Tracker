// Default categories for transactions
export const DEFAULT_CATEGORIES = {
  income: [
    "Salary",
    "Freelance",
    "Investment",
    "Business",
    "Gift",
    "Bonus",
    "Other"
  ],
  expense: [
    "Food",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Health",
    "Education",
    "Bills",
    "Housing",
    "Utilities",
    "Insurance",
    "Other"
  ]
};

// Payment methods
export const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: "💵" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "bank_transfer", label: "Bank Transfer", icon: "🏦" },
  { value: "digital_wallet", label: "Digital Wallet", icon: "📱" },
  { value: "other", label: "Other", icon: "💳" }
];

// Recurring intervals
export const RECURRING_INTERVALS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" }
];

// Chart colors
export const CHART_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
  "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2"
];

// Navigation menu items
export const NAVIGATION_ITEMS = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "📊"
  },
  {
    path: "/dashboard/income",
    label: "Income",
    icon: "💰"
  },
  {
    path: "/dashboard/expense",
    label: "Expenses",
    icon: "💸"
  },
  {
    path: "/dashboard/profile",
    label: "Profile",
    icon: "👤"
  }
];

// Date range options
export const DATE_RANGE_OPTIONS = [
  { value: "7days", label: "Last 7 Days" },
  { value: "30days", label: "Last 30 Days" },
  { value: "month", label: "This Month" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" }
];
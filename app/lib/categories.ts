// Comprehensive spending and income categories based on real-world financial data

export const expenseCategories = [
  {
    id: 'housing',
    name: 'Housing & Utilities',
    icon: '🏠',
    subcategories: [
      { name: 'Rent/Mortgage', avgPercentage: 30, description: 'Monthly housing payments' },
      { name: 'Electricity', avgPercentage: 3, description: 'Electric bills' },
      { name: 'Water & Sewer', avgPercentage: 1, description: 'Water utility bills' },
      { name: 'Internet & Phone', avgPercentage: 2, description: 'Communication services' },
      { name: 'Home Insurance', avgPercentage: 1, description: 'Property insurance' },
      { name: 'Property Tax', avgPercentage: 2, description: 'Annual property taxes' },
      { name: 'Home Maintenance', avgPercentage: 2, description: 'Repairs and upkeep' }
    ],
    color: 'from-blue-500 to-cyan-600',
    avgPercentage: 41
  },
  {
    id: 'food',
    name: 'Food & Dining',
    icon: '🍽️',
    subcategories: [
      { name: 'Groceries', avgPercentage: 8, description: 'Supermarket shopping' },
      { name: 'Restaurants', avgPercentage: 4, description: 'Dining out' },
      { name: 'Coffee & Snacks', avgPercentage: 2, description: 'Daily coffee and treats' },
      { name: 'Food Delivery', avgPercentage: 3, description: 'Takeout and delivery' },
      { name: 'Work Lunch', avgPercentage: 2, description: 'Office meals' }
    ],
    color: 'from-green-500 to-emerald-600',
    avgPercentage: 19
  },
  {
    id: 'transportation',
    name: 'Transportation',
    icon: '🚗',
    subcategories: [
      { name: 'Gas/Fuel', avgPercentage: 4, description: 'Vehicle fuel costs' },
      { name: 'Car Payment', avgPercentage: 6, description: 'Auto loan payments' },
      { name: 'Car Insurance', avgPercentage: 2, description: 'Vehicle insurance' },
      { name: 'Public Transit', avgPercentage: 2, description: 'Bus, train, metro' },
      { name: 'Rideshare/Taxi', avgPercentage: 2, description: 'Uber, Lyft, taxis' },
      { name: 'Car Maintenance', avgPercentage: 2, description: 'Oil changes, repairs' },
      { name: 'Parking', avgPercentage: 1, description: 'Parking fees' }
    ],
    color: 'from-orange-500 to-red-600',
    avgPercentage: 19
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    subcategories: [
      { name: 'Health Insurance', avgPercentage: 3, description: 'Medical insurance' },
      { name: 'Doctor Visits', avgPercentage: 2, description: 'Medical appointments' },
      { name: 'Prescriptions', avgPercentage: 1, description: 'Medications' },
      { name: 'Dental', avgPercentage: 1, description: 'Dental care' },
      { name: 'Vision', avgPercentage: 1, description: 'Eye care' },
      { name: 'Gym/Fitness', avgPercentage: 2, description: 'Health and fitness' }
    ],
    color: 'from-red-500 to-pink-600',
    avgPercentage: 10
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    subcategories: [
      { name: 'Streaming Services', avgPercentage: 1, description: 'Netflix, Spotify, etc.' },
      { name: 'Movies & Shows', avgPercentage: 1, description: 'Cinema tickets' },
      { name: 'Games & Apps', avgPercentage: 1, description: 'Gaming and mobile apps' },
      { name: 'Concerts & Events', avgPercentage: 2, description: 'Live entertainment' },
      { name: 'Hobbies', avgPercentage: 2, description: 'Personal interests' },
      { name: 'Books & Media', avgPercentage: 1, description: 'Reading materials' }
    ],
    color: 'from-purple-500 to-violet-600',
    avgPercentage: 8
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: '🛍️',
    subcategories: [
      { name: 'Clothing', avgPercentage: 3, description: 'Apparel and accessories' },
      { name: 'Electronics', avgPercentage: 2, description: 'Gadgets and tech' },
      { name: 'Home Goods', avgPercentage: 2, description: 'Furniture and decor' },
      { name: 'Personal Care', avgPercentage: 2, description: 'Beauty and hygiene' },
      { name: 'Gifts', avgPercentage: 2, description: 'Presents for others' },
      { name: 'Online Shopping', avgPercentage: 3, description: 'E-commerce purchases' }
    ],
    color: 'from-pink-500 to-rose-600',
    avgPercentage: 14
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    subcategories: [
      { name: 'Tuition', avgPercentage: 5, description: 'School fees' },
      { name: 'Books & Supplies', avgPercentage: 1, description: 'Educational materials' },
      { name: 'Online Courses', avgPercentage: 1, description: 'Digital learning' },
      { name: 'Certifications', avgPercentage: 1, description: 'Professional development' }
    ],
    color: 'from-indigo-500 to-blue-600',
    avgPercentage: 8
  },
  {
    id: 'savings',
    name: 'Savings & Investments',
    icon: '💰',
    subcategories: [
      { name: 'Emergency Fund', avgPercentage: 5, description: 'Rainy day savings' },
      { name: 'Retirement', avgPercentage: 10, description: '401k, IRA contributions' },
      { name: 'Investment', avgPercentage: 5, description: 'Stocks, bonds, crypto' },
      { name: 'Vacation Fund', avgPercentage: 2, description: 'Travel savings' }
    ],
    color: 'from-yellow-500 to-orange-600',
    avgPercentage: 22
  },
  {
    id: 'debt',
    name: 'Debt Payments',
    icon: '💳',
    subcategories: [
      { name: 'Credit Cards', avgPercentage: 3, description: 'Credit card payments' },
      { name: 'Student Loans', avgPercentage: 4, description: 'Education debt' },
      { name: 'Personal Loans', avgPercentage: 2, description: 'Other loans' },
      { name: 'Medical Debt', avgPercentage: 1, description: 'Healthcare bills' }
    ],
    color: 'from-gray-500 to-slate-600',
    avgPercentage: 10
  },
  {
    id: 'other',
    name: 'Other Expenses',
    icon: '📋',
    subcategories: [
      { name: 'Insurance', avgPercentage: 2, description: 'Life, disability insurance' },
      { name: 'Taxes', avgPercentage: 3, description: 'Income and other taxes' },
      { name: 'Charity', avgPercentage: 2, description: 'Donations and giving' },
      { name: 'Pet Care', avgPercentage: 1, description: 'Veterinary and pet supplies' },
      { name: 'Childcare', avgPercentage: 3, description: 'Babysitting and daycare' },
      { name: 'Miscellaneous', avgPercentage: 2, description: 'Other expenses' }
    ],
    color: 'from-slate-500 to-gray-600',
    avgPercentage: 13
  }
];

export const incomeCategories = [
  {
    id: 'salary',
    name: 'Salary & Wages',
    icon: '💼',
    subcategories: [
      { name: 'Primary Job', avgPercentage: 70, description: 'Main employment income' },
      { name: 'Part-time Job', avgPercentage: 15, description: 'Secondary employment' },
      { name: 'Overtime', avgPercentage: 5, description: 'Extra hours pay' },
      { name: 'Bonuses', avgPercentage: 10, description: 'Performance bonuses' }
    ],
    color: 'from-green-500 to-emerald-600',
    avgPercentage: 70
  },
  {
    id: 'freelance',
    name: 'Freelance & Contract',
    icon: '🖥️',
    subcategories: [
      { name: 'Web Development', avgPercentage: 30, description: 'Programming projects' },
      { name: 'Design Work', avgPercentage: 25, description: 'Graphic and UI design' },
      { name: 'Writing', avgPercentage: 20, description: 'Content creation' },
      { name: 'Consulting', avgPercentage: 15, description: 'Business consulting' },
      { name: 'Other Services', avgPercentage: 10, description: 'Various freelance work' }
    ],
    color: 'from-blue-500 to-cyan-600',
    avgPercentage: 15
  },
  {
    id: 'investment',
    name: 'Investment Income',
    icon: '📈',
    subcategories: [
      { name: 'Dividends', avgPercentage: 40, description: 'Stock dividends' },
      { name: 'Interest', avgPercentage: 20, description: 'Savings account interest' },
      { name: 'Capital Gains', avgPercentage: 25, description: 'Investment profits' },
      { name: 'Rental Income', avgPercentage: 15, description: 'Property rental' }
    ],
    color: 'from-purple-500 to-violet-600',
    avgPercentage: 8
  },
  {
    id: 'business',
    name: 'Business Income',
    icon: '🏢',
    subcategories: [
      { name: 'Sales Revenue', avgPercentage: 60, description: 'Product sales' },
      { name: 'Service Revenue', avgPercentage: 30, description: 'Service fees' },
      { name: 'Commission', avgPercentage: 10, description: 'Sales commissions' }
    ],
    color: 'from-orange-500 to-red-600',
    avgPercentage: 5
  },
  {
    id: 'other',
    name: 'Other Income',
    icon: '🎁',
    subcategories: [
      { name: 'Gifts', avgPercentage: 30, description: 'Monetary gifts' },
      { name: 'Tax Refunds', avgPercentage: 25, description: 'Government refunds' },
      { name: 'Side Hustles', avgPercentage: 25, description: 'Various side income' },
      { name: 'Cashback', avgPercentage: 10, description: 'Credit card rewards' },
      { name: 'Lottery/Winnings', avgPercentage: 10, description: 'Unexpected windfalls' }
    ],
    color: 'from-pink-500 to-rose-600',
    avgPercentage: 2
  }
];

// Spending insights based on financial research
export const spendingInsights = {
  averageMonthlyExpenses: {
    '18-25': { total: 2500, housing: 1000, food: 400, transport: 300, entertainment: 200 },
    '26-35': { total: 4000, housing: 1600, food: 600, transport: 500, entertainment: 300 },
    '36-45': { total: 5500, housing: 2200, food: 800, transport: 600, entertainment: 400 },
    '46-55': { total: 6000, housing: 2400, food: 900, transport: 700, entertainment: 500 },
    '56+': { total: 4500, housing: 1800, food: 700, transport: 400, entertainment: 300 }
  },
  recommendedPercentages: {
    housing: 30,
    food: 15,
    transport: 15,
    healthcare: 10,
    entertainment: 10,
    savings: 20
  },
  commonMistakes: [
    'Not tracking small daily expenses',
    'Overspending on dining out',
    'Ignoring subscription services',
    'Not budgeting for irregular expenses',
    'Impulse buying without planning'
  ],
  moneySavingTips: [
    'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
    'Track every expense for at least 30 days',
    'Set up automatic savings transfers',
    'Review and cancel unused subscriptions',
    'Cook at home more often',
    'Use cashback credit cards wisely',
    'Shop with a list to avoid impulse purchases'
  ]
};

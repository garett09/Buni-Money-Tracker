import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiPlus,
  FiTrash2,
  FiCalendar
} from "react-icons/fi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { dashboardAPI, transactionAPI } from "../../utils/apiPaths";

const Home = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: [],
    monthlyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const response = await dashboardAPI.getStats();
      console.log('Dashboard data received:', response.data);
      setStats(response.data);
    } catch (error) {
      console.error('Dashboard data error:', error);
      toast.error("Failed to load dashboard data");
      // Set default empty stats to prevent blank screen
      setStats({
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        recentTransactions: [],
        monthlyData: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionAPI.deleteTransaction(id);
        toast.success("Transaction deleted successfully");
        fetchDashboardData(); // Refresh data
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Prepare chart data
  const chartData = stats.monthlyData && stats.monthlyData.length > 0 
    ? stats.monthlyData.map(item => ({
        month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
        income: item._id.type === 'income' ? item.total : 0,
        expense: item._id.type === 'expense' ? item.total : 0
      }))
    : [];

  const pieData = [
    { name: 'Income', value: stats.totalIncome, color: '#10B981' },
    { name: 'Expenses', value: stats.totalExpenses, color: '#EF4444' }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/30"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="glass-card rounded-2xl p-8 text-white ios-fade-in">
          <h1 className="text-display text-3xl font-bold mb-3">Welcome back!</h1>
          <p className="text-body text-white/80">Here's your financial overview for today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-2xl p-6 ios-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-sm font-medium text-white/70 mb-1">Total Income</p>
                <p className="text-display text-2xl font-bold text-green-400">{formatCurrency(stats.totalIncome)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <FiTrendingUp className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 ios-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-sm font-medium text-white/70 mb-1">Total Expenses</p>
                <p className="text-display text-2xl font-bold text-red-400">{formatCurrency(stats.totalExpenses)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <FiTrendingDown className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 ios-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-sm font-medium text-white/70 mb-1">Balance</p>
                <p className={`text-display text-2xl font-bold ${stats.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FiDollarSign className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/dashboard/income"
            className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 ios-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                <FiPlus className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-display text-lg font-semibold text-white">Add Income</h3>
                <p className="text-body text-sm text-white/70">Record a new income transaction</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/expense"
            className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 ios-slide-up"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                <FiPlus className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-display text-lg font-semibold text-white">Add Expense</h3>
                <p className="text-body text-sm text-white/70">Record a new expense transaction</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="glass-card rounded-2xl p-6 ios-slide-up" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-display text-lg font-semibold text-white mb-4">Monthly Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.7)" />
                  <YAxis stroke="rgba(255,255,255,0.7)" />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#34C759" strokeWidth={3} />
                  <Line type="monotone" dataKey="expense" stroke="#FF3B30" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="glass-card rounded-2xl p-6 ios-slide-up" style={{ animationDelay: '0.7s' }}>
            <h3 className="text-display text-lg font-semibold text-white mb-4">Income vs Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-2xl ios-slide-up" style={{ animationDelay: '0.8s' }}>
          <div className="p-6 border-b border-white/20">
            <h3 className="text-display text-lg font-semibold text-white">Recent Transactions</h3>
          </div>
          <div className="p-6">
            {stats.recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <FiCalendar className="mx-auto text-white/40 mb-4" size={48} />
                <p className="text-body text-white/70">No transactions yet</p>
                <p className="text-body text-sm text-white/50">Start by adding your first income or expense</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 glass rounded-xl"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 ${
                          transaction.type === 'income'
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-red-500 to-pink-600'
                        }`}
                      >
                        {transaction.type === 'income' ? (
                          <FiTrendingUp className="text-white" size={20} />
                        ) : (
                          <FiTrendingDown className="text-white" size={20} />
                        )}
                      </div>
                      <div>
                        <p className="text-body font-medium text-white">{transaction.description}</p>
                        <p className="text-body text-sm text-white/70">{transaction.category}</p>
                        <p className="text-body text-xs text-white/50">{formatDate(transaction.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`text-display font-semibold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(transaction._id)}
                        className="text-white/40 hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-lg"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  FiHome, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiTarget,
  FiUsers,
  FiCreditCard,
  FiLogOut, 
  FiUser,
  FiMenu,
  FiX,
  FiClock,
  FiList,
  FiDatabase,
  FiSettings,
  FiBell,
  FiSearch,
  FiPlus,
  FiHeart,
  FiStar,
  FiZap,
  FiShield,
  FiBarChart,
  FiPieChart,
  FiDollarSign
} from 'react-icons/fi';
import ThemePicker from './ThemePicker';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    
    // Initialize empty notifications - will be populated by dashboard analytics
    setNotifications([]);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully! 👋');
    router.push('/login');
  };

  // Function to generate intelligent notifications based on user data
  const generateIntelligentNotifications = (analytics: any) => {
    if (!analytics) return [];

    const newNotifications = [];

    // Budget-related notifications
    if (analytics.budgetUsagePercent > 90) {
      newNotifications.push({
        id: Date.now() + 1,
        type: 'warning',
        message: `Budget alert: ${analytics.budgetUsagePercent.toFixed(1)}% of monthly budget used`,
        time: 'Just now',
        priority: 'high'
      });
    } else if (analytics.budgetUsagePercent > 80) {
      newNotifications.push({
        id: Date.now() + 2,
        type: 'info',
        message: `Budget update: ${analytics.budgetUsagePercent.toFixed(1)}% of monthly budget used`,
        time: 'Just now',
        priority: 'medium'
      });
    }

    // Savings-related notifications
    if (analytics.savingsRate > 30) {
      newNotifications.push({
        id: Date.now() + 3,
        type: 'success',
        message: `Great job! You're saving ${analytics.savingsRate.toFixed(1)}% of your income`,
        time: 'Just now',
        priority: 'medium'
      });
    } else if (analytics.savingsRate < 10) {
      newNotifications.push({
        id: Date.now() + 4,
        type: 'warning',
        message: `Consider increasing savings - currently at ${analytics.savingsRate.toFixed(1)}%`,
        time: 'Just now',
        priority: 'medium'
      });
    }

    // Spending velocity notifications
    if (analytics.dailySpending > 0) {
      const monthlyProjection = analytics.dailySpending * 30;
      if (monthlyProjection > analytics.totalExpenses * 1.2) {
        newNotifications.push({
          id: Date.now() + 5,
          type: 'warning',
          message: 'Spending pace suggests higher monthly expenses ahead',
          time: 'Just now',
          priority: 'medium'
        });
      }
    }

    // Unusual spending notifications
    if (analytics.unusualSpending && analytics.unusualSpending.length > 0) {
      newNotifications.push({
        id: Date.now() + 6,
        type: 'info',
        message: `${analytics.unusualSpending.length} unusual transactions detected`,
        time: 'Just now',
        priority: 'low'
      });
    }

    return newNotifications;
  };

  // Function to update notifications from dashboard
  const updateNotifications = (analytics: any) => {
    const newNotifications = generateIntelligentNotifications(analytics);
    setNotifications(newNotifications);
  };

  // Expose updateNotifications function globally so dashboard can call it
  useEffect(() => {
    (window as any).updateDashboardNotifications = updateNotifications;
    
    return () => {
      delete (window as any).updateDashboardNotifications;
    };
  }, []);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && !(event.target as Element).closest('.notifications-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: FiHome,
      description: 'Overview & analytics',
      badge: null
    },
    { 
      name: 'Income', 
      href: '/dashboard/income', 
      icon: FiTrendingUp,
      description: 'Track your earnings',
      badge: null
    },
    { 
      name: 'Expenses', 
      href: '/dashboard/expenses', 
      icon: FiTrendingDown,
      description: 'Monitor spending',
      badge: null
    },
    { 
      name: 'Transaction History', 
      href: '/dashboard/transactions', 
      icon: FiList,
      description: 'All transactions',
      badge: null
    },
    { 
      name: 'Savings Goals', 
      href: '/dashboard/savings', 
      icon: FiTarget,
      description: 'Set & track goals',
      badge: 'New'
    },
    { 
      name: 'My Accounts', 
      href: '/dashboard/accounts', 
      icon: FiCreditCard,
      description: 'Manage accounts',
      badge: null
    },
    { 
      name: 'Shared Expenses', 
      href: '/dashboard/shared', 
      icon: FiUsers,
      description: 'Split expenses',
      badge: null
    },
    { 
      name: 'Data Management', 
      href: '/dashboard/data', 
      icon: FiDatabase,
      description: 'Backup & sync',
      badge: null
    },
  ];

  const quickActions = [
    { name: 'Add Income', icon: FiTrendingUp, href: '/dashboard/income', color: 'from-emerald-500 to-green-600' },
    { name: 'Add Expense', icon: FiTrendingDown, href: '/dashboard/expenses', color: 'from-red-500 to-rose-600' },
    { name: 'Set Goal', icon: FiTarget, href: '/dashboard/savings', color: 'from-purple-500 to-violet-600' },
    { name: 'Add Account', icon: FiCreditCard, href: '/dashboard/accounts', color: 'from-blue-500 to-cyan-600' },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl" 
             style={{ 
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)',
               animationDelay: '0s',
               animationDuration: '4s'
             }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl" 
             style={{ 
               background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)',
               animationDelay: '2s',
               animationDuration: '4s'
             }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl" 
             style={{ 
               background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
               animationDelay: '4s',
               animationDuration: '4s'
             }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 flex">
        {/* Mobile menu button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 liquid-button p-3 rounded-xl backdrop-blur-lg border border-white/10"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Enhanced Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-80 sidebar-glass transform transition-transform duration-300 ease-in-out md:translate-x-0 will-change-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Enhanced Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <FiHeart size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                    Buni Tracker
                  </h2>
                  <p className="text-white/60 text-sm">Financial Freedom</p>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <FiUser size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{user.name || 'User'}</p>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
                <button
                  onClick={() => setShowQuickActions(!showQuickActions)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                >
                  <FiPlus size={16} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <div className="mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
                <h3 className="text-sm font-semibold text-white/80 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group shadow-sm"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 transition-all duration-200 shadow-md`}>
                        <action.icon size={16} className="text-white" />
                      </div>
                      <p className="text-xs font-medium text-white/80">{action.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Navigation */}
            <nav className="flex-1 space-y-4">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative p-4 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? 'nav-item-glass active' 
                        : 'nav-item-glass'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-br from-emerald-500 to-blue-600 shadow-lg' 
                          : 'bg-white/10'
                      }`}>
                        <Icon size={20} className={`transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-white/60'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-white/80'
                          }`}>
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-sm transition-colors duration-300 ${
                          isActive ? 'text-white/80' : 'text-white/40'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 shadow-sm">
                  <FiSettings size={20} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                  Settings
                </span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/20 transition-all duration-300 group shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/30 transition-colors duration-300 shadow-sm">
                  <FiLogOut size={20} className="text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                </div>
                <span className="font-medium text-red-400 group-hover:text-red-300 transition-colors duration-300">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-80">
          {/* Enhanced Top Bar */}
          <header className="sticky top-0 z-30 liquid-card backdrop-blur-lg border-b border-white/10">
            <div className="flex items-center justify-between p-6">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="text"
                    placeholder="Search transactions, goals, accounts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                {/* Theme Picker */}
                <ThemePicker />
                
                {/* Notifications */}
                <div className="relative notifications-container">
                  <button 
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <FiBell size={20} className="text-white/60" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && notifications.length > 0 && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <button
                          onClick={() => setNotifications([])}
                          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="p-2">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-xl mb-2 transition-all duration-200 ${
                              notification.type === 'success' ? 'bg-green-50 border border-green-200' :
                              notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                              notification.type === 'info' ? 'bg-blue-50 border border-blue-200' :
                              'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                notification.type === 'success' ? 'bg-green-500' :
                                notification.type === 'warning' ? 'bg-yellow-500' :
                                notification.type === 'info' ? 'bg-blue-500' :
                                'bg-gray-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${
                                  notification.type === 'success' ? 'text-green-800' :
                                  notification.type === 'warning' ? 'text-yellow-800' :
                                  notification.type === 'info' ? 'text-blue-800' :
                                  'text-gray-800'
                                }`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">{user.name || 'User'}</p>
                    <p className="text-xs text-white/60">Welcome back!</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <FiUser size={20} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;

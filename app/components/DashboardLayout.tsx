'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  FiX
} from 'react-icons/fi';
import ThemePicker from './ThemePicker';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Income', href: '/dashboard/income', icon: FiTrendingUp },
    { name: 'Expenses', href: '/dashboard/expenses', icon: FiTrendingDown },
    { name: 'Savings Goals', href: '/dashboard/savings', icon: FiTarget },
    { name: 'My Accounts', href: '/dashboard/accounts', icon: FiCreditCard },
    { name: 'Shared Expenses', href: '/dashboard/shared', icon: FiUsers },
  ];

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl apple-float" style={{ background: 'var(--theme-bg-gradient-1)', animationDelay: '0s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl apple-float" style={{ background: 'var(--theme-bg-gradient-2)', animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl apple-float" style={{ background: 'var(--theme-bg-gradient-3)', animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 flex">
        {/* Mobile menu button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 liquid-button p-3 rounded-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 liquid-card transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <div className="mb-8">
              <h2 className="text-display text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Buni Tracker</h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User info and logout */}
            <div className="border-t border-white/10 pt-6">
              <div className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FiUser size={20} />
                </div>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl opacity-80 hover:opacity-100 hover:bg-red-500/20 transition-all duration-300 group"
              >
                <FiLogOut size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          {/* Header with theme picker */}
          <div className="liquid-card border-b border-white/10 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
                >
                  <FiMenu size={20} />
                </button>
                <h1 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
              </div>
              <ThemePicker />
            </div>
          </div>
          
          <main className="p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
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

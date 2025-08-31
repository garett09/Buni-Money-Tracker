'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  FiHome, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiLogOut, 
  FiUser,
  FiMenu,
  FiX
} from 'react-icons/fi';

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
  ];

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl apple-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-full blur-3xl apple-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl apple-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 flex">
        {/* Mobile menu button */}
        <button
          className="md:hidden fixed top-4 left-4 z-50 glass-button p-3 rounded-xl"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 glass-card transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <div className="mb-8">
              <h2 className="text-display text-2xl font-semibold text-white">Buni Tracker</h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{item.name}</span>
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
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-red-500/20 transition-all duration-300 group"
              >
                <FiLogOut size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
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

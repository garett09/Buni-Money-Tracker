'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiTarget, 
  FiShield, 
  FiSmartphone,
  FiBarChart,
  FiCreditCard,
  FiHeart,
  FiStar,
  FiArrowRight,
  FiCheck
} from 'react-icons/fi';

export default function HomePage() {
  const features = [
    {
      icon: FiTrendingUp,
      title: 'Income Tracking',
      description: 'Effortlessly track all your income sources with detailed categorization and insights.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: FiTrendingDown,
      title: 'Expense Management',
      description: 'Monitor your spending patterns and identify areas for better financial control.',
      color: 'from-red-500 to-rose-600'
    },
    {
      icon: FiBarChart,
      title: 'Visual Analytics',
      description: 'Beautiful charts and graphs to understand your financial health at a glance.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FiTarget,
      title: 'Goal Setting',
      description: 'Set and track financial goals with progress indicators and milestone celebrations.',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: FiShield,
      title: 'Secure & Private',
      description: 'Your financial data is protected with enterprise-grade security and privacy.',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: FiSmartphone,
      title: 'Mobile Optimized',
      description: 'Access your finances anywhere with our responsive, mobile-first design.',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const benefits = [
    'Real-time financial tracking',
    'Beautiful Apple-inspired design',
    'Secure data storage',
    'Intuitive user interface',
    'Goal setting and tracking',
    'Detailed analytics and insights'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl apple-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-full blur-3xl apple-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl apple-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="apple-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
                <FiHeart className="text-red-400" size={16} />
                <span className="text-white/80 text-sm font-medium">Made with love for Adrian & Gabby</span>
              </div>
              
              <h1 className="text-display text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Buni Money Tracker
              </h1>
              
              <p className="text-body text-xl md:text-2xl text-white/70 mb-8 max-w-3xl mx-auto leading-relaxed">
                The most beautiful and intuitive personal finance app designed exclusively for 
                <span className="text-white font-semibold"> Adrian and Gabby</span>. 
                Take control of your finances with style.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  href="/login"
                  className="glass-button px-8 py-4 rounded-2xl text-white font-medium text-lg apple-shimmer flex items-center gap-2 group"
                >
                  Get Started
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link
                  href="#features"
                  className="glass px-8 py-4 rounded-2xl text-white/80 font-medium text-lg hover:text-white transition-colors duration-300"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="glass-card p-6 rounded-2xl apple-slide-up" style={{ animationDelay: '0.2s' }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <FiDollarSign size={24} className="text-white" />
                  </div>
                  <h3 className="text-display text-2xl font-semibold text-white mb-2">100% Free</h3>
                  <p className="text-white/60">No hidden fees or subscriptions</p>
                </div>
                <div className="glass-card p-6 rounded-2xl apple-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-4">
                    <FiShield size={24} className="text-white" />
                  </div>
                  <h3 className="text-display text-2xl font-semibold text-white mb-2">Secure</h3>
                  <p className="text-white/60">Your data is always protected</p>
                </div>
                <div className="glass-card p-6 rounded-2xl apple-slide-up" style={{ animationDelay: '0.6s' }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
                    <FiStar size={24} className="text-white" />
                  </div>
                  <h3 className="text-display text-2xl font-semibold text-white mb-2">Premium</h3>
                  <p className="text-white/60">Apple-quality design & UX</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 apple-fade-in">
              <h2 className="text-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Everything you need to manage your finances
              </h2>
              <p className="text-body text-xl text-white/70 max-w-3xl mx-auto">
                Built specifically for Adrian and Gabby, Buni Money Tracker combines 
                powerful functionality with stunning design to make financial management effortless.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="glass-card p-8 rounded-2xl apple-slide-up apple-shimmer"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                      <Icon size={32} className="text-white" />
                    </div>
                    <h3 className="text-display text-2xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-body text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-12 rounded-3xl apple-fade-in">
              <div className="text-center mb-12">
                <h2 className="text-display text-4xl font-bold text-white mb-6 tracking-tight">
                  Why choose Buni Money Tracker?
                </h2>
                <p className="text-body text-xl text-white/70">
                  Designed with love for Adrian and Gabby's financial journey
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 apple-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <FiCheck size={16} className="text-white" />
                    </div>
                    <span className="text-white font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-12 rounded-3xl apple-fade-in">
              <h2 className="text-display text-4xl font-bold text-white mb-6 tracking-tight">
                Ready to take control of your finances?
              </h2>
              <p className="text-body text-xl text-white/70 mb-8">
                Join Adrian and Gabby in their journey to financial freedom with the most 
                beautiful money tracking app ever created.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-3 glass-button px-10 py-5 rounded-2xl text-white font-medium text-xl apple-shimmer group"
              >
                Start Your Journey
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="apple-fade-in">
              <h3 className="text-display text-2xl font-semibold text-white mb-4">
                Buni Money Tracker
              </h3>
              <p className="text-white/60 mb-6">
                Made with ❤️ exclusively for Adrian and Gabby
              </p>
              <div className="flex justify-center gap-6">
                <Link href="/login" className="text-white/60 hover:text-white transition-colors">
                  Get Started
                </Link>
                <Link href="#features" className="text-white/60 hover:text-white transition-colors">
                  Features
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

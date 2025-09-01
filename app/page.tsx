'use client';

import React, { useState, useEffect } from 'react';
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
  FiCheck,
  FiPlay,
  FiUsers,
  FiZap,
  FiAward,
  FiGlobe,
  FiLock,
  FiEye,
  FiPieChart
} from 'react-icons/fi';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FiTrendingUp,
      title: 'Smart Income Tracking',
      description: 'Automatically categorize and track all your income sources with AI-powered insights.',
      color: 'from-emerald-500 to-green-600',
      gradient: 'bg-gradient-to-br from-emerald-500/20 to-green-600/20',
      stats: '+45% accuracy'
    },
    {
      icon: FiTrendingDown,
      title: 'Expense Intelligence',
      description: 'Get intelligent spending analysis with predictive budgeting and smart recommendations.',
      color: 'from-rose-500 to-red-600',
      gradient: 'bg-gradient-to-br from-rose-500/20 to-red-600/20',
      stats: 'Save 30% more'
    },
    {
      icon: FiBarChart,
      title: 'Advanced Analytics',
      description: 'Beautiful interactive charts and real-time financial health scoring with AI insights.',
      color: 'from-blue-500 to-cyan-600',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-600/20',
      stats: '100+ metrics'
    },
    {
      icon: FiTarget,
      title: 'Goal Achievement',
      description: 'Set, track, and achieve financial goals with milestone celebrations and progress tracking.',
      color: 'from-violet-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-600/20',
      stats: '85% success rate'
    },
    {
      icon: FiShield,
      title: 'Bank-Level Security',
      description: 'Enterprise-grade encryption and privacy protection for your financial data.',
      color: 'from-indigo-500 to-blue-600',
      gradient: 'bg-gradient-to-br from-indigo-500/20 to-blue-600/20',
      stats: '256-bit encryption'
    },
    {
      icon: FiSmartphone,
      title: 'Cross-Platform Sync',
      description: 'Seamlessly access your finances across all devices with real-time synchronization.',
      color: 'from-pink-500 to-rose-600',
      gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
      stats: 'Instant sync'
    }
  ];

  const benefits = [
    { icon: FiZap, text: 'AI-powered insights', color: 'text-yellow-400' },
    { icon: FiUsers, text: 'Partner collaboration', color: 'text-blue-400' },
    { icon: FiLock, text: 'Bank-level security', color: 'text-green-400' },
    { icon: FiEye, text: 'Real-time tracking', color: 'text-purple-400' },
    { icon: FiPieChart, text: 'Advanced analytics', color: 'text-pink-400' },
    { icon: FiAward, text: 'Premium experience', color: 'text-orange-400' }
  ];

  const testimonials = [
    {
      name: 'Adrian',
      role: 'Primary User',
      content: 'Buni Money Tracker has completely transformed how I manage my finances. The AI insights are incredibly accurate!',
      avatar: '👨‍💼'
    },
    {
      name: 'Gabby',
      role: 'Partner',
      content: 'I love how we can collaborate on our shared expenses. The interface is so beautiful and intuitive!',
      avatar: '👩‍💼'
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" 
             style={{ 
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%)',
               animationDelay: '0s',
               animationDuration: '4s'
             }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse" 
             style={{ 
               background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 100%)',
               animationDelay: '2s',
               animationDuration: '4s'
             }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl animate-pulse" 
             style={{ 
               background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
               animationDelay: '4s',
               animationDuration: '4s'
             }} />
        
        {/* Floating Particles */}
        <div className="absolute top-1/5 left-1/5 w-2 h-2 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-2/5 right-1/4 w-1 h-1 rounded-full bg-white/30 animate-bounce" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-white/25 animate-bounce" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '3.5s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-8 animate-fade-in">
                <FiHeart className="text-red-400 animate-pulse" size={18} />
                <span className="text-white/90 text-sm font-medium">Made with ❤️ for Adrian & Gabby</span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-7xl md:text-8xl font-bold text-white mb-8 tracking-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Buni Money
                </span>
                <br />
                <span className="text-white">Tracker</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
                The most beautiful and intelligent personal finance app designed exclusively for 
                <span className="text-white font-semibold"> Adrian and Gabby</span>. 
                Take control of your finances with AI-powered insights and stunning design.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <Link
                  href="/login"
                  className="group relative px-10 py-5 rounded-2xl text-white font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center gap-3">
                    Get Started Free
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </div>
                </Link>
                
                <Link
                  href="#demo"
                  className="group px-10 py-5 rounded-2xl text-white/80 font-semibold text-lg border border-white/20 backdrop-blur-lg hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <FiPlay size={20} />
                    Watch Demo
                  </div>
                </Link>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
                <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <FiDollarSign size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-white">100% Free</h3>
                  <p className="text-white/60">No hidden fees or subscriptions</p>
                  <div className="mt-4 text-emerald-400 text-sm font-medium">Forever Free</div>
                </div>
                
                <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <FiShield size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-white">Bank-Level</h3>
                  <p className="text-white/60">256-bit encryption security</p>
                  <div className="mt-4 text-blue-400 text-sm font-medium">Enterprise Grade</div>
                </div>
                
                <div className="group p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <FiStar size={32} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2 text-white">AI-Powered</h3>
                  <p className="text-white/60">Smart insights & predictions</p>
                  <div className="mt-4 text-purple-400 text-sm font-medium">Machine Learning</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight text-white">
                Everything you need to
                <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent"> master your finances</span>
              </h2>
              <p className="text-xl max-w-4xl mx-auto text-white/70">
                Built specifically for Adrian and Gabby, Buni Money Tracker combines 
                cutting-edge AI technology with stunning design to make financial management effortless.
              </p>
            </div>

            {/* Interactive Feature Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              {/* Feature Display */}
              <div className="relative">
                <div className="liquid-card p-12 rounded-3xl backdrop-blur-lg border border-white/10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${features[activeFeature].color} flex items-center justify-center mb-8 shadow-2xl`}>
                    {React.createElement(features[activeFeature].icon, { size: 40, className: "text-white" })}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-white">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-white/70 text-lg leading-relaxed mb-6">
                    {features[activeFeature].description}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                    <span className="text-white/90 font-medium">{features[activeFeature].stats}</span>
                  </div>
                </div>
              </div>

              {/* Feature Navigation */}
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      onClick={() => setActiveFeature(index)}
                      className={`group cursor-pointer p-6 rounded-2xl transition-all duration-300 ${
                        activeFeature === index 
                          ? 'bg-white/10 backdrop-blur-lg border border-white/20 scale-105' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transition-transform duration-300 ${
                          activeFeature === index ? 'scale-110' : 'group-hover:scale-105'
                        }`}>
                          <Icon size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-white mb-1">{feature.title}</h4>
                          <p className="text-white/60 text-sm">{feature.description}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeFeature === index ? 'bg-white scale-150' : 'bg-white/30'
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="liquid-card p-16 rounded-3xl backdrop-blur-lg border border-white/10">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold mb-8 tracking-tight text-white">
                  Why choose <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">Buni Money Tracker</span>?
                </h2>
                <p className="text-xl text-white/70">
                  Designed with love for Adrian and Gabby's financial journey
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.text}
                    className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <benefit.icon size={20} className={benefit.color} />
                      </div>
                      <span className="font-semibold text-white text-lg">{benefit.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-8 tracking-tight text-white">
                What Adrian & Gabby say
              </h2>
              <p className="text-xl text-white/70">
                Real feedback from our exclusive users
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="liquid-card p-8 rounded-3xl backdrop-blur-lg border border-white/10 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-white/60">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/80 text-lg leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="liquid-card p-16 rounded-3xl backdrop-blur-lg border border-white/10 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: '30px 30px'
                }} />
              </div>
              
              <div className="relative z-10">
                <h2 className="text-6xl font-bold mb-8 tracking-tight text-white">
                  Ready to transform your finances?
                </h2>
                <p className="text-xl mb-12 text-white/70 max-w-3xl mx-auto">
                  Join Adrian and Gabby in their journey to financial freedom with the most 
                  beautiful and intelligent money tracking app ever created.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link
                    href="/login"
                    className="group relative px-12 py-6 rounded-2xl text-white font-bold text-xl overflow-hidden transition-all duration-300 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl" />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center gap-3">
                      Start Your Journey
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                    </div>
                  </Link>
                  
                  <Link
                    href="/signup"
                    className="px-12 py-6 rounded-2xl text-white/80 font-bold text-xl border-2 border-white/20 backdrop-blur-lg hover:bg-white/10 hover:text-white transition-all duration-300"
                  >
                    Create Account
                  </Link>
                </div>
                
                <div className="mt-8 text-white/50 text-sm">
                  No credit card required • Free forever • 30-second setup
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="py-16 px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
                  <FiDollarSign size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">Buni Money Tracker</h3>
              </div>
              
              <p className="mb-8 text-white/60 text-lg">
                Made with ❤️ exclusively for Adrian and Gabby
              </p>
              
              <div className="flex justify-center gap-8 mb-8">
                <Link href="/login" className="text-white/60 hover:text-white transition-colors font-medium">
                  Get Started
                </Link>
                <Link href="#features" className="text-white/60 hover:text-white transition-colors font-medium">
                  Features
                </Link>
                <Link href="/login" className="text-white/60 hover:text-white transition-colors font-medium">
                  Sign In
                </Link>
              </div>
              
              <div className="text-white/40 text-sm">
                © 2024 Buni Money Tracker. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-fade-in:nth-child(1) { animation-delay: 0.1s; }
        .animate-fade-in:nth-child(2) { animation-delay: 0.3s; }
        .animate-fade-in:nth-child(3) { animation-delay: 0.5s; }
        .animate-fade-in:nth-child(4) { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
}

'use client';

import React from "react";
import { LuTrendingUpDown } from "react-icons/lu";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl apple-float" style={{ background: 'var(--theme-bg-gradient-1)', animationDelay: '0s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl apple-float" style={{ background: 'var(--theme-bg-gradient-2)', animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl apple-float" style={{ background: 'var(--theme-bg-gradient-3)', animationDelay: '4s' }} />
      </div>

      <div className="w-screen h-screen md:w-[60vw] px-8 md:px-12 pt-8 pb-12 flex flex-col justify-center relative z-10">
        <div className="apple-fade-in">
          <h2 className="text-display text-3xl font-semibold mb-8 tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Buni Tracker
          </h2>
          {children}
        </div>
      </div>

      <div className="hidden md:block w-[40vw] h-screen overflow-hidden p-8 relative">
        {/* Apple Liquid Glass Orbs */}
        <div className="w-72 h-72 rounded-full liquid-card absolute -top-16 -left-16 apple-float" 
             style={{ animationDelay: '0.5s' }} />
        <div className="w-64 h-80 rounded-full liquid-card absolute top-[25%] -right-20 apple-float" 
             style={{ animationDelay: '1.5s' }} />
        <div className="w-56 h-56 rounded-full liquid-card absolute -bottom-16 -left-16 apple-float" 
             style={{ animationDelay: '2.5s' }} />
        
        {/* Additional floating elements */}
        <div className="w-40 h-40 rounded-full liquid-card absolute top-[60%] right-[25%] apple-float" 
             style={{ animationDelay: '3.5s' }} />
        <div className="w-32 h-32 rounded-full liquid-card absolute top-[15%] right-[15%] apple-float" 
             style={{ animationDelay: '4.5s' }} />

        <div className="grid grid-cols-1 z-20 relative h-full">
          <div className="flex flex-col justify-center h-full space-y-6">
            <StatsInfoCard
              icon={<LuTrendingUpDown />}
              label="Track Your Progress"
              value="Smart"
              color="from-emerald-500 to-teal-600"
            />
            <FinancialTipsCard />
            <FeatureHighlightsCard />
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatsInfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

const StatsInfoCard: React.FC<StatsInfoCardProps> = ({ icon, label, value, color }) => {
  return (
    <div className="liquid-card p-8 rounded-3xl apple-fade-in" style={{ animationDelay: '0.8s' }}>
      <div className="flex gap-8 items-center">
        <div
          className={`w-16 h-16 flex items-center justify-center text-3xl text-white bg-gradient-to-br ${color} rounded-3xl shadow-2xl apple-glow`}
        >
          {icon}
        </div>
        <div>
          <h6 className="text-body text-sm mb-3 font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</h6>
          <span className="text-display text-3xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>{value}</span>
        </div>
      </div>
    </div>
  );
};

const FinancialTipsCard: React.FC = () => {
  const [randomTip, setRandomTip] = React.useState<string>("");
  
  React.useEffect(() => {
    const tips = [
      "Save 20% of your income",
      "Track every expense",
      "Set SMART financial goals",
      "Build an emergency fund"
    ];
    
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);
  
  return (
    <div className="liquid-card p-6 rounded-2xl apple-fade-in" style={{ animationDelay: '1.2s' }}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>💡 Financial Tip</h4>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {randomTip || "Track every expense"}
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureHighlightsCard: React.FC = () => {
  const features = [
    { icon: "📊", name: "Smart Analytics", desc: "Visual insights into your spending" },
    { icon: "🎯", name: "Goal Tracking", desc: "Achieve your financial targets" },
    { icon: "👥", name: "Shared Expenses", desc: "Split costs with your partner" },
    { icon: "🏦", name: "Multi-Account", desc: "Manage all your accounts" }
  ];
  
  return (
    <div className="liquid-card p-6 rounded-2xl apple-fade-in" style={{ animationDelay: '1.6s' }}>
      <h4 className="font-semibold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>✨ Key Features</h4>
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-lg">{feature.icon}</span>
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{feature.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthLayout;

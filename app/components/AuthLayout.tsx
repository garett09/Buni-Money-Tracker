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
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl apple-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/10 to-cyan-500/10 rounded-full blur-3xl apple-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl apple-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-screen h-screen md:w-[60vw] px-8 md:px-12 pt-8 pb-12 flex flex-col justify-center relative z-10">
        <div className="apple-fade-in">
          <h2 className="text-display text-3xl font-semibold text-white mb-8 tracking-tight">
            Buni Tracker
          </h2>
          {children}
        </div>
      </div>

      <div className="hidden md:block w-[40vw] h-screen overflow-hidden p-8 relative">
        {/* Apple Liquid Glass Orbs */}
        <div className="w-72 h-72 rounded-full glass-card absolute -top-16 -left-16 apple-float apple-glow" 
             style={{ animationDelay: '0.5s' }} />
        <div className="w-64 h-80 rounded-full glass-card absolute top-[25%] -right-20 apple-float apple-glow" 
             style={{ animationDelay: '1.5s' }} />
        <div className="w-56 h-56 rounded-full glass-card absolute -bottom-16 -left-16 apple-float apple-glow" 
             style={{ animationDelay: '2.5s' }} />
        
        {/* Additional floating elements */}
        <div className="w-40 h-40 rounded-full glass absolute top-[60%] right-[25%] apple-float" 
             style={{ animationDelay: '3.5s' }} />
        <div className="w-32 h-32 rounded-full glass absolute top-[15%] right-[15%] apple-float" 
             style={{ animationDelay: '4.5s' }} />

        <div className="grid grid-cols-1 z-20 relative h-full">
          <div className="flex flex-col justify-center h-full">
            <StatsInfoCard
              icon={<LuTrendingUpDown />}
              label="Track Your Income & Expenses"
              value="2,335,232"
              color="from-blue-500 to-purple-600"
            />
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
    <div className="glass-card p-8 rounded-3xl apple-fade-in apple-shimmer" style={{ animationDelay: '0.8s' }}>
      <div className="flex gap-8 items-center">
        <div
          className={`w-16 h-16 flex items-center justify-center text-3xl text-white bg-gradient-to-br ${color} rounded-3xl shadow-2xl apple-glow`}
        >
          {icon}
        </div>
        <div>
          <h6 className="text-body text-sm text-white/70 mb-3 font-medium tracking-wide">{label}</h6>
          <span className="text-display text-3xl font-semibold text-white tracking-tight">₱{value}</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

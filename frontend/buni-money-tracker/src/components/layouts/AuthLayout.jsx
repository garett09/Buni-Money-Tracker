import React from "react";
import CARD_2 from "../../assets/images/card2.png";
import { LuTrendingUpDown } from "react-icons/lu";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="w-screen h-screen md:w-[60vw] px-8 md:px-12 pt-8 pb-12 flex flex-col justify-center">
        <div className="ios-fade-in">
          <h2 className="text-display text-2xl font-semibold text-white mb-8">Buni Tracker</h2>
          {children}
        </div>
      </div>

      <div className="hidden md:block w-[40vw] h-screen overflow-hidden p-8 relative">
        {/* iOS 26 Liquid Glass Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        
        {/* Floating Glass Orbs */}
        <div className="w-48 h-48 rounded-full glass absolute -top-7 -left-5 ios-bounce" 
             style={{ animationDelay: '0.2s' }} />
        <div className="w-48 h-56 rounded-full glass absolute top-[30%] -right-10 ios-bounce" 
             style={{ animationDelay: '0.4s' }} />
        <div className="w-48 h-48 rounded-full glass absolute -bottom-7 -left-5 ios-bounce" 
             style={{ animationDelay: '0.6s' }} />
        
        {/* Additional floating elements */}
        <div className="w-32 h-32 rounded-full glass absolute top-[60%] right-[20%] ios-bounce" 
             style={{ animationDelay: '0.8s' }} />
        <div className="w-24 h-24 rounded-full glass absolute top-[10%] right-[10%] ios-bounce" 
             style={{ animationDelay: '1s' }} />

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

        <img
          src={CARD_2}
          className="w-64 lg:w-[90%] absolute bottom-10 right-8 glass-card rounded-2xl p-4 ios-slide-up"
          style={{ animationDelay: '1.2s' }}
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className="glass-card p-6 rounded-2xl ios-fade-in" style={{ animationDelay: '0.5s' }}>
      <div className="flex gap-6 items-center">
        <div
          className={`w-14 h-14 flex items-center justify-center text-2xl text-white bg-gradient-to-br ${color} rounded-2xl shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <h6 className="text-body text-sm text-white/80 mb-2 font-medium">{label}</h6>
          <span className="text-display text-2xl font-semibold text-white">₱{value}</span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AuthLayout from "@/app/components/AuthLayout";
import ThemePicker from "@/app/components/ThemePicker";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiShield, 
  FiTrendingUp, 
  FiBarChart,
  FiZap,
  FiHeart,
  FiStar,
  FiCheck,
  FiUser,
  FiUsers,
  FiTarget,
  FiAward
} from 'react-icons/fi';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const { token, user } = data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Account created successfully! 🎉");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FiTrendingUp,
      title: 'Smart Analytics',
      description: 'AI-powered insights and predictions',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: FiUsers,
      title: 'Partner Collaboration',
      description: 'Share expenses with your partner',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FiTarget,
      title: 'Goal Achievement',
      description: 'Set and track financial goals',
      color: 'from-purple-500 to-violet-600'
    }
  ];

  const benefits = [
    { icon: FiCheck, text: 'Free forever', color: 'text-emerald-400' },
    { icon: FiCheck, text: 'No credit card required', color: 'text-blue-400' },
    { icon: FiCheck, text: '30-second setup', color: 'text-purple-400' },
    { icon: FiCheck, text: 'Bank-level security', color: 'text-green-400' }
  ];

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        {/* Enhanced Header */}
        <div className={`mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-2xl animate-pulse">
                  <FiStar size={32} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                  <FiAward size={12} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-3 tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                  Join the Journey
                </h1>
                <p className="text-xl font-light text-white/70">
                  Create your account and start managing finances like a pro
                </p>
              </div>
            </div>
            <ThemePicker />
          </div>
        </div>

        {/* Enhanced Form */}
        <div className={`liquid-card p-12 rounded-3xl backdrop-blur-lg border border-white/10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.2s' }}>
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-3 text-white">Create Account</h2>
            <p className="text-white/60 text-lg">Start your financial freedom journey today</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="name" className="block text-lg font-semibold mb-3 text-white">
                Full Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-medium text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <FiUser size={24} className="text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="email" className="block text-lg font-semibold mb-3 text-white">
                Email Address
              </label>
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-medium text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="Enter your email address"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <FiMail size={24} className="text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label htmlFor="password" className="block text-lg font-semibold mb-3 text-white">
                  Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-medium text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Create a password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <FiEyeOff size={20} className="text-white/40 hover:text-white transition-colors duration-300" />
                      ) : (
                        <FiEye size={20} className="text-white/40 hover:text-white transition-colors duration-300" />
                      )}
                    </button>
                    <FiLock size={20} className="text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4">
                <label htmlFor="confirmPassword" className="block text-lg font-semibold mb-3 text-white">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl text-xl font-medium text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-300"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={20} className="text-white/40 hover:text-white transition-colors duration-300" />
                      ) : (
                        <FiEye size={20} className="text-white/40 hover:text-white transition-colors duration-300" />
                      )}
                    </button>
                    <FiLock size={20} className="text-white/40 group-focus-within:text-emerald-400 transition-colors duration-300" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-6 px-8 font-bold text-xl text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
                  </>
                )}
              </div>
            </button>

            <div className="text-center pt-6">
              <p className="text-white/60 text-lg">
                Already have an account?{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-semibold text-lg hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Enhanced Feature Highlights */}
        <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.4s' }}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group relative overflow-hidden">
                <div className="liquid-card p-8 rounded-2xl backdrop-blur-lg border border-white/10 hover:scale-105 transition-all duration-300 hover:bg-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={28} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                      <p className="text-white/60 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className={`mt-8 liquid-card p-6 rounded-2xl backdrop-blur-lg border border-white/10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.6s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div key={benefit.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <benefit.icon size={16} className={benefit.color} />
                </div>
                <span className="text-white/80 text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`mt-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center justify-center gap-6 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <FiShield size={16} />
              <span>256-bit encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <FiZap size={16} />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-2">
              <FiHeart size={16} />
              <span>Made with love</span>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;

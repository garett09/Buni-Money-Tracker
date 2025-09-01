'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AuthLayout from "@/app/components/AuthLayout";
import ThemePicker from "@/app/components/ThemePicker";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, user } = data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        {/* Enhanced Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-3 tracking-tight text-white">Welcome Back</h1>
                <p className="text-xl text-white/70 font-light">
                  Please enter your details to log in to your account
                </p>
              </div>
            </div>
            <ThemePicker />
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="liquid-card p-10 rounded-3xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-white/60">Access your financial dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="email" className="block text-lg font-semibold text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl"
                  placeholder="Enter your email address"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="block text-lg font-semibold text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full liquid-button text-white py-6 px-8 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl hover:scale-105 transition-all duration-300"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="text-center pt-4">
              <p className="text-white/60 text-lg">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold text-lg">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden">
            <div className="liquid-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Track Expenses</h3>
                  <p className="text-white/60 text-sm">Monitor your spending habits</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="liquid-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Set Goals</h3>
                  <p className="text-white/60 text-sm">Achieve your financial targets</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="liquid-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Secure</h3>
                  <p className="text-white/60 text-sm">Your data is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

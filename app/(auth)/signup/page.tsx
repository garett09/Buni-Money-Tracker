'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AuthLayout from "@/app/components/AuthLayout";
import ThemePicker from "@/app/components/ThemePicker";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
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
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-6xl font-bold mb-3 tracking-tight text-white">Create Account</h1>
                <p className="text-xl text-white/70 font-light">
                  Join us and start managing your finances today
                </p>
              </div>
            </div>
            <ThemePicker />
          </div>
        </div>

        {/* Enhanced Form */}
        <div className="liquid-card p-10 rounded-3xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Sign Up</h2>
            <p className="text-white/60">Create your financial dashboard account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label htmlFor="name" className="block text-lg font-semibold text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl"
                  placeholder="Enter your full name"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

              <div className="space-y-3">
                <label htmlFor="confirmPassword" className="block text-lg font-semibold text-white mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="liquid-input w-full px-8 py-6 focus:outline-none text-xl font-medium rounded-2xl"
                    placeholder="Confirm your password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                    <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full liquid-button text-white py-6 px-8 font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl hover:scale-105 transition-all duration-300"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="text-center pt-4">
              <p className="text-white/60 text-lg">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-semibold text-lg">
                  Sign in
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
                  <h3 className="text-white font-semibold text-lg">Smart Analytics</h3>
                  <p className="text-white/60 text-sm">Get insights into your spending</p>
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
                  <h3 className="text-white font-semibold text-lg">Goal Setting</h3>
                  <p className="text-white/60 text-sm">Plan and achieve your dreams</p>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden">
            <div className="liquid-card p-6 rounded-2xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Share with Partner</h3>
                  <p className="text-white/60 text-sm">Collaborate on finances</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUpPage;

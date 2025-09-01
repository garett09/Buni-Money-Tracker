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
        <div className="apple-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-display text-4xl font-semibold text-white mb-3 tracking-tight">Welcome Back</h3>
              <p className="text-body text-white/60 text-lg">
                Please enter your details to log in.
              </p>
            </div>
            <ThemePicker />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 apple-slide-up" style={{ animationDelay: '0.3s' }}>
          <div>
            <label htmlFor="email" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-body text-sm font-medium text-white/80 mb-3 tracking-wide">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="liquid-input w-full px-6 py-4 focus:outline-none text-lg"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full liquid-button text-white py-4 px-6 font-medium text-body text-lg disabled:opacity-50 disabled:cursor-not-allowed apple-shimmer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-body text-white/60 mt-10 apple-fade-in text-lg" style={{ animationDelay: '0.6s' }}>
          Don't have an account?{" "}
          <Link href="/signup" className="text-white font-medium hover:text-white/80 transition-colors duration-300">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
